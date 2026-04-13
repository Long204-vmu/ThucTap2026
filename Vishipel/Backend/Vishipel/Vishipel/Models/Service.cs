using System.ComponentModel.DataAnnotations;

namespace Vishipel.Models
{
    public class Service
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public string? Name { get; set; }
        
        // Bạn có thể giữ liên kết với Category hoặc tạo bảng ServiceCategory riêng tùy ý
        public int? CategoryId { get; set; }
        public Category? Category { get; set; }

        public string? ShortDescription { get; set; }
        public string? Description { get; set; }
        
        // Dịch vụ thường dùng chuỗi thay vì số nguyên (VD: "Liên hệ", "Từ 5.000.000đ")
        public string? PriceDisplay { get; set; } 
        
        public string Status { get; set; } = "Sẵn sàng";
        
        // Quy trình, phạm vi công việc, chứng nhận (Lưu dạng JSON)
        public string? SpecsJson { get; set; } 
        
        public string? ImagesJson { get; set; }
    }
}