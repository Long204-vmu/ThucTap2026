using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vishipel.Core.Models
{
    public class PhieuChi
    {
        [Key]
        public int MaPhieuChi { get; set; }
        
        [StringLength(50)]
        public string? SoPhieu { get; set; }
        
        public DateTime NgayChi { get; set; } = DateTime.Now;
        
        public int? MaNCC { get; set; }
        public int? MaPhieuNhap { get; set; }
        
        public decimal SoTien { get; set; }
        public int? MaTaiKhoan { get; set; }

        [ForeignKey("MaNCC")]
        public virtual NhaCungCap? NhaCungCap { get; set; }
        
        [ForeignKey("MaPhieuNhap")]
        public virtual PhieuNhapKho? PhieuNhapKho { get; set; }
        
        [ForeignKey("MaTaiKhoan")]
        public virtual TaiKhoan? TaiKhoan { get; set; }
    }
}
