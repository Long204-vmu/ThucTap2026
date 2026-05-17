using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vishipel.Core.Models
{
    public class QuoteRequest
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual TaiKhoan? User { get; set; }

        public string? Note { get; set; }

        public string Status { get; set; } = "Pending"; // Pending, Quoted, Canceled

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public string? AdminReply { get; set; }

        public decimal? TotalQuotedPrice { get; set; }

        public virtual ICollection<QuoteRequestItem> Items { get; set; } = new List<QuoteRequestItem>();
    }

    public class QuoteRequestItem
    {
        [Key]
        public int Id { get; set; }

        public int QuoteRequestId { get; set; }

        [ForeignKey("QuoteRequestId")]
        public virtual QuoteRequest? QuoteRequest { get; set; }

        public int ProductId { get; set; }

        public string ProductName { get; set; } = null!;

        public int Quantity { get; set; }

        public decimal? ReferencePrice { get; set; }
    }
}
