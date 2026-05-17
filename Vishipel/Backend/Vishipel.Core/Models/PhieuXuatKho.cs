using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vishipel.Core.Models
{
    public class PhieuXuatKho
    {
        [Key]
        public int MaPhieuXuat { get; set; }
        
        public DateTime NgayXuat { get; set; } = DateTime.Now;
        
        [StringLength(50)]
        public string? MaHopDong { get; set; }
        public byte? MaKho { get; set; }
        public int? MaTaiKhoan { get; set; }
        
        [StringLength(255)]
        public string? LyDoXuat { get; set; }

        [ForeignKey("MaHopDong")]
        public virtual HopDong? HopDong { get; set; }
        
        [ForeignKey("MaKho")]
        public virtual Kho? Kho { get; set; }
        
        [ForeignKey("MaTaiKhoan")]
        public virtual TaiKhoan? TaiKhoan { get; set; }

        public virtual ICollection<ChiTietXuatKho> ChiTietXuatKhos { get; set; } = new List<ChiTietXuatKho>();
    }
}
