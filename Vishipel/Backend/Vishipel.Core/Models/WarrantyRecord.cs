using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vishipel.Core.Models
{
    public class WarrantyRecord
    {
        [Key]
        public int Id { get; set; }

        public int OrderItemId { get; set; }
        public int ProductId { get; set; }

        public string? SerialNumber { get; set; }
        public string? InstallLocation { get; set; }  // Vị trí lắp đặt

        public DateTime WarrantyStartDate { get; set; }
        public DateTime WarrantyEndDate { get; set; }
        public string? WarrantyTerms { get; set; }     // Điều khoản bảo hành

        // Thông tin khách
        public string? CustomerName { get; set; }
        public string? CustomerPhone { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        [ForeignKey("OrderItemId")]
        public OrderItem? OrderItem { get; set; }

        [ForeignKey("ProductId")]
        public Product? Product { get; set; }
    }
}
