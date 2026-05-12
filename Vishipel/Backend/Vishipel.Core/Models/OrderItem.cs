using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vishipel.Core.Models
{
    public class OrderItem
    {
        [Key]
        public int Id { get; set; }

        public int OrderId { get; set; }
        public int ProductId { get; set; }

        [Required]
        public string ProductName { get; set; } = "";

        public string? Unit { get; set; } = "Cái"; // ĐVT: Cái, Bộ, Chiếc...

        public int Quantity { get; set; } = 1;

        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }  // Đơn giá (VND)

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPrice { get; set; }  // Thành tiền = Quantity * UnitPrice

        // Danh sách Serial Number (lưu JSON: ["SN001","SN002"])
        public string? SerialNumbersJson { get; set; }

        // Vị trí lắp đặt
        public string? InstallLocation { get; set; }

        // Navigation properties
        [ForeignKey("OrderId")]
        public Order? Order { get; set; }

        [ForeignKey("ProductId")]
        public Product? Product { get; set; }

        public ICollection<WarrantyRecord>? WarrantyRecords { get; set; }
    }
}
