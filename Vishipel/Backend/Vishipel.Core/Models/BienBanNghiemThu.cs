using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Vishipel.Core.Models
{
    public class BienBanNghiemThu
    {
        [Key]
        public int MaBienBan { get; set; }
        
        public int MaDonHang { get; set; }

        public DateTime NgayLap { get; set; } = DateTime.Now;
        
        public int? NguoiLapId { get; set; }
        
        [StringLength(1000)]
        public string? GhiChuKiemTra { get; set; }
        
        [StringLength(200)]
        public string? DanhGiaChung { get; set; }

        [StringLength(255)]
        public string? DiaDiem { get; set; }
        
        [StringLength(100)]
        public string? DaiDienBenA { get; set; }
        
        [StringLength(100)]
        public string? ChucVuBenA { get; set; }
        
        [StringLength(100)]
        public string? DaiDienBenB { get; set; }
        
        [StringLength(100)]
        public string? ChucVuBenB { get; set; }
        
        public string? NoiDungDichVu { get; set; }
        
        public DateTime? ThoiGianBatDau { get; set; }
        public DateTime? ThoiGianKetThuc { get; set; }

        // Khách hàng xác nhận
        public bool CustomerConfirmed { get; set; } = false;
        public DateTime? NgayXacNhan { get; set; }

        [ForeignKey("MaDonHang")]
        public virtual DonDatHang? DonDatHang { get; set; }

        [ForeignKey("NguoiLapId")]
        public virtual TaiKhoan? NguoiLap { get; set; }
    }
}
