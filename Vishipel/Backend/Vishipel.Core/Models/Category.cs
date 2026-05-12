using System.ComponentModel.DataAnnotations;

namespace Vishipel.Core.Models
{
    public class Category
    {
        [Key]
        public int Id { get; set; }
        public required string Slug { get; set; }
        public required string Name { get; set; }
        public string? ColorCode { get; set; }

        // Navigation property
        public ICollection<Product>? Products { get; set; }

    }
}
