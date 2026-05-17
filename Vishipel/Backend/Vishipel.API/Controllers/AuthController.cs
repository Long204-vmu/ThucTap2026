using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Vishipel.Infrastructure.Data;
using Vishipel.Core.DTOs;
using Vishipel.Core.Models;

namespace Vishipel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // 1. ĐĂNG KÝ
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto request)
        {
            if (await _context.TaiKhoans.AnyAsync(u => u.TenDangNhap == request.TenDangNhap))
                return BadRequest(new { message = "Tên đăng nhập đã tồn tại." });

            var user = new TaiKhoan
            {
                HoTen = request.HoTen ?? "Người dùng",
                Email = request.Email ?? "",
                SoDienThoai = request.SoDienThoai,
                TenDangNhap = request.TenDangNhap,
                MatKhau = BCrypt.Net.BCrypt.HashPassword(request.Password),
                MaVaiTro = 2, // Mặc định là User
                TrangThai = true,
                NgayTao = DateTime.Now
            };

            _context.TaiKhoans.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đăng ký thành công!" });
        }

        // 2. ĐĂNG NHẬP
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto request)
        {
            try 
            {
                var user = await _context.TaiKhoans
                    .Include(u => u.VaiTro)
                    .FirstOrDefaultAsync(u => u.TenDangNhap == request.TenDangNhap);

                if (user == null || string.IsNullOrEmpty(user.MatKhau) || !BCrypt.Net.BCrypt.Verify(request.Password, user.MatKhau.Trim()))
                    return Unauthorized(new { message = "Tài khoản hoặc mật khẩu không đúng." });

                if (!user.TrangThai)
                    return BadRequest(new { message = "Tài khoản của bạn đã bị khóa." });

                // Xác định Role Name (Admin mặc định)
                string roleName = "User";
                if (user.TenDangNhap == "admin") 
                {
                    roleName = "Admin";
                }
                else 
                {
                    roleName = user.VaiTro?.TenVaiTro ?? "User";
                }
                
                // Tạo Token
                var token = CreateToken(user, roleName);

                return Ok(new
                {
                    token = token,
                    user = new 
                    { 
                        user.MaTaiKhoan, 
                        HoTen = user.HoTen ?? "Administrator", 
                        user.TenDangNhap, 
                        user.Email,
                        user.SoDienThoai,
                        Role = roleName, 
                        user.TrangThai,
                        user.NgayTao
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống khi đăng nhập: " + ex.Message });
            }
        }

        private string CreateToken(TaiKhoan user, string roleName)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.MaTaiKhoan.ToString()),
                new Claim(ClaimTypes.Name, user.TenDangNhap ?? ""),
                new Claim(ClaimTypes.Role, roleName ?? "User"),
                new Claim("FullName", user.HoTen ?? "User")
            };

            // Lấy thông tin cấu hình từ appsettings.json
            var tokenKey = _configuration["Jwt:Key"] ?? "Vishipel_Default_Secret_Key_For_Emergency_123456789_Must_Be_Long";
            var issuer = _configuration["Jwt:Issuer"] ?? "VishipelBackend";
            var audience = _configuration["Jwt:Audience"] ?? "VishipelFrontend";

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // API FIX LỖI HỆ THỐNG
        [HttpGet("seed-admin")]
        public async Task<IActionResult> SeedAdmin()
        {
            try
            {
                var passHash = BCrypt.Net.BCrypt.HashPassword("123456");

                string sql = $@"
                    IF NOT EXISTS (SELECT * FROM VaiTro WHERE MaVaiTro = 1) 
                        INSERT INTO VaiTro (MaVaiTro, TenVaiTro) VALUES (1, 'Admin');
                    ELSE
                        UPDATE VaiTro SET TenVaiTro = 'Admin' WHERE MaVaiTro = 1;

                    IF NOT EXISTS (SELECT * FROM VaiTro WHERE MaVaiTro = 2) 
                        INSERT INTO VaiTro (MaVaiTro, TenVaiTro) VALUES (2, 'User');

                    DELETE FROM VaiTro WHERE MaVaiTro > 6 OR TenVaiTro LIKE N'%?%';

                    IF NOT EXISTS (SELECT * FROM TaiKhoan WHERE TenDangNhap = 'admin')
                    BEGIN
                        INSERT INTO TaiKhoan (TenDangNhap, MatKhau, HoTen, Email, TrangThai, NgayTao, MaVaiTro)
                        VALUES ('admin', '{passHash}', N'Administrator', 'admin@vishipel.com', 1, GETDATE(), 1);
                    END
                    ELSE
                    BEGIN
                        UPDATE TaiKhoan SET MaVaiTro = 1, TrangThai = 1 WHERE TenDangNhap = 'admin';
                    END";

                await _context.Database.ExecuteSqlRawAsync(sql);

                return Ok(new { success = true, message = "Đã khôi phục quyền Admin mặc định!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Lỗi: " + ex.Message });
            }
        }
    }
}
