using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vishipel.Core.Models
{
    public class Invoice
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string InvoiceNumber { get; set; } = ""; // Số hóa đơn

        public int OrderId { get; set; }

        // ── Thông tin hóa đơn theo mẫu ──
        public string? Department { get; set; }      // Phòng CM/đơn vị
        public string? RecipientName { get; set; }   // Kính gửi
        public string? BuyerName { get; set; }       // Tên tôi là
        public string? BuyerCompany { get; set; }    // Đơn vị công tác
        public string? BuyerAddress { get; set; }    // Địa chỉ
        public string? BuyerTaxCode { get; set; }    // CMND/Mã số thuế
        public string? Content { get; set; }         // Nội dung: Cung cấp thiết bị...

        // Hình thức thanh toán: Tiền mặt / Chuyển khoản / Bù trừ
        public string PaymentMethod { get; set; } = "Chuyển khoản";
        public string? BankAccount { get; set; }     // STK

        // ── Tính toán tiền ──
        [Column(TypeName = "decimal(18,2)")]
        public decimal SubTotal { get; set; }        // Tổng trước thuế

        [Column(TypeName = "decimal(5,2)")]
        public decimal VatRate { get; set; } = 10;   // Thuế VAT (%)

        [Column(TypeName = "decimal(18,2)")]
        public decimal VatAmount { get; set; }       // Tiền thuế VAT

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }     // Thành tiền (sau thuế)

        public string? AmountInWords { get; set; }   // Bằng chữ

        // Draft → Issued
        public string Status { get; set; } = "Draft";

        public DateTime InvoiceDate { get; set; } = DateTime.UtcNow;
        public DateTime? IssuedAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        [ForeignKey("OrderId")]
        public Order? Order { get; set; }
    }
}
