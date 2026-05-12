namespace Vishipel.Core.DTOs
{
    // Dùng để hứng dữ liệu từ Form Đăng ký
    public class RegisterDto
    {
        public required string FullName { get; set; }
        public required string Email { get; set; }
        public string? Phone { get; set; }
        public required string Username { get; set; }
        public required string Password { get; set; } // Pass thô, chưa hash
    }

    // Dùng để hứng dữ liệu từ Form Đăng nhập
    public class LoginDto
    {
        public required string Username { get; set; }
        public required string Password { get; set; }
    }
}
