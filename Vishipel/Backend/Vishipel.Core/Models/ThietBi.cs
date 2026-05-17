using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vishipel.Core.Models
{
    public class ThietBi
    {
        [Key]
        public int MaThietBi { get; set; }
        
        public int? MaLoai { get; set; }
        public byte? MaDVT { get; set; }
        
        [Required]
        [StringLength(250)]
        public string TenThietBi { get; set; } = null!;
        
        [StringLength(50)]
        public string? Model { get; set; }
        
        [StringLength(100)]
        public string? HangSanXuat { get; set; }
        
        public decimal GiaBan { get; set; } = 0;
        public byte TrangThai { get; set; } = 1;
        public byte BaoHanhThang { get; set; } = 12;
        
        [StringLength(100)]
        public string? XuatXu { get; set; }
        
        [StringLength(500)]
        public string? MoTaNgan { get; set; }
        
        public string? MoTaChiTiet { get; set; }
        public string? ThongSoKyThuat { get; set; }
        public string? HinhAnhJson { get; set; }
        
        public decimal DiemDanhGia { get; set; } = 5.0m;
        public int LuotXem { get; set; } = 0;
        
        public DateTime NgayTao { get; set; } = DateTime.Now;
        public DateTime NgayCapNhat { get; set; } = DateTime.Now;

        [ForeignKey("MaLoai")]
        public virtual LoaiThietBi? LoaiThietBi { get; set; }
        
        [ForeignKey("MaDVT")]
        public virtual DonViTinh? DonViTinh { get; set; }
    }
}
