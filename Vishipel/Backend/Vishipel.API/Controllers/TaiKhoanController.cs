using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vishipel.Infrastructure.Data;
using Vishipel.Core.DTOs;
using Vishipel.Core.Models;
using System.Security.Claims;

namespace Vishipel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaiKhoanController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TaiKhoanController(AppDbContext context)
        {
            _context = context;
        }

        // 1. Láº¤Y DANH SÃCH TÃ€I KHOáº¢N (Chá»‰ Admin)
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetTaiKhoans()
        {
            var accounts = await _context.TaiKhoans
                .Include(u => u.VaiTro)
                .Select(u => new 
                {
                    u.MaTaiKhoan,
                    u.TenDangNhap,
                    u.Email,
                    u.HoTen,
                    u.SoDienThoai,
                    RoleName = u.VaiTro != null ? u.VaiTro.TenVaiTro : "User",
                    u.TrangThai,
                    u.NgayTao
                })
                .ToListAsync();

            return Ok(accounts);
        }

        // THÃŠM TÃ€I KHOáº¢N Má»šI (Chá»‰ Admin)
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PostTaiKhoan(AdminUserDto request)
        {
            if (await _context.TaiKhoans.AnyAsync(u => u.TenDangNhap == request.TenDangNhap))
                return BadRequest("TÃªn Ä‘Äƒng nháº­p Ä‘Ã£ tá»“n táº¡i.");

            var account = new TaiKhoan
            {
                HoTen = request.HoTen,
                Email = request.Email,
                SoDienThoai = request.SoDienThoai,
                TenDangNhap = request.TenDangNhap,
                MatKhau = BCrypt.Net.BCrypt.HashPassword(request.Password ?? "123456"),
                MaVaiTro = request.MaVaiTro ?? 2, // Máº·c Ä‘á»‹nh lÃ  User
                TrangThai = true
            };

            _context.TaiKhoans.Add(account);
            await _context.SaveChangesAsync();
            return Ok(new { message = "ThÃªm tÃ i khoáº£n thÃ nh cÃ´ng." });
        }

        // Cáº¬P NHáº¬T TÃ€I KHOáº¢N (Chá»‰ Admin)
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PutTaiKhoan(int id, AdminUserDto request)
        {
            var account = await _context.TaiKhoans.FindAsync(id);
            if (account == null) return NotFound($"KhÃ´ng tÃ¬m tháº¥y tÃ i khoáº£n cÃ³ ID {id} Ä‘á»ƒ cáº­p nháº­t.");

            account.HoTen = request.HoTen;
            account.Email = request.Email;
            account.SoDienThoai = request.SoDienThoai;
            account.TenDangNhap = request.TenDangNhap;
            account.MaVaiTro = request.MaVaiTro ?? account.MaVaiTro;
            
            if (!string.IsNullOrEmpty(request.Password))
                account.MatKhau = BCrypt.Net.BCrypt.HashPassword(request.Password);

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cáº­p nháº­t tÃ i khoáº£n thÃ nh cÃ´ng." });
        }

        // XÃ“A TÃ€I KHOáº¢N (Chá»‰ Admin)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteTaiKhoan(int id)
        {
            var account = await _context.TaiKhoans.FindAsync(id);
            if (account == null) return NotFound($"KhÃ´ng tÃ¬m tháº¥y tÃ i khoáº£n cÃ³ ID {id} Ä‘á»ƒ xÃ³a.");

            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId == id.ToString())
                return BadRequest("Báº¡n khÃ´ng thá»ƒ tá»± xÃ³a chÃ­nh mÃ¬nh.");

            _context.TaiKhoans.Remove(account);
            await _context.SaveChangesAsync();
            return Ok(new { message = "XÃ³a tÃ i khoáº£n thÃ nh cÃ´ng." });
        }

        // 2. Cáº¬P NHáº¬T THÃ”NG TIN CÃ NHÃ‚N (Má»i User Ä‘Ã£ Ä‘Äƒng nháº­p)
        [HttpPut("profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile(UpdateProfileDto request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var account = await _context.TaiKhoans.FindAsync(int.Parse(userId));
            if (account == null) return NotFound("KhÃ´ng tÃ¬m tháº¥y ngÆ°á»i dÃ¹ng.");

            account.HoTen = request.HoTen;
            account.Email = request.Email;
            account.SoDienThoai = request.SoDienThoai;

            await _context.SaveChangesAsync();

            return Ok(new 
            { 
                message = "Cáº­p nháº­t thÃ´ng tin thÃ nh cÃ´ng.", 
                user = new 
                { 
                    account.MaTaiKhoan, 
                    account.HoTen, 
                    account.TenDangNhap, 
                    account.Email, 
                    account.SoDienThoai, 
                    account.TrangThai, 
                    account.NgayTao 
                } 
            });
        }

        // 3. Äá»”I Máº¬T KHáº¨U (Má»i User Ä‘Ã£ Ä‘Äƒng nháº­p)
        [HttpPut("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized();

            var account = await _context.TaiKhoans.FirstOrDefaultAsync(u => u.MaTaiKhoan == int.Parse(userIdClaim));
            if (account == null) return NotFound("KhÃ´ng tÃ¬m tháº¥y ngÆ°á»i dÃ¹ng.");

            if (!BCrypt.Net.BCrypt.Verify(request.OldPassword, account.MatKhau.Trim()))
                return BadRequest(new { message = "Máº­t kháº©u cÅ© khÃ´ng chÃ­nh xÃ¡c." });

            account.MatKhau = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Äá»•i máº­t kháº©u thÃ nh cÃ´ng." });
        }

        [HttpPut("{id}/change-role")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ChangeRole(int id, ChangeRoleDto request)
        {
            var account = await _context.TaiKhoans.FindAsync(id);
            if (account == null) return NotFound("KhÃ´ng tÃ¬m tháº¥y ngÆ°á»i dÃ¹ng.");

            account.MaVaiTro = request.MaVaiTro;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cáº­p nháº­t quyá»n háº¡n thÃ nh cÃ´ng." });
        }

        [HttpPut("{id}/toggle-status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            var account = await _context.TaiKhoans.FindAsync(id);
            if (account == null) return NotFound("KhÃ´ng tÃ¬m tháº¥y ngÆ°á»i dÃ¹ng.");

            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId == id.ToString())
                return BadRequest("Báº¡n khÃ´ng thá»ƒ tá»± khÃ³a tÃ i khoáº£n cá»§a chÃ­nh mÃ¬nh.");

            account.TrangThai = !account.TrangThai;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cáº­p nháº­t tráº¡ng thÃ¡i thÃ nh cÃ´ng.", trangThai = account.TrangThai });
        }
    }
}
