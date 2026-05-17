using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vishipel.Core.Models
{
    public class NhatKyHeThong
    {
        [Key]
        public int MaLog { get; set; }
        
        public int? MaTaiKhoan { get; set; }
        public DateTime ThoiGian { get; set; } = DateTime.Now;
        
        [StringLength(100)]
        public string? HanhDong { get; set; }
        
        public string? NoiDung { get; set; }
        
        [StringLength(45)]
        public string? DiaChiIP { get; set; }

        [ForeignKey("MaTaiKhoan")]
        public virtual TaiKhoan? TaiKhoan { get; set; }
    }
}
