using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vishipel.Core.Models
{
    public class KeHoachCongNo
    {
        [Key]
        public int MaKeHoach { get; set; }
        
        public int? MaDonHang { get; set; }

        [StringLength(50)]
        public string? MaHopDong { get; set; }
        
        [StringLength(50)]
        public string? PhaseName { get; set; } // Tạm ứng, Giao hàng, Nghiệm thu...
        
        public int? PhaseOrder { get; set; }
        public int? Percentage { get; set; }

        public decimal SoTienDuKien { get; set; }
        public DateTime? HanThanhToan { get; set; }
        
        public string Status { get; set; } = "Pending"; // Pending, Paid, Overdue
        
        [StringLength(500)]
        public string? GhiChu { get; set; }

        [ForeignKey("MaDonHang")]
        public virtual DonDatHang? DonDatHang { get; set; }

        [ForeignKey("MaHopDong")]
        public virtual HopDong? HopDong { get; set; }
    }
}
