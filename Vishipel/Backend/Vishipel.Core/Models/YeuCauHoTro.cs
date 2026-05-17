using System.ComponentModel.DataAnnotations;

namespace Vishipel.Core.Models
{
    public class YeuCauHoTro
    {
        [Key]
        public int MaYeuCau { get; set; }
        
        [Required]
        [StringLength(150)]
        public string HoTen { get; set; } = null!;
        
        [Required]
        [StringLength(15)]
        public string SoDienThoai { get; set; } = null!;
        
        [StringLength(150)]
        public string? Email { get; set; }
        
        [StringLength(200)]
        public string? CongTy { get; set; }
        
        [StringLength(50)]
        public string? LoaiYeuCau { get; set; }
        
        [StringLength(255)]
        public string? TieuDe { get; set; }
        
        public string? NoiDung { get; set; }
        
        public byte TrangThai { get; set; } = 1;
        public DateTime NgayTao { get; set; } = DateTime.Now;
    }
}
