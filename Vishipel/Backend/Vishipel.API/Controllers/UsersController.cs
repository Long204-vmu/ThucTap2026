using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vishipel.Infrastructure.Data;

namespace Vishipel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")] // Chỉ Admin mới được vào đây
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // 1. LẤY DANH SÁCH USER (Giấu PasswordHash đi)
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users
                .Select(u => new 
                {
                    u.Id,
                    u.Username,
                    u.Email,
                    u.FullName,
                    u.Role,
                    u.IsApproved,
                    u.CreatedAt
                })
                .ToListAsync();

            return Ok(users);
        }

        // 2. DUYỆT TÀI KHOẢN (Bật/Tắt IsApproved)
        [HttpPut("{id}/toggle-approval")]
        public async Task<IActionResult> ToggleApproval(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound("Không tìm thấy người dùng.");

            // Không cho phép Admin tự khóa chính mình (bảo vệ an toàn)
            var currentUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId == id.ToString())
                return BadRequest("Bạn không thể tự khóa tài khoản của chính mình.");

            user.IsApproved = !user.IsApproved; // Lật trạng thái
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật trạng thái duyệt thành công.", isApproved = user.IsApproved });
        }

        // 3. ĐỔI QUYỀN (Change Role)
        [HttpPut("{id}/change-role")]
        public async Task<IActionResult> ChangeRole(int id, [FromBody] string newRole)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound("Không tìm thấy người dùng.");

            var currentUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId == id.ToString())
                return BadRequest("Bạn không thể tự đổi quyền của chính mình.");

            // Chỉ cho phép các Role hợp lệ
            var validRoles = new[] { "Admin", "Manager", "User" };
            if (!validRoles.Contains(newRole)) return BadRequest("Role không hợp lệ.");

            user.Role = newRole;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật quyền thành công.", role = user.Role });
        }
    }
}
