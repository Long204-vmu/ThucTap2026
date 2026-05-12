using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Vishipel.Infrastructure.Data;
using Vishipel.Core.Models;
using Vishipel.Core.DTOs;

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

        // 1. API ĐĂNG KÝ (Nhận RegisterDto, Lưu User)
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto request)
        {
            // Kiểm tra trùng lặp
            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
                return BadRequest(new { message = "Tên đăng nhập đã tồn tại!" });

            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                return BadRequest(new { message = "Email này đã được sử dụng!" });

            // Tạo User mới, băm nát mật khẩu bằng BCrypt
            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                Phone = request.Phone,
                Username = request.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
                // Role và IsApproved sẽ tự lấy giá trị mặc định trong Model của bạn
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Đăng ký thành công. Vui lòng chờ xét duyệt." });
        }

        // 2. API ĐĂNG NHẬP (Nhận LoginDto, Trả về JWT)
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto request)
        {
            // Tìm user
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
            if (user == null)
                return Unauthorized(new { message = "Sai tên đăng nhập hoặc mật khẩu." });

            // So sánh mật khẩu băm
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return Unauthorized(new { message = "Sai tên đăng nhập hoặc mật khẩu." });

            if (!user.IsApproved)
                return BadRequest(new { message = "Tài khoản của bạn đang chờ Quản trị viên phê duyệt." });
            
            // Chuẩn hóa Role để Frontend và Backend đồng nhất
            string normalizedRole = char.ToUpper(user.Role[0]) + user.Role.Substring(1).ToLower();
            
            // Tạo Token
            var token = CreateToken(user);

            // Trả về Token và thông tin cơ bản cho Frontend
            return Ok(new
            {
                token = token,
                user = new 
                { 
                    user.Id, 
                    user.FullName, 
                    user.Username, 
                    user.Email,
                    user.Phone,
                    user.Department,
                    Role = normalizedRole, 
                    user.IsApproved,
                    user.CreatedAt
                }
            });
        }

        // 3. HÀM TẠO CHỮ KÝ JWT
        private string CreateToken(User user)
        {
            // Chuẩn hóa Role (Viết hoa chữ cái đầu: admin -> Admin)
            string normalizedRole = char.ToUpper(user.Role[0]) + user.Role.Substring(1).ToLower();

            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, normalizedRole),
                new Claim("FullName", user.FullName)
            };

            // Ưu tiên lấy từ biến môi trường để tránh hardcode secret trong source
            var jwtKey = Environment.GetEnvironmentVariable("JWT__KEY")
                ?? _configuration["Jwt:Key"]
                ?? throw new InvalidOperationException("Missing Jwt:Key (or JWT__KEY env var).");
            var jwtIssuer = _configuration["Jwt:Issuer"] ?? "VishipelBackend";
            var jwtAudience = _configuration["Jwt:Audience"] ?? "VishipelFrontend";

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            // Cấu hình Token (Sống trong 1 ngày)
            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
