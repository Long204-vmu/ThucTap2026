using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vishipel.Core.Models
{
    public class PhieuNhapKho
    {
        [Key]
        public int MaPhieuNhap { get; set; }
        
        public DateTime NgayNhap { get; set; } = DateTime.Now;
        
        public int? MaNCC { get; set; }
        public byte? MaKho { get; set; }
        public int? MaTaiKhoan { get; set; }
        
        [StringLength(500)]
        public string? GhiChu { get; set; }

        [ForeignKey("MaNCC")]
        public virtual NhaCungCap? NhaCungCap { get; set; }
        
        [ForeignKey("MaKho")]
        public virtual Kho? Kho { get; set; }
        
        [ForeignKey("MaTaiKhoan")]
        public virtual TaiKhoan? TaiKhoan { get; set; }

        public virtual ICollection<ChiTietNhapKho> ChiTietNhapKhos { get; set; } = new List<ChiTietNhapKho>();
    }
}
