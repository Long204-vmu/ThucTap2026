using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vishipel.Core.Models
{
    public class ChiTietNhapKho
    {
        public int MaPhieuNhap { get; set; }
        public int MaThietBi { get; set; }
        
        public int SoLuong { get; set; }
        public decimal DonGiaNhap { get; set; }

        [ForeignKey("MaPhieuNhap")]
        public virtual PhieuNhapKho? PhieuNhapKho { get; set; }
        
        [ForeignKey("MaThietBi")]
        public virtual ThietBi? ThietBi { get; set; }
    }
}
