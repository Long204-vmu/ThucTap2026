using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vishipel.Core.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string OrderCode { get; set; } = ""; // VD: "DH-2026-00001"

        public int QuoteRequestId { get; set; }
        public int CustomerId { get; set; }       // UserId của khách hàng
        public int CreatedByUserId { get; set; }   // Admin/Sale tạo đơn

        // Created → ContractDraft → ContractSigned → Delivering → Delivered → InvoiceIssued → Completed
        public string Status { get; set; } = "Created";

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        public string PaymentMethod { get; set; } = "HợpĐồng"; // HợpĐồng / TrựcTiếp
        public string? Note { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        [ForeignKey("QuoteRequestId")]
        public QuoteRequest? QuoteRequest { get; set; }

        [ForeignKey("CustomerId")]
        public User? Customer { get; set; }

        public ICollection<OrderItem>? Items { get; set; }
        public Contract? Contract { get; set; }
        public DeliveryOrder? DeliveryOrder { get; set; }
        public Invoice? Invoice { get; set; }
        public ICollection<PaymentSchedule>? PaymentSchedules { get; set; }
    }
}
