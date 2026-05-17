using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Vishipel.Core.Models
{
    public class HoaDon
    {
        [Key]
        [StringLength(50)]
        public string MaHoaDon { get; set; } = null!; // InvoiceNumber

        public int? MaDonHang { get; set; }

        [StringLength(50)]
        public string? MaHopDong { get; set; }
        
        public DateTime NgayXuat { get; set; } = DateTime.Now;
        public decimal ThueSuat { get; set; } = 10;
        public decimal TotalAmount { get; set; }
        
        public string Status { get; set; } = "Draft"; // Draft, Issued, Cancelled

        public string? BuyerName { get; set; }
        public string? TaxCode { get; set; }

        [ForeignKey("MaDonHang")]
        [JsonIgnore]
        public virtual DonDatHang? DonDatHang { get; set; }

        [ForeignKey("MaHopDong")]
        [JsonIgnore]
        public virtual HopDong? HopDong { get; set; }
    }
}
