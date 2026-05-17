using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Vishipel.Core.Models
{
    public class HopDong
    {
        [Key]
        [StringLength(50)]
        public string MaHopDong { get; set; } = null!; // ContractNumber

        public int? MaDonHang { get; set; }
        
        public DateTime? NgayKy { get; set; }
        public string? NoiDungTomTat { get; set; }
        public decimal GiaTriHopDong { get; set; }
        public string Status { get; set; } = "Draft"; // Draft, PendingApproval, Approved, Signed

        // Display support
        public string? PartyAName { get; set; }
        public decimal? TotalAmount { get; set; }

        [ForeignKey("MaDonHang")]
        [JsonIgnore]
        public virtual DonDatHang? DonDatHang { get; set; }

        // Alias for dashboard compatibility
        [NotMapped]
        public string? ContractNumber => MaHopDong;
        [NotMapped]
        public string? TrangThaiHieuLuc => Status;

        public virtual ICollection<PhieuThu> PhieuThus { get; set; } = new List<PhieuThu>();
    }
}
