using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vishipel.Infrastructure.Data;
using Vishipel.Core.Models;
using Microsoft.AspNetCore.Authorization;

namespace Vishipel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class InvoicesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InvoicesController(AppDbContext context)
        {
            _context = context;
        }

        // ── DTOs ──
        public class CreateInvoiceDto
        {
            public int OrderId { get; set; }
            public string? Department { get; set; }
            public string? RecipientName { get; set; }
            public string? BuyerName { get; set; }
            public string? BuyerCompany { get; set; }
            public string? BuyerAddress { get; set; }
            public string? BuyerTaxCode { get; set; }
            public string? Content { get; set; }
            public string PaymentMethod { get; set; } = "Chuyển khoản";
            public string? BankAccount { get; set; }
            public decimal VatRate { get; set; } = 10;
            public DateTime? InvoiceDate { get; set; }
        }

        public class UpdateInvoiceDto : CreateInvoiceDto { }

        // Sinh mã hóa đơn
        private async Task<string> GenerateInvoiceNumber()
        {
            var year = DateTime.UtcNow.Year;
            var count = await _context.Invoices.CountAsync(i => i.CreatedAt.Year == year);
            return $"HD-{year}-{(count + 1):D5}";
        }

        // Chuyển số thành chữ tiếng Việt
        private static string NumberToWords(decimal number)
        {
            if (number == 0) return "Không đồng";

            string[] ones = { "", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín" };
            string[] teens = { "mười", "mười một", "mười hai", "mười ba", "mười bốn", "mười lăm", "mười sáu", "mười bảy", "mười tám", "mười chín" };
            string[] tens = { "", "", "hai mươi", "ba mươi", "bốn mươi", "năm mươi", "sáu mươi", "bảy mươi", "tám mươi", "chín mươi" };
            string[] groups = { "", "nghìn", "triệu", "tỷ" };

            long n = (long)Math.Floor(number);
            if (n == 0) return "Không đồng";

            var parts = new List<string>();
            int groupIndex = 0;

            while (n > 0)
            {
                int chunk = (int)(n % 1000);
                if (chunk != 0)
                {
                    var chunkStr = new List<string>();
                    int h = chunk / 100;
                    int t = (chunk % 100) / 10;
                    int o = chunk % 10;

                    if (h > 0) chunkStr.Add(ones[h] + " trăm");
                    if (t == 0 && o > 0 && h > 0) chunkStr.Add("lẻ");
                    if (t == 1) chunkStr.Add(teens[o]);
                    else if (t > 1)
                    {
                        chunkStr.Add(tens[t]);
                        if (o == 1) chunkStr.Add("mốt");
                        else if (o == 5) chunkStr.Add("lăm");
                        else if (o > 0) chunkStr.Add(ones[o]);
                    }
                    else if (t == 0 && !(t == 0 && o > 0 && h > 0))
                    {
                        if (o > 0) chunkStr.Add(ones[o]);
                    }
                    else if (o > 0) chunkStr.Add(ones[o]);

                    string g = groups[groupIndex];
                    parts.Insert(0, string.Join(" ", chunkStr) + (g.Length > 0 ? " " + g : ""));
                }
                n /= 1000;
                groupIndex++;
            }

            var result = string.Join(" ", parts).Trim();
            // Viết hoa chữ cái đầu
            result = char.ToUpper(result[0]) + result.Substring(1) + " đồng";
            return result;
        }

        // 1. TẠO HÓA ĐƠN (chỉ khi đã giao hàng - Delivered)
        [HttpPost]
        [Authorize(Roles = "Admin, Manager, Accounting")]
        public async Task<ActionResult<Invoice>> CreateInvoice(CreateInvoiceDto dto)
        {
            var order = await _context.Orders
                .Include(o => o.Items)
                .Include(o => o.DeliveryOrder)
                .FirstOrDefaultAsync(o => o.Id == dto.OrderId);

            if (order == null) return NotFound(new { message = "Không tìm thấy đơn hàng." });

            // Kiểm tra trực tiếp phiếu xuất kho từ DB
            var deliveryOrder = await _context.DeliveryOrders.FirstOrDefaultAsync(d => d.OrderId == dto.OrderId);
            
            if (deliveryOrder == null || (deliveryOrder.Status != "Pending" && deliveryOrder.Status != "Delivering" && deliveryOrder.Status != "Delivered"))
                return BadRequest(new { message = "Chỉ xuất hóa đơn sau khi đã lập phiếu xuất kho." });

            var existing = await _context.Invoices.AnyAsync(i => i.OrderId == dto.OrderId);
            if (existing) return BadRequest(new { message = "Đã có hóa đơn cho đơn hàng này." });

            var subTotal = order.TotalAmount;
            var vatAmount = subTotal * dto.VatRate / 100;
            var totalAmount = subTotal + vatAmount;

            var invoice = new Invoice
            {
                InvoiceNumber = await GenerateInvoiceNumber(),
                OrderId = dto.OrderId,
                Department = dto.Department,
                RecipientName = dto.RecipientName,
                BuyerName = dto.BuyerName,
                BuyerCompany = dto.BuyerCompany,
                BuyerAddress = dto.BuyerAddress,
                BuyerTaxCode = dto.BuyerTaxCode,
                Content = dto.Content ?? "Cung cấp thiết bị",
                PaymentMethod = dto.PaymentMethod,
                BankAccount = dto.BankAccount,
                SubTotal = subTotal,
                VatRate = dto.VatRate,
                VatAmount = vatAmount,
                TotalAmount = totalAmount,
                AmountInWords = NumberToWords(totalAmount),
                Status = "Draft",
                InvoiceDate = dto.InvoiceDate ?? DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };

            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();

            return Ok(invoice);
        }

        // 2. CHI TIẾT HÓA ĐƠN
        [HttpGet("{id}")]
        public async Task<ActionResult<Invoice>> GetInvoice(int id)
        {
            var invoice = await _context.Invoices
                .Include(i => i.Order)
                    .ThenInclude(o => o!.Items)
                .Include(i => i.Order)
                    .ThenInclude(o => o!.Customer)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (invoice == null) return NotFound();
            return Ok(invoice);
        }

        // 3. CẬP NHẬT HÓA ĐƠN (chỉ khi Draft)
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin, Manager, Accounting")]
        public async Task<IActionResult> UpdateInvoice(int id, UpdateInvoiceDto dto)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice == null) return NotFound();
            if (invoice.Status != "Draft") return BadRequest(new { message = "Chỉ sửa được hóa đơn Draft." });

            invoice.Department = dto.Department;
            invoice.RecipientName = dto.RecipientName;
            invoice.BuyerName = dto.BuyerName;
            invoice.BuyerCompany = dto.BuyerCompany;
            invoice.BuyerAddress = dto.BuyerAddress;
            invoice.BuyerTaxCode = dto.BuyerTaxCode;
            invoice.Content = dto.Content;
            invoice.PaymentMethod = dto.PaymentMethod;
            invoice.BankAccount = dto.BankAccount;
            invoice.VatRate = dto.VatRate;
            invoice.VatAmount = invoice.SubTotal * dto.VatRate / 100;
            invoice.TotalAmount = invoice.SubTotal + invoice.VatAmount;
            invoice.AmountInWords = NumberToWords(invoice.TotalAmount);

            await _context.SaveChangesAsync();
            return Ok(invoice);
        }

        // 4. PHÁT HÀNH HÓA ĐƠN
        [HttpPut("{id}/issue")]
        [Authorize(Roles = "Admin, Manager, Accounting")]
        public async Task<IActionResult> IssueInvoice(int id)
        {
            var invoice = await _context.Invoices.Include(i => i.Order).FirstOrDefaultAsync(i => i.Id == id);
            if (invoice == null) return NotFound();
            if (invoice.Status != "Draft") return BadRequest(new { message = "Hóa đơn đã được phát hành." });

            invoice.Status = "Issued";
            invoice.IssuedAt = DateTime.UtcNow;

            if (invoice.Order != null)
            {
                invoice.Order.Status = "InvoiceIssued";
                invoice.Order.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã phát hành hóa đơn thành công!", invoice });
        }

        // 5. LẤY TẤT CẢ HÓA ĐƠN
        [HttpGet]
        [Authorize(Roles = "Admin, Manager, Accounting")]
        public async Task<ActionResult<IEnumerable<Invoice>>> GetAllInvoices()
        {
            var invoices = await _context.Invoices
                .Include(i => i.Order)
                    .ThenInclude(o => o!.Customer)
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();

            return Ok(invoices);
        }
    }
}
