using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vishipel.Core.Models
{
    public class DanhMucSeri
    {
        [Key]
        [StringLength(50)]
        public string MaSeri { get; set; } = null!;
        
        public int? MaThietBi { get; set; }
        public byte? MaKho { get; set; }
        
        [StringLength(50)]
        public string? MaHopDong { get; set; }
        
        public byte TrangThai { get; set; } // 1: Trong kho, 2: Da ban, 3: Bao hanh

        [ForeignKey("MaThietBi")]
        public virtual ThietBi? ThietBi { get; set; }
        
        [ForeignKey("MaKho")]
        public virtual Kho? Kho { get; set; }
        
        [ForeignKey("MaHopDong")]
        public virtual HopDong? HopDong { get; set; }
    }
}
