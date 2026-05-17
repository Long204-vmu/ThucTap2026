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
    [Authorize(Roles = "Admin,Manager,SaleManager,Accounting")]
    public class PaymentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PaymentsController(AppDbContext context)
        {
            _context = context;
        }

        // --- PHIẾU THU (Receipts) ---
        [HttpGet("receipts")]
        public async Task<ActionResult<IEnumerable<PhieuThu>>> GetReceipts()
        {
            return await _context.PhieuThus
                .Include(p => p.KhachHang)
                .Include(p => p.HopDong)
                .Include(p => p.DonDatHang)
                .OrderByDescending(p => p.NgayThu)
                .ToListAsync();
        }

        [HttpPost("receipts")]
        public async Task<ActionResult<PhieuThu>> PostReceipt(PhieuThu phieuThu)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (int.TryParse(userIdStr, out int userId)) phieuThu.MaTaiKhoan = userId;

            phieuThu.NgayThu = DateTime.Now;
            _context.PhieuThus.Add(phieuThu);
            await _context.SaveChangesAsync();
            return Ok(phieuThu);
        }

        [HttpPut("receipts/{id}/confirm")]
        [Authorize(Roles = "Admin,Manager,SaleManager,Accounting")]
        public async Task<IActionResult> ConfirmReceipt(int id)
        {
            var phieuThu = await _context.PhieuThus
                .Include(p => p.DonDatHang)
                    .ThenInclude(d => d.KhachHang)
                .FirstOrDefaultAsync(p => p.MaPhieuThu == id);

            if (phieuThu == null) return NotFound("Không tìm thấy phiếu thu");
            if (phieuThu.IsPaid) return BadRequest("Phiếu thu này đã được xác nhận thanh toán rồi");

            phieuThu.IsPaid = true;
            phieuThu.NgayThu = DateTime.Now;

            if (phieuThu.DonDatHang != null)
            {
                var order = phieuThu.DonDatHang;
                order.Status = "Completed";

                var existingHoaDon = await _context.HoaDons.FirstOrDefaultAsync(h => h.MaDonHang == order.MaDonHang);
                if (existingHoaDon == null)
                {
                    var hoaDon = new HoaDon
                    {
                        MaHoaDon = $"INV-{DateTime.Now:yyyyMMdd}-{order.MaDonHang}",
                        MaDonHang = order.MaDonHang,
                        NgayXuat = DateTime.Now,
                        TotalAmount = order.TongGiaTri,
                        Status = "Issued",
                        BuyerName = order.KhachHang?.TenKH ?? "Khách hàng",
                        TaxCode = order.KhachHang?.MST ?? ""
                    };
                    _context.HoaDons.Add(hoaDon);
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Xác nhận thanh toán thành công. Hệ thống đã cấp hóa đơn và phiếu bảo hành." });
        }

        // --- PHIẾU CHI (Payments) ---
        [HttpGet("vouchers")]
        public async Task<ActionResult<IEnumerable<PhieuChi>>> GetVouchers()
        {
            return await _context.PhieuChis
                .Include(p => p.NhaCungCap)
                .OrderByDescending(p => p.NgayChi)
                .ToListAsync();
        }

        [HttpPost("vouchers")]
        public async Task<ActionResult<PhieuChi>> PostVoucher(PhieuChi phieuChi)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (int.TryParse(userIdStr, out int userId)) phieuChi.MaTaiKhoan = userId;

            phieuChi.NgayChi = DateTime.Now;
            _context.PhieuChis.Add(phieuChi);
            await _context.SaveChangesAsync();
            return Ok(phieuChi);
        }
    }
}
