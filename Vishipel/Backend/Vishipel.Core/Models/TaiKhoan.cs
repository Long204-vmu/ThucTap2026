using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vishipel.Core.Models
{
    public class TaiKhoan
    {
        [Key]
        public int MaTaiKhoan { get; set; }
        
        [Required]
        [StringLength(50)]
        public string TenDangNhap { get; set; } = null!;
        
        [Required]
        [StringLength(255)]
        public string MatKhau { get; set; } = null!;
        
        [StringLength(100)]
        public string? HoTen { get; set; }
        
        [StringLength(150)]
        public string? Email { get; set; }
        
        [StringLength(15)]
        public string? SoDienThoai { get; set; }
        
        public byte? MaVaiTro { get; set; }
        
        public bool TrangThai { get; set; } = true;
        public DateTime NgayTao { get; set; } = DateTime.Now;

        [ForeignKey("MaVaiTro")]
        public virtual VaiTro? VaiTro { get; set; }
    }
}

