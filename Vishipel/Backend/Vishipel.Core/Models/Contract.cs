using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vishipel.Core.Models
{
    public class Contract
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string ContractNumber { get; set; } = ""; // VD: "001/2026/VISHIPEL"

        public int OrderId { get; set; }

        // ── Thông tin Bên A (Khách hàng) ──
        [Required]
        public string PartyAName { get; set; } = "";
        public string? PartyAAddress { get; set; }
        public string? PartyAPhone { get; set; }
        public string? PartyAFax { get; set; }
        public string? PartyABankAccount { get; set; }
        public string? PartyABank { get; set; }
        public string? PartyATaxCode { get; set; }
        public string? PartyARepresentative { get; set; }  // Người đại diện
        public string? PartyAPosition { get; set; }         // Chức vụ

        // ── Thông tin Bên B (VISHIPEL) ──
        public string PartyBName { get; set; } = "Công ty TNHH MTV Thông tin Điện tử Hàng hải Việt Nam";
        public string? PartyBAddress { get; set; }
        public string? PartyBPhone { get; set; }
        public string? PartyBFax { get; set; }
        public string? PartyBBankAccount { get; set; }
        public string? PartyBBank { get; set; }
        public string? PartyBTaxCode { get; set; }
        public string? PartyBRepresentative { get; set; }
        public string? PartyBPosition { get; set; }

        // ── Nội dung hợp đồng ──
        public string? Subject { get; set; }         // Vv: Cung cấp thiết bị...
        public string? PaymentTerms { get; set; }    // Điều khoản thanh toán
        public string? DeliveryTerms { get; set; }   // Điều khoản giao hàng
        public string? WarrantyTerms { get; set; }   // Điều khoản bảo hành
        public string? AdditionalTerms { get; set; } // Điều khoản bổ sung

        [Column(TypeName = "decimal(5,2)")]
        public decimal DiscountPercent { get; set; } = 0; // Chiết khấu (%)

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        // ── Workflow phê duyệt ──
        // Draft → PendingApproval → Approved → Signed
        public string Status { get; set; } = "Draft";

        public int? ApprovedByUserId { get; set; }   // Manager duyệt
        public DateTime? ApprovedAt { get; set; }
        public DateTime? SignedAt { get; set; }
        public string? RejectionReason { get; set; } // Lý do từ chối (nếu có)

        public DateTime ContractDate { get; set; } = DateTime.UtcNow;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        [ForeignKey("OrderId")]
        public Order? Order { get; set; }
    }
}
