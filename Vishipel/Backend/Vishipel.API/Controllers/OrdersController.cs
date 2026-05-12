using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vishipel.Infrastructure.Data;
using Vishipel.Core.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Vishipel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        // ── DTOs ──
        public class CreateOrderDto
        {
            public int QuoteRequestId { get; set; }
            public string PaymentMethod { get; set; } = "HợpĐồng";
            public string? Note { get; set; }
            public List<OrderItemDto> Items { get; set; } = new();
            public List<PaymentPhaseDto>? PaymentSchedules { get; set; }
        }

        public class OrderItemDto
        {
            public int ProductId { get; set; }
            public string ProductName { get; set; } = "";
            public string? Unit { get; set; } = "Cái";
            public int Quantity { get; set; } = 1;
            public decimal UnitPrice { get; set; }
            public string? SerialNumbersJson { get; set; }
            public string? InstallLocation { get; set; }
        }

        public class PaymentPhaseDto
        {
            public string PhaseName { get; set; } = "";
            public int PhaseOrder { get; set; }
            public decimal Percentage { get; set; }
            public DateTime? DueDate { get; set; }
            public string? Note { get; set; }
        }

        public class UpdateStatusDto
        {
            public string Status { get; set; } = "";
        }

        // ── Sinh mã đơn hàng tự động ──
        private async Task<string> GenerateOrderCode()
        {
            var year = DateTime.UtcNow.Year;
            var count = await _context.Orders.CountAsync(o => o.CreatedAt.Year == year);
            return $"DH-{year}-{(count + 1):D5}";
        }

        // 1. TẠO ĐƠN HÀNG TỪ BÁO GIÁ ĐÃ ĐƯỢC XÁC NHẬN
        [HttpPost]
        [Authorize(Roles = "Admin, Manager, SaleManager")]
        public async Task<ActionResult<Order>> CreateOrder(CreateOrderDto dto)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
                return Unauthorized();

            // Kiểm tra QuoteRequest tồn tại và đã được Accepted
            var quote = await _context.QuoteRequests
                .Include(q => q.Items)
                .FirstOrDefaultAsync(q => q.Id == dto.QuoteRequestId);

            if (quote == null) return NotFound(new { message = "Không tìm thấy yêu cầu báo giá." });
            if (quote.Status != "Accepted") return BadRequest(new { message = "Báo giá chưa được khách hàng xác nhận." });

            // Kiểm tra chưa có đơn hàng nào cho báo giá này
            var existingOrder = await _context.Orders.AnyAsync(o => o.QuoteRequestId == dto.QuoteRequestId);
            if (existingOrder) return BadRequest(new { message = "Đã có đơn hàng cho báo giá này." });

            var order = new Order
            {
                OrderCode = await GenerateOrderCode(),
                QuoteRequestId = dto.QuoteRequestId,
                CustomerId = quote.UserId,
                CreatedByUserId = userId,
                Status = "Created",
                PaymentMethod = dto.PaymentMethod,
                Note = dto.Note,
                CreatedAt = DateTime.UtcNow,
                Items = dto.Items.Select(i => new OrderItem
                {
                    ProductId = i.ProductId,
                    ProductName = i.ProductName,
                    Unit = i.Unit,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    TotalPrice = i.Quantity * i.UnitPrice,
                    SerialNumbersJson = i.SerialNumbersJson,
                    InstallLocation = i.InstallLocation
                }).ToList()
            };

            order.TotalAmount = order.Items.Sum(i => i.TotalPrice);

            // Tạo lịch thanh toán theo đợt (nếu có)
            if (dto.PaymentSchedules != null && dto.PaymentSchedules.Any())
            {
                order.PaymentSchedules = dto.PaymentSchedules.Select(ps => new PaymentSchedule
                {
                    PhaseName = ps.PhaseName,
                    PhaseOrder = ps.PhaseOrder,
                    Percentage = ps.Percentage,
                    Amount = order.TotalAmount * ps.Percentage / 100,
                    DueDate = ps.DueDate,
                    Status = "Pending",
                    Note = ps.Note
                }).ToList();
            }

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return Ok(order);
        }

        // 2. LẤY TẤT CẢ ĐƠN HÀNG (Admin/Sale)
        [HttpGet]
        [Authorize(Roles = "Admin, Manager, SaleManager, Warehouse, Accounting")]
        public async Task<ActionResult<IEnumerable<Order>>> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.Items)
                .Include(o => o.Contract)
                .Include(o => o.DeliveryOrder)
                .Include(o => o.Invoice)
                .Include(o => o.PaymentSchedules)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            return Ok(orders);
        }

        // 3. CHI TIẾT ĐƠN HÀNG
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.Items)
                .Include(o => o.Contract)
                .Include(o => o.DeliveryOrder)
                .Include(o => o.Invoice)
                .Include(o => o.PaymentSchedules)
                .Include(o => o.QuoteRequest)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return NotFound();
            return Ok(order);
        }

        // 4. ĐƠN HÀNG CỦA KHÁCH
        [HttpGet("my-orders")]
        public async Task<ActionResult<IEnumerable<Order>>> GetMyOrders()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
                return Unauthorized();

            var orders = await _context.Orders
                .Include(o => o.Items)
                .Include(o => o.Contract)
                .Include(o => o.DeliveryOrder)
                .Include(o => o.Invoice)
                .Include(o => o.PaymentSchedules)
                .Where(o => o.CustomerId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            return Ok(orders);
        }

        // 5. CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin, Manager, SaleManager")]
        public async Task<IActionResult> UpdateStatus(int id, UpdateStatusDto dto)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            order.Status = dto.Status;
            order.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(order);
        }
    }
}
