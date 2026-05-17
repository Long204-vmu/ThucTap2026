using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vishipel.Core.Models
{
    public class ChiTietDonHang
    {
        public int MaDonHang { get; set; }
        public int MaThietBi { get; set; }
        
        public int SoLuong { get; set; }
        public decimal DonGia { get; set; } // Renamed from DonGiaBan for consistency

        [ForeignKey("MaDonHang")]
        public virtual DonDatHang? DonDatHang { get; set; }
        
        [ForeignKey("MaThietBi")]
        public virtual ThietBi? ThietBi { get; set; }

        // Additional fields for logistics/business
        public string? SerialNumbersJson { get; set; }
        public string? InstallLocation { get; set; }
        public string? Unit { get; set; }
    }
}
