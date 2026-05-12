using System.ComponentModel.DataAnnotations;

namespace Vishipel.Core.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public required string FullName { get; set; }
        public required string Email { get; set; }
        public string? Phone { get; set; }
        public required string Username { get; set; }
        public required string PasswordHash { get; set; }
        public string? Department { get; set; }
        public string Role { get; set; } = "User";
        public bool IsApproved { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
