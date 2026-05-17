using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vishipel.Infrastructure.Data;
using Vishipel.Core.Models;
using System.Security.Claims;

namespace Vishipel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TechnicalController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TechnicalController(AppDbContext context)
        {
            _context = context;
        }

        // --- QUẢN LÝ LẮP ĐẶT (5.2) ---

        // 1. Danh sách đơn hàng cần triển khai kỹ thuật (đã chốt/xuất kho nhưng chưa nghiệm thu)
        [HttpGet("orders")]
        [Authorize(Roles = "Admin,Manager,Technical")]
        public async Task<ActionResult<IEnumerable<DonDatHang>>> GetTechnicalOrders()
        {
            return await _context.DonDatHangs
                .Include(o => o.KhachHang)
                .Include(o => o.Assignee)
                .Include(o => o.BienBanNghiemThus)
                .Include(o => o.ChiTietDonHangs)
                    .ThenInclude(d => d.ThietBi)
                .Where(o => o.Status == "Confirmed" || o.Status == "ContractSigned" || o.Status == "Processing" || o.Status == "Delivering")
                .OrderByDescending(o => o.NgayDat)
                .ToListAsync();
        }

        public class InstallationPlanDto
        {
            public int? AssigneeId { get; set; }
            public DateTime? Deadline { get; set; }
            public string? TechnicalNotes { get; set; }
        }

        // 5.2.1. Lập kế hoạch lắp đặt
        [HttpPut("orders/{id}/plan")]
        [Authorize(Roles = "Admin,Manager,Technical")]
        public async Task<IActionResult> UpdateInstallationPlan(int id, [FromBody] InstallationPlanDto dto)
        {
            var order = await _context.DonDatHangs.FindAsync(id);
            if (order == null) return NotFound(new { message = "Không tìm thấy đơn hàng." });

            order.AssigneeId = dto.AssigneeId;
            order.Deadline = dto.Deadline;
            order.TechnicalNotes = dto.TechnicalNotes;
            
            // Nếu đơn hàng mới chỉ ở trạng thái Confirmed/ContractSigned, có thể đánh dấu là đang xử lý kỹ thuật
            if (order.Status == "Confirmed" || order.Status == "ContractSigned")
            {
                order.Status = "Processing";
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã cập nhật kế hoạch lắp đặt thành công." });
        }

        public class AcceptanceRecordDto
        {
            public int OrderId { get; set; }
            public string? GhiChuKiemTra { get; set; }
            public string? DanhGiaChung { get; set; }
            public string? DiaDiem { get; set; }
            public string? DaiDienBenA { get; set; }
            public string? ChucVuBenA { get; set; }
            public string? DaiDienBenB { get; set; }
            public string? ChucVuBenB { get; set; }
            public string? NoiDungDichVu { get; set; }
            public DateTime? ThoiGianBatDau { get; set; }
            public DateTime? ThoiGianKetThuc { get; set; }
        }

        // 5.2.2. Lập biên bản nghiệm thu bàn giao
        [HttpPost("acceptance")]
        [Authorize(Roles = "Admin,Manager,Technical")]
        public async Task<IActionResult> CreateAcceptanceRecord([FromBody] AcceptanceRecordDto dto)
        {
            var order = await _context.DonDatHangs.FindAsync(dto.OrderId);
            if (order == null) return NotFound(new { message = "Không tìm thấy đơn hàng." });

            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            int.TryParse(userIdStr, out int userId);

            var bienBan = new BienBanNghiemThu
            {
                MaDonHang = dto.OrderId,
                NgayLap = DateTime.Now,
                NguoiLapId = userId > 0 ? userId : null,
                GhiChuKiemTra = dto.GhiChuKiemTra,
                DanhGiaChung = dto.DanhGiaChung,
                DiaDiem = dto.DiaDiem,
                DaiDienBenA = dto.DaiDienBenA,
                ChucVuBenA = dto.ChucVuBenA,
                DaiDienBenB = dto.DaiDienBenB,
                ChucVuBenB = dto.ChucVuBenB,
                NoiDungDichVu = dto.NoiDungDichVu,
                ThoiGianBatDau = dto.ThoiGianBatDau,
                ThoiGianKetThuc = dto.ThoiGianKetThuc,
                CustomerConfirmed = false
            };

            _context.BienBanNghiemThus.Add(bienBan);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã lập biên bản nghiệm thu, chờ khách hàng xác nhận." });
        }

        // Khách hàng xác nhận nghiệm thu
        [HttpPut("acceptance/{id}/confirm")]
        [Authorize(Roles = "Admin,Manager,User")] // User là khách hàng
        public async Task<IActionResult> ConfirmAcceptance(int id)
        {
            var bienBan = await _context.BienBanNghiemThus.Include(b => b.DonDatHang).FirstOrDefaultAsync(b => b.MaBienBan == id);
            if (bienBan == null) return NotFound(new { message = "Không tìm thấy biên bản nghiệm thu." });

            bienBan.CustomerConfirmed = true;
            bienBan.NgayXacNhan = DateTime.Now;

            // Chuyển trạng thái đơn hàng sang Đã nghiệm thu (Delivered_Accepted)
            if (bienBan.DonDatHang != null)
            {
                bienBan.DonDatHang.Status = "Delivered_Accepted";
                
                // Tự động lập phiếu thu cho khách hàng thanh toán
                var existingPhieuThu = await _context.PhieuThus.FirstOrDefaultAsync(p => p.MaDonHang == bienBan.MaDonHang);
                if (existingPhieuThu == null)
                {
                    var phieuThu = new PhieuThu
                    {
                        SoPhieu = $"PT-{DateTime.Now:yyyyMMdd}-{bienBan.MaDonHang}",
                        MaDonHang = bienBan.MaDonHang,
                        MaKH = bienBan.DonDatHang.MaKH,
                        SoTien = bienBan.DonDatHang.TongGiaTri,
                        HinhThucThanhToan = bienBan.DonDatHang.PaymentMethod ?? "Chuyển khoản",
                        IsPaid = false,
                        NgayThu = DateTime.Now
                    };
                    _context.PhieuThus.Add(phieuThu);
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã xác nhận biên bản nghiệm thu thành công." });
        }

        [HttpGet("orders/{id}/acceptance")]
        public async Task<IActionResult> GetAcceptanceRecords(int id)
        {
            var records = await _context.BienBanNghiemThus
                .Include(b => b.NguoiLap)
                .Where(b => b.MaDonHang == id)
                .OrderByDescending(b => b.NgayLap)
                .ToListAsync();
            return Ok(records);
        }
        
        [HttpGet("users")]
        [Authorize(Roles = "Admin,Manager,Technical")]
        public async Task<IActionResult> GetTechnicalUsers()
        {
            // Lấy danh sách tài khoản (kỹ thuật viên) để gán việc
            var users = await _context.TaiKhoans
                .Where(t => t.TrangThai) // Tùy chọn lọc Role = Technical
                .Select(t => new { t.MaTaiKhoan, t.HoTen, t.Email })
                .ToListAsync();
            return Ok(users);
        }
        [HttpGet("acceptance")]
        [Authorize(Roles = "Admin,Manager,Technical")]
        public async Task<IActionResult> GetAllAcceptanceRecords()
        {
            var records = await _context.BienBanNghiemThus
                .Include(b => b.NguoiLap)
                .Include(b => b.DonDatHang)
                    .ThenInclude(d => d.KhachHang)
                .Include(b => b.DonDatHang)
                    .ThenInclude(d => d.ChiTietDonHangs)
                        .ThenInclude(c => c.ThietBi)
                .OrderByDescending(b => b.NgayLap)
                .ToListAsync();
            return Ok(records);
        }
    }
}
