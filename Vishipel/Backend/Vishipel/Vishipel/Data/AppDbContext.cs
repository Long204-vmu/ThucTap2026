using Microsoft.EntityFrameworkCore;
using Vishipel.Models;

namespace Vishipel.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<User> Users { get; set; }
        // public DbSet<SupportRequest> SupportRequests { get; set; }
    }
}