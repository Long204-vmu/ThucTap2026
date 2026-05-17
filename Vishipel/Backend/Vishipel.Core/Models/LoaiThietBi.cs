using System.ComponentModel.DataAnnotations;

namespace Vishipel.Core.Models
{
    public class LoaiThietBi
    {
        [Key]
        public int MaLoai { get; set; }
        
        [Required]
        [StringLength(100)]
        public string TenLoai { get; set; } = null!;

        [StringLength(500)]
        public string? MoTa { get; set; }

        // Navigation property
        public virtual ICollection<ThietBi> ThietBis { get; set; } = new List<ThietBi>();
    }
}
