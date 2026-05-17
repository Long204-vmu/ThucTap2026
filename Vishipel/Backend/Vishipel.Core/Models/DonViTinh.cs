using System.ComponentModel.DataAnnotations;

namespace Vishipel.Core.Models
{
    public class DonViTinh
    {
        [Key]
        public byte MaDVT { get; set; }
        
        [Required]
        [StringLength(50)]
        public string TenDVT { get; set; } = null!;
    }
}
