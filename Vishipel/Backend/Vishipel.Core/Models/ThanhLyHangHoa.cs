using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vishipel.Core.Models
{
    public class ThanhLyHangHoa
    {
        [Key]
        public int MaThanhLy { get; set; }
        
        public int? MaThietBi { get; set; }
        public byte? MaKho { get; set; }
        
        public DateTime? NgayThanhLy { get; set; }
        public int SoLuong { get; set; }
        
        [StringLength(500)]
        public string? LyDo { get; set; }
        
        public int? MaTaiKhoan { get; set; }

        [ForeignKey("MaThietBi")]
        public virtual ThietBi? ThietBi { get; set; }
        
        [ForeignKey("MaKho")]
        public virtual Kho? Kho { get; set; }
        
        [ForeignKey("MaTaiKhoan")]
        public virtual TaiKhoan? TaiKhoan { get; set; }
    }
}
