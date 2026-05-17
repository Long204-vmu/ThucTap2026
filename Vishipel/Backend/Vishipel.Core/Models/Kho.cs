using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vishipel.Core.Models
{
    public class Kho
    {
        [Key]
        public byte MaKho { get; set; }
        
        [Required]
        [StringLength(100)]
        public string TenKho { get; set; } = null!;
        
        public byte? MaChiNhanh { get; set; }

        [ForeignKey("MaChiNhanh")]
        public virtual ChiNhanh? ChiNhanh { get; set; }
    }
}
