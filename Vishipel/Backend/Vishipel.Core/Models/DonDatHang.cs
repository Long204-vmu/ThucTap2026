using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vishipel.Core.Models
{
    public class DonDatHang
    {
        [Key]
        public int MaDonHang { get; set; }
        
        [StringLength(20)]
        public string? OrderCode { get; set; } // Ví dụ: DH2026-0001

        public DateTime NgayDat { get; set; } = DateTime.Now;
        
        public int? MaKH { get; set; }
        public int? MaTaiKhoan { get; set; }
        
        public int? QuoteRequestId { get; set; }

        public decimal TongGiaTri { get; set; }
        
        public string Status { get; set; } = "Created"; // Created, ContractDraft, ContractSigned, Delivering, Delivered, InvoiceIssued, Completed

        public string? PaymentMethod { get; set; }
        public string? Note { get; set; }

        // 1. Thông tin Vận chuyển & Giao nhận (Logistics)
        public string? ShippingAddress { get; set; }
        public string? ShippingMethod { get; set; }
        public decimal? ShippingCost { get; set; }
        public DateTime? ExpectedDeliveryDate { get; set; }
        public string? ReceiverName { get; set; }
        public string? ReceiverPhone { get; set; }

        // 2. Điều khoản Thanh toán & Tài chính chi tiết
        public string? BillingInfo { get; set; } // MST, Tên Cty, Địa chỉ hóa đơn
        public bool IsDepositPaid { get; set; } = false;

        // 3. Quản lý nội bộ & Vận hành (Operations)
        public int? AssigneeId { get; set; }
        public byte? WarehouseId { get; set; }
        public DateTime? Deadline { get; set; }

        // 4. Điều khoản Kỹ thuật, Bảo hành & Cam kết
        public string? WarrantyTerms { get; set; }
        public string? TechnicalNotes { get; set; }

        [ForeignKey("MaKH")]
        public virtual KhachHang? KhachHang { get; set; }
        
        [ForeignKey("MaTaiKhoan")]
        public virtual TaiKhoan? TaiKhoan { get; set; }

        [ForeignKey("AssigneeId")]
        public virtual TaiKhoan? Assignee { get; set; }

        [ForeignKey("WarehouseId")]
        public virtual Kho? Warehouse { get; set; }

        [ForeignKey("QuoteRequestId")]
        public virtual QuoteRequest? QuoteRequest { get; set; }
        
        public virtual ICollection<ChiTietDonHang> ChiTietDonHangs { get; set; } = new List<ChiTietDonHang>();
        
        public virtual ICollection<KeHoachCongNo> PaymentSchedules { get; set; } = new List<KeHoachCongNo>();
        
        // Link to other documents
        public virtual HopDong? Contract { get; set; }
        public virtual HoaDon? Invoice { get; set; }
        
        public virtual ICollection<BienBanNghiemThu>? BienBanNghiemThus { get; set; }
        
        public virtual ICollection<PhieuThu>? PhieuThus { get; set; }
    }
}
