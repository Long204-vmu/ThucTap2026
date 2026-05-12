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
    public class ContractsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ContractsController(AppDbContext context)
        {
            _context = context;
        }

        // ── DTOs ──
        public class CreateContractDto
        {
            public int OrderId { get; set; }
            // Bên A (Khách hàng)
            public string PartyAName { get; set; } = "";
            public string? PartyAAddress { get; set; }
            public string? PartyAPhone { get; set; }
            public string? PartyAFax { get; set; }
            public string? PartyABankAccount { get; set; }
            public string? PartyABank { get; set; }
            public string? PartyATaxCode { get; set; }
            public string? PartyARepresentative { get; set; }
            public string? PartyAPosition { get; set; }
            // Bên B (VISHIPEL)
            public string? PartyBName { get; set; }
            public string? PartyBAddress { get; set; }
            public string? PartyBPhone { get; set; }
            public string? PartyBFax { get; set; }
            public string? PartyBBankAccount { get; set; }
            public string? PartyBBank { get; set; }
            public string? PartyBTaxCode { get; set; }
            public string? PartyBRepresentative { get; set; }
            public string? PartyBPosition { get; set; }
            // Nội dung
            public string? Subject { get; set; }
            public string? PaymentTerms { get; set; }
            public string? DeliveryTerms { get; set; }
            public string? WarrantyTerms { get; set; }
            public string? AdditionalTerms { get; set; }
            public decimal DiscountPercent { get; set; } = 0;
            public DateTime? ContractDate { get; set; }
        }

        public class UpdateContractDto : CreateContractDto { }

        public class RejectContractDto
        {
            public string? Reason { get; set; }
        }

        // Sinh mã hợp đồng tự động
        private async Task<string> GenerateContractNumber()
        {
            var year = DateTime.UtcNow.Year;
            var count = await _context.Contracts.CountAsync(c => c.CreatedAt.Year == year);
            return $"{(count + 1):D3}/{year}/VISHIPEL";
        }

        // 1. TẠO HỢP ĐỒNG TỪ ĐƠN HÀNG
        [HttpPost]
        [Authorize(Roles = "Admin, Manager, SaleManager")]
        public async Task<ActionResult<Contract>> CreateContract(CreateContractDto dto)
        {
            var order = await _context.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == dto.OrderId);
            if (order == null) return NotFound(new { message = "Không tìm thấy đơn hàng." });

            // Kiểm tra chưa có hợp đồng
            var existing = await _context.Contracts.AnyAsync(c => c.OrderId == dto.OrderId);
            if (existing) return BadRequest(new { message = "Đơn hàng này đã có hợp đồng." });

            var totalAfterDiscount = order.TotalAmount * (1 - dto.DiscountPercent / 100);

            var contract = new Contract
            {
                ContractNumber = await GenerateContractNumber(),
                OrderId = dto.OrderId,
                PartyAName = dto.PartyAName,
                PartyAAddress = dto.PartyAAddress,
                PartyAPhone = dto.PartyAPhone,
                PartyAFax = dto.PartyAFax,
                PartyABankAccount = dto.PartyABankAccount,
                PartyABank = dto.PartyABank,
                PartyATaxCode = dto.PartyATaxCode,
                PartyARepresentative = dto.PartyARepresentative,
                PartyAPosition = dto.PartyAPosition,
                PartyBName = dto.PartyBName ?? "Công ty TNHH MTV Thông tin Điện tử Hàng hải Việt Nam",
                PartyBAddress = dto.PartyBAddress,
                PartyBPhone = dto.PartyBPhone,
                PartyBFax = dto.PartyBFax,
                PartyBBankAccount = dto.PartyBBankAccount,
                PartyBBank = dto.PartyBBank,
                PartyBTaxCode = dto.PartyBTaxCode,
                PartyBRepresentative = dto.PartyBRepresentative,
                PartyBPosition = dto.PartyBPosition,
                Subject = dto.Subject ?? "Cung cấp thiết bị",
                PaymentTerms = dto.PaymentTerms,
                DeliveryTerms = dto.DeliveryTerms,
                WarrantyTerms = dto.WarrantyTerms,
                AdditionalTerms = dto.AdditionalTerms,
                DiscountPercent = dto.DiscountPercent,
                TotalAmount = totalAfterDiscount,
                Status = "Draft",
                ContractDate = dto.ContractDate ?? DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };

            _context.Contracts.Add(contract);

            // Cập nhật trạng thái đơn hàng
            order.Status = "ContractDraft";
            order.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(contract);
        }

        // 2. CHI TIẾT HỢP ĐỒNG
        [HttpGet("{id}")]
        public async Task<ActionResult<Contract>> GetContract(int id)
        {
            var contract = await _context.Contracts
                .Include(c => c.Order)
                    .ThenInclude(o => o!.Items)
                .Include(c => c.Order)
                    .ThenInclude(o => o!.Customer)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (contract == null) return NotFound();
            return Ok(contract);
        }

        // 3. CẬP NHẬT HỢP ĐỒNG (chỉ khi Draft)
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin, Manager, SaleManager")]
        public async Task<IActionResult> UpdateContract(int id, UpdateContractDto dto)
        {
            var contract = await _context.Contracts.FindAsync(id);
            if (contract == null) return NotFound();
            if (contract.Status != "Draft") return BadRequest(new { message = "Chỉ có thể sửa hợp đồng ở trạng thái Draft." });

            contract.PartyAName = dto.PartyAName;
            contract.PartyAAddress = dto.PartyAAddress;
            contract.PartyAPhone = dto.PartyAPhone;
            contract.PartyAFax = dto.PartyAFax;
            contract.PartyABankAccount = dto.PartyABankAccount;
            contract.PartyABank = dto.PartyABank;
            contract.PartyATaxCode = dto.PartyATaxCode;
            contract.PartyARepresentative = dto.PartyARepresentative;
            contract.PartyAPosition = dto.PartyAPosition;
            contract.Subject = dto.Subject;
            contract.PaymentTerms = dto.PaymentTerms;
            contract.DeliveryTerms = dto.DeliveryTerms;
            contract.WarrantyTerms = dto.WarrantyTerms;
            contract.AdditionalTerms = dto.AdditionalTerms;
            contract.DiscountPercent = dto.DiscountPercent;

            await _context.SaveChangesAsync();
            return Ok(contract);
        }

        // 4. GỬI DUYỆT (Sale → Manager)
        [HttpPut("{id}/submit")]
        [Authorize(Roles = "Admin, Manager, SaleManager")]
        public async Task<IActionResult> SubmitForApproval(int id)
        {
            var contract = await _context.Contracts.FindAsync(id);
            if (contract == null) return NotFound();
            if (contract.Status != "Draft") return BadRequest(new { message = "Chỉ gửi duyệt khi ở trạng thái Draft." });

            contract.Status = "PendingApproval";
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã gửi hợp đồng lên cấp quản lý để duyệt.", contract });
        }

        // 5. MANAGER DUYỆT HỢP ĐỒNG
        [HttpPut("{id}/approve")]
        [Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> ApproveContract(int id)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdString, out int userId)) return Unauthorized();

            var contract = await _context.Contracts.FindAsync(id);
            if (contract == null) return NotFound();
            if (contract.Status != "PendingApproval") return BadRequest(new { message = "Hợp đồng chưa được gửi duyệt." });

            contract.Status = "Approved";
            contract.ApprovedByUserId = userId;
            contract.ApprovedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã duyệt hợp đồng.", contract });
        }

        // 6. MANAGER TỪ CHỐI HỢP ĐỒNG
        [HttpPut("{id}/reject")]
        [Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> RejectContract(int id, RejectContractDto dto)
        {
            var contract = await _context.Contracts.FindAsync(id);
            if (contract == null) return NotFound();
            if (contract.Status != "PendingApproval") return BadRequest(new { message = "Hợp đồng chưa được gửi duyệt." });

            contract.Status = "Draft"; // Trả về Draft để Sale sửa lại
            contract.RejectionReason = dto.Reason;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã từ chối hợp đồng. Sale có thể sửa và gửi lại.", contract });
        }

        // 7. KÝ KẾT HỢP ĐỒNG (Sau khi hai bên ký)
        [HttpPut("{id}/sign")]
        [Authorize(Roles = "Admin, Manager, SaleManager")]
        public async Task<IActionResult> SignContract(int id)
        {
            var contract = await _context.Contracts.Include(c => c.Order).FirstOrDefaultAsync(c => c.Id == id);
            if (contract == null) return NotFound();
            if (contract.Status != "Approved") return BadRequest(new { message = "Hợp đồng cần được duyệt trước khi ký." });

            contract.Status = "Signed";
            contract.SignedAt = DateTime.UtcNow;

            // Cập nhật trạng thái đơn hàng
            if (contract.Order != null)
            {
                contract.Order.Status = "ContractSigned";
                contract.Order.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Hợp đồng đã được ký kết thành công!", contract });
        }

        // 8. LẤY TẤT CẢ HỢP ĐỒNG
        [HttpGet]
        [Authorize(Roles = "Admin, Manager, SaleManager")]
        public async Task<ActionResult<IEnumerable<Contract>>> GetAllContracts()
        {
            var contracts = await _context.Contracts
                .Include(c => c.Order)
                    .ThenInclude(o => o!.Customer)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            return Ok(contracts);
        }
    }
}
