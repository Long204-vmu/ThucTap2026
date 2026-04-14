using System.ComponentModel.DataAnnotations;

namespace Vishipel.Models
{
    public class ServiceRequest
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string CustomerName { get; set; }
        [Required]
        public string Phone { get; set; }
        public string? Email { get; set; }
        public string? AdminNote { get; set; } // Hứng tên sản phẩm khách muốn tư vấn
        public string Status { get; set; } = "Mới";
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}