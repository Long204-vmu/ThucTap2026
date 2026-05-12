using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vishipel.Core.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }
        public int CategoryId { get; set; }
        public required string Name { get; set; }
        public string? Model { get; set; }
        public string? Brand { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        public string Status { get; set; } = "Còn hàng";
        public int StockQuantity { get; set; } = 0;
        public int LowStockThreshold { get; set; } = 5;
        public bool IsDiscontinued { get; set; } = false;
        
        public double Rating { get; set; } = 5.0;
        public int ReviewCount { get; set; } = 0;
        
        public string? ShortDescription { get; set; }
        public string? Description { get; set; }
        public string? Warranty { get; set; }
        public string? Origin { get; set; }

        // Lưu trữ mảng dưới dạng chuỗi JSON
        public string? ImagesJson { get; set; }
        public string? SpecsJson { get; set; }
        public string? CertificationsJson { get; set; }

        // Navigation property
        [ForeignKey("CategoryId")]
        public Category? Category { get; set; }
        public ICollection<ProductReview> Reviews { get; set; } = new List<ProductReview>();
    }
}
