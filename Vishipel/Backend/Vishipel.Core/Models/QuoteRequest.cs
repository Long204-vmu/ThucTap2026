using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vishipel.Core.Models
{
    public class QuoteRequest
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public string? Note { get; set; }
        
        // Trạng thái: Pending (Đang chờ), Quoted (Đã báo giá), Accepted (Đã đồng ý), Rejected (Đã từ chối)
        public string Status { get; set; } = "Pending"; 
        
        public string? AdminReply { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal? TotalQuotedPrice { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        public DateTime? AcceptedAt { get; set; }
        public DateTime? RejectedAt { get; set; }
        public string? RejectionReason { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }

        public ICollection<QuoteRequestItem>? Items { get; set; }
    }
}
