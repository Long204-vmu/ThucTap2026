using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vishipel.Core.Models
{
    public class PaymentSchedule
    {
        [Key]
        public int Id { get; set; }

        public int OrderId { get; set; }

        [Required]
        public string PhaseName { get; set; } = ""; // "Tạm ứng" / "Giao hàng" / "Nghiệm thu"

        public int PhaseOrder { get; set; } = 1; // Thứ tự đợt: 1, 2, 3

        [Column(TypeName = "decimal(5,2)")]
        public decimal Percentage { get; set; }  // % thanh toán đợt này

        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }      // Số tiền đợt này

        public DateTime? DueDate { get; set; }   // Hạn thanh toán

        // Pending → Paid → Overdue
        public string Status { get; set; } = "Pending";

        public DateTime? PaidAt { get; set; }
        public string? Note { get; set; }

        // Navigation
        [ForeignKey("OrderId")]
        public Order? Order { get; set; }
    }
}
