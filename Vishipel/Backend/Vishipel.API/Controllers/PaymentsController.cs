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
