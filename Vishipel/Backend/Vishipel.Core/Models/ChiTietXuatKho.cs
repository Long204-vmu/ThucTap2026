using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Vishipel.Core.Models
{
    public class ChiTietXuatKho
    {
        public int MaPhieuXuat { get; set; }
        public int MaThietBi { get; set; }

        public int SoLuong { get; set; }
        public decimal DonGiaBan { get; set; }

        [ForeignKey("MaPhieuXuat")]
        public virtual PhieuXuatKho? PhieuXuatKho { get; set; }

        [ForeignKey("MaThietBi")]
        public virtual ThietBi? ThietBi { get; set; }
    }
}
