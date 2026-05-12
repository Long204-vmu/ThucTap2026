using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vishipel.Core.Models
{
    public class DeliveryOrder
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string DeliveryCode { get; set; } = ""; // VD: "PXK-2026-00001"

        public int OrderId { get; set; }

        // Nhân viên kho xử lý
        public int? WarehouseStaffId { get; set; }

        // Pending → Delivering → Delivered
        public string Status { get; set; } = "Pending";

        public string? DeliveryAddress { get; set; }
        public string? ReceiverName { get; set; }
        public string? ReceiverPhone { get; set; }
        public string? Note { get; set; }

        public DateTime? DeliveredAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        [ForeignKey("OrderId")]
        public Order? Order { get; set; }

        [ForeignKey("WarehouseStaffId")]
        public User? WarehouseStaff { get; set; }
    }
}
