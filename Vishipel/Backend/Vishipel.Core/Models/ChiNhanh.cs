using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vishipel.Core.Models
{
    public class ChiNhanh
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public byte MaChiNhanh { get; set; }
        public required string TenChiNhanh { get; set; }
        public string? DiaChi { get; set; }
        public string? SoDienThoai { get; set; }
    }
}
