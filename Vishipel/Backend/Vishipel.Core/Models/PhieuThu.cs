using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Vishipel.Core.Models
{
    public class PhieuThu
    {
        [Key]
        public int MaPhieuThu { get; set; }
        
        [StringLength(50)]
        public string? SoPhieu { get; set; }
        
        public DateTime NgayThu { get; set; } = DateTime.Now;
        
        public int? MaKH { get; set; }
        
        [StringLength(50)]
        public string? MaHopDong { get; set; }
        
        public decimal SoTien { get; set; }
        
        [StringLength(50)]
        public string? HinhThucThanhToan { get; set; }
        
        public int? MaTaiKhoan { get; set; }

        [ForeignKey("MaKH")]
        public virtual KhachHang? KhachHang { get; set; }
        
        [ForeignKey("MaHopDong")]
        [JsonIgnore]
        public virtual HopDong? HopDong { get; set; }
        
        [ForeignKey("MaTaiKhoan")]
        public virtual TaiKhoan? TaiKhoan { get; set; }
    }
}
