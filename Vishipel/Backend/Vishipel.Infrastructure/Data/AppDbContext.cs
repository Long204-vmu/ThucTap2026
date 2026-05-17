using Microsoft.EntityFrameworkCore;
using Vishipel.Core.Models;

namespace Vishipel.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // 1. Nhóm Hệ thống & Phân quyền
        public DbSet<VaiTro> VaiTros { get; set; }
        public DbSet<ChiNhanh> ChiNhanhs { get; set; }
        public DbSet<TaiKhoan> TaiKhoans { get; set; }
        public DbSet<NhatKyHeThong> NhatKyHeThongs { get; set; }

        // 2. Nhóm Danh mục & Đối tác
        public DbSet<LoaiThietBi> LoaiThietBis { get; set; }
        public DbSet<DonViTinh> DonViTinhs { get; set; }
        public DbSet<NhaCungCap> NhaCungCaps { get; set; }
        public DbSet<KhachHang> KhachHangs { get; set; }

        // 3. Nhóm Thiết bị
        public DbSet<ThietBi> ThietBis { get; set; }
        public DbSet<DanhMucSeri> DanhMucSeris { get; set; }
        public DbSet<ThanhLyHangHoa> ThanhLyHangHoas { get; set; }

        // 4. Nhóm Bán hàng & Hợp đồng
        public DbSet<DonDatHang> DonDatHangs { get; set; }
        public DbSet<ChiTietDonHang> ChiTietDonHangs { get; set; }
        public DbSet<HopDong> HopDongs { get; set; }
        public DbSet<HoaDon> HoaDons { get; set; }

        // 5. Nhóm Kho & Tồn kho
        public DbSet<Kho> Khos { get; set; }
        public DbSet<PhieuNhapKho> PhieuNhapKhos { get; set; }
        public DbSet<ChiTietNhapKho> ChiTietNhapKhos { get; set; }
        public DbSet<PhieuXuatKho> PhieuXuatKhos { get; set; }
        public DbSet<ChiTietXuatKho> ChiTietXuatKhos { get; set; }
        public DbSet<TonKhoChiTiet> TonKhoChiTiets { get; set; }

        // 6. Nhóm Tài chính & Công nợ
        public DbSet<PhieuThu> PhieuThus { get; set; }
        public DbSet<PhieuChi> PhieuChis { get; set; }
        public DbSet<KeHoachCongNo> KeHoachCongNos { get; set; }

        // 7. Nhóm Website & Tương tác
        public DbSet<YeuCauHoTro> YeuCauHoTros { get; set; }
        public DbSet<CauHinhHeThong> CauHinhHeThongs { get; set; }
        public DbSet<BienBanNghiemThu> BienBanNghiemThus { get; set; }
        public DbSet<QuoteRequest> QuoteRequests { get; set; }
        public DbSet<QuoteRequestItem> QuoteRequestItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            base.OnModelCreating(modelBuilder);

            // Composite Keys
            modelBuilder.Entity<ChiTietDonHang>()
                .HasKey(c => new { c.MaDonHang, c.MaThietBi });

            modelBuilder.Entity<ChiTietNhapKho>()
                .HasKey(c => new { c.MaPhieuNhap, c.MaThietBi });

            modelBuilder.Entity<TonKhoChiTiet>()
                .HasKey(t => new { t.MaKho, t.MaThietBi });

            // Relationships Configuration
            
            // DonDatHang ↔ ChiTietDonHang
            modelBuilder.Entity<ChiTietDonHang>()
                .HasOne(c => c.DonDatHang)
                .WithMany(d => d.ChiTietDonHangs)
                .HasForeignKey(c => c.MaDonHang)
                .OnDelete(DeleteBehavior.Cascade);

            // PhieuNhapKho ↔ ChiTietNhapKho
            modelBuilder.Entity<ChiTietNhapKho>()
                .HasOne(c => c.PhieuNhapKho)
                .WithMany(p => p.ChiTietNhapKhos)
                .HasForeignKey(c => c.MaPhieuNhap)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ChiTietXuatKho>()
                .HasKey(c => new { c.MaPhieuXuat, c.MaThietBi });

            modelBuilder.Entity<ChiTietXuatKho>()
                .HasOne(c => c.PhieuXuatKho)
                .WithMany(p => p.ChiTietXuatKhos)
                .HasForeignKey(c => c.MaPhieuXuat)
                .OnDelete(DeleteBehavior.Cascade);

            // Precision for Decimal types
            foreach (var property in modelBuilder.Model.GetEntityTypes()
                .SelectMany(t => t.GetProperties())
                .Where(p => p.ClrType == typeof(decimal) || p.ClrType == typeof(decimal?)))
            {
                property.SetPrecision(15);
                property.SetScale(2);
            }

            // Unsigned Vietnamese Table Naming (Optional but requested by user in SQL script)
            // If the user wants the exact names from the script:
            modelBuilder.Entity<VaiTro>().ToTable("VaiTro");
            
            modelBuilder.Entity<ChiNhanh>().ToTable("ChiNhanh");


            modelBuilder.Entity<TaiKhoan>().ToTable("TaiKhoan");
            modelBuilder.Entity<LoaiThietBi>().ToTable("LoaiThietBi");
            modelBuilder.Entity<DonViTinh>().ToTable("DonViTinh");
            modelBuilder.Entity<NhaCungCap>().ToTable("NhaCungCap");
            modelBuilder.Entity<KhachHang>().ToTable("KhachHang");
            modelBuilder.Entity<ThietBi>().ToTable("ThietBi");
            modelBuilder.Entity<DonDatHang>().ToTable("DonDatHang");
            modelBuilder.Entity<ChiTietDonHang>().ToTable("ChiTietDonHang");
            modelBuilder.Entity<HopDong>().ToTable("HopDong");
            modelBuilder.Entity<HoaDon>().ToTable("HoaDon");
            modelBuilder.Entity<Kho>().ToTable("Kho");
            modelBuilder.Entity<PhieuNhapKho>().ToTable("PhieuNhapKho");
            modelBuilder.Entity<ChiTietNhapKho>().ToTable("ChiTietNhapKho");
            modelBuilder.Entity<PhieuXuatKho>().ToTable("PhieuXuatKho");
            modelBuilder.Entity<ChiTietXuatKho>().ToTable("ChiTietXuatKho");
            modelBuilder.Entity<TonKhoChiTiet>().ToTable("TonKhoChiTiet");
            modelBuilder.Entity<DanhMucSeri>().ToTable("DanhMucSeri");
            modelBuilder.Entity<ThanhLyHangHoa>().ToTable("ThanhLyHangHoa");
            modelBuilder.Entity<PhieuThu>().ToTable("PhieuThu");
            modelBuilder.Entity<PhieuChi>().ToTable("PhieuChi");
            modelBuilder.Entity<KeHoachCongNo>().ToTable("KeHoachCongNo");
            modelBuilder.Entity<YeuCauHoTro>().ToTable("YeuCauHoTro");
            modelBuilder.Entity<BienBanNghiemThu>().ToTable("BienBanNghiemThu");
            modelBuilder.Entity<NhatKyHeThong>().ToTable("NhatKyHeThong");
            modelBuilder.Entity<CauHinhHeThong>().ToTable("CauHinhHeThong");
            modelBuilder.Entity<QuoteRequest>().ToTable("QuoteRequests");
            modelBuilder.Entity<QuoteRequestItem>().ToTable("QuoteRequestItems");
        }

    }
}
