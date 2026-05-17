namespace Vishipel.Core.DTOs
{
    // Dùng để hứng dữ liệu từ Form Đăng ký
    public class RegisterDto
    {
        public required string HoTen { get; set; }
        public required string Email { get; set; }
        public string? SoDienThoai { get; set; }
        public required string TenDangNhap { get; set; }
        public required string Password { get; set; } // Pass thô, chưa hash

    }

    // Dùng để hứng dữ liệu từ Form Đăng nhập
    public class LoginDto
    {
        public required string TenDangNhap { get; set; }
        public required string Password { get; set; }
    }

    // Dùng để hứng dữ liệu cập nhật thông tin cá nhân
    public class UpdateProfileDto
    {
        public required string HoTen { get; set; }
        public required string Email { get; set; }
        public string? SoDienThoai { get; set; }
    }

    // Dùng để hứng dữ liệu đổi mật khẩu
    public class ChangePasswordDto
    {
        public required string OldPassword { get; set; }
        public required string NewPassword { get; set; }
    }

    // Dùng cho Admin khi thêm/sửa tài khoản người dùng
    public class AdminUserDto
    {
        public required string HoTen { get; set; }
        public required string Email { get; set; }
        public string? SoDienThoai { get; set; }
        public required string TenDangNhap { get; set; }
        public string? Password { get; set; } // Chỉ bắt buộc khi thêm mới
        public byte? MaVaiTro { get; set; }
    }

    public class ChangeRoleDto
    {
        public byte MaVaiTro { get; set; }
    }
}
