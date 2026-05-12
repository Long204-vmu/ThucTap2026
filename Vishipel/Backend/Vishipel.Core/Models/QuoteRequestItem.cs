using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vishipel.Core.Models
{
    public class QuoteRequestItem
    {
        [Key]
        public int Id { get; set; }
        public int QuoteRequestId { get; set; }
        public int ProductId { get; set; }
        public required string ProductName { get; set; }
        public int Quantity { get; set; } = 1;
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal? ReferencePrice { get; set; } // Giá tham khảo lúc đặt (nếu có)
        
        [ForeignKey("QuoteRequestId")]
        public QuoteRequest? QuoteRequest { get; set; }

        [ForeignKey("ProductId")]
        public Product? Product { get; set; }
    }
}
