using Microsoft.EntityFrameworkCore;
using Vishipel.Core.Models;

namespace Vishipel.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // ── Existing ──
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<QuoteRequest> QuoteRequests { get; set; }
        public DbSet<QuoteRequestItem> QuoteRequestItems { get; set; }
        public DbSet<ProductReview> ProductReviews { get; set; }

        // ── New: Business Workflow ──
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Contract> Contracts { get; set; }
        public DbSet<DeliveryOrder> DeliveryOrders { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<PaymentSchedule> PaymentSchedules { get; set; }
        public DbSet<WarrantyRecord> WarrantyRecords { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Quan hệ 1-1: Order ↔ Contract
            modelBuilder.Entity<Order>()
                .HasOne(o => o.Contract)
                .WithOne(c => c.Order)
                .HasForeignKey<Contract>(c => c.OrderId)
                .OnDelete(DeleteBehavior.Restrict);

            // Quan hệ 1-1: Order ↔ DeliveryOrder
            modelBuilder.Entity<Order>()
                .HasOne(o => o.DeliveryOrder)
                .WithOne(d => d.Order)
                .HasForeignKey<DeliveryOrder>(d => d.OrderId)
                .OnDelete(DeleteBehavior.Restrict);

            // Quan hệ 1-1: Order ↔ Invoice
            modelBuilder.Entity<Order>()
                .HasOne(o => o.Invoice)
                .WithOne(i => i.Order)
                .HasForeignKey<Invoice>(i => i.OrderId)
                .OnDelete(DeleteBehavior.Restrict);

            // Quan hệ 1-N: Order ↔ OrderItems
            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.Items)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // Quan hệ 1-N: Order ↔ PaymentSchedules
            modelBuilder.Entity<PaymentSchedule>()
                .HasOne(ps => ps.Order)
                .WithMany(o => o.PaymentSchedules)
                .HasForeignKey(ps => ps.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // Quan hệ 1-N: OrderItem ↔ WarrantyRecords
            modelBuilder.Entity<WarrantyRecord>()
                .HasOne(w => w.OrderItem)
                .WithMany(oi => oi.WarrantyRecords)
                .HasForeignKey(w => w.OrderItemId)
                .OnDelete(DeleteBehavior.Cascade);

            // Tránh cascade cycle cho Order → Customer
            modelBuilder.Entity<Order>()
                .HasOne(o => o.Customer)
                .WithMany()
                .HasForeignKey(o => o.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            // Tránh cascade cycle cho DeliveryOrder → WarehouseStaff
            modelBuilder.Entity<DeliveryOrder>()
                .HasOne(d => d.WarehouseStaff)
                .WithMany()
                .HasForeignKey(d => d.WarehouseStaffId)
                .OnDelete(DeleteBehavior.Restrict);

            // Tránh cascade cycle cho OrderItem → Product
            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Product)
                .WithMany()
                .HasForeignKey(oi => oi.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            // Tránh cascade cycle cho WarrantyRecord → Product
            modelBuilder.Entity<WarrantyRecord>()
                .HasOne(w => w.Product)
                .WithMany()
                .HasForeignKey(w => w.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            // Product ↔ ProductReview
            modelBuilder.Entity<ProductReview>()
                .HasOne(pr => pr.Product)
                .WithMany(p => p.Reviews)
                .HasForeignKey(pr => pr.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            // User ↔ ProductReview
            modelBuilder.Entity<ProductReview>()
                .HasOne(pr => pr.User)
                .WithMany()
                .HasForeignKey(pr => pr.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ProductReview>()
                .HasIndex(pr => new { pr.ProductId, pr.UserId })
                .IsUnique();
        }
    }
}
