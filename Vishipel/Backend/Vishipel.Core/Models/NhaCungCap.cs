using System.ComponentModel.DataAnnotations;

namespace Vishipel.Core.Models
{
    public class NhaCungCap
    {
        [Key]
        public int MaNCC { get; set; }
        
        [Required]
        [StringLength(255)]
        public string TenNCC { get; set; } = null!;
        
        [StringLength(20)]
        public string? MST { get; set; }
        
        [StringLength(500)]
        public string? DiaChi { get; set; }
        
        [StringLength(150)]
        public string? Email { get; set; }
        
        [StringLength(15)]
        public string? SoDienThoai { get; set; }
        
        [StringLength(100)]
        public string? NguoiLienHe { get; set; }
    }
}
