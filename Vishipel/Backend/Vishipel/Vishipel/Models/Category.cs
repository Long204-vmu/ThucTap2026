using System.ComponentModel.DataAnnotations;

namespace Vishipel.Models
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

        private string? _categoryType;
        public string CategoryType 
        { 
            get => string.IsNullOrEmpty(_categoryType) ? "Product" : _categoryType; 
            set => _categoryType = value; 
        }
    }
}