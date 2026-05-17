using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vishipel.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialNormalizedSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Contracts");

            migrationBuilder.DropTable(
                name: "DeliveryOrders");

            migrationBuilder.DropTable(
                name: "Invoices");

            migrationBuilder.DropTable(
                name: "PaymentSchedules");

            migrationBuilder.DropTable(
                name: "ProductReviews");

            migrationBuilder.DropTable(
                name: "QuoteRequestItems");

            migrationBuilder.DropTable(
                name: "WarrantyRecords");

            migrationBuilder.DropTable(
                name: "OrderItems");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "QuoteRequests");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.CreateTable(
                name: "ChiNhanh",
                columns: table => new
                {
                    MaChiNhanh = table.Column<byte>(type: "tinyint", nullable: false),
                    TenChiNhanh = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DiaChi = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SoDienThoai = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiNhanh", x => x.MaChiNhanh);
                });

            migrationBuilder.CreateTable(
                name: "DonViTinh",
                columns: table => new
                {
                    MaDVT = table.Column<byte>(type: "tinyint", nullable: false),
                    TenDVT = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DonViTinh", x => x.MaDVT);
                });

            migrationBuilder.CreateTable(
                name: "KhachHang",
                columns: table => new
                {
                    MaKH = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenKH = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    MST = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    DiaChi = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    SoDienThoai = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    LoaiKhachHang = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KhachHang", x => x.MaKH);
                });

            migrationBuilder.CreateTable(
                name: "LoaiThietBi",
                columns: table => new
                {
                    MaLoai = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenLoai = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LoaiThietBi", x => x.MaLoai);
                });

            migrationBuilder.CreateTable(
                name: "NhaCungCap",
                columns: table => new
                {
                    MaNCC = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenNCC = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    MST = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    DiaChi = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    SoDienThoai = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: true),
                    NguoiLienHe = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NhaCungCap", x => x.MaNCC);
                });

            migrationBuilder.CreateTable(
                name: "VaiTro",
                columns: table => new
                {
                    MaVaiTro = table.Column<byte>(type: "tinyint", nullable: false),
                    TenVaiTro = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VaiTro", x => x.MaVaiTro);
                });

            migrationBuilder.CreateTable(
                name: "YeuCauHoTro",
                columns: table => new
                {
                    MaYeuCau = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HoTen = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    SoDienThoai = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    CongTy = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    LoaiYeuCau = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    TieuDe = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    NoiDung = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TrangThai = table.Column<byte>(type: "tinyint", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_YeuCauHoTro", x => x.MaYeuCau);
                });

            migrationBuilder.CreateTable(
                name: "Kho",
                columns: table => new
                {
                    MaKho = table.Column<byte>(type: "tinyint", nullable: false),
                    TenKho = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    MaChiNhanh = table.Column<byte>(type: "tinyint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kho", x => x.MaKho);
                    table.ForeignKey(
                        name: "FK_Kho_ChiNhanh_MaChiNhanh",
                        column: x => x.MaChiNhanh,
                        principalTable: "ChiNhanh",
                        principalColumn: "MaChiNhanh");
                });

            migrationBuilder.CreateTable(
                name: "ThietBi",
                columns: table => new
                {
                    MaThietBi = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaLoai = table.Column<int>(type: "int", nullable: true),
                    MaDVT = table.Column<byte>(type: "tinyint", nullable: true),
                    TenThietBi = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Model = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    HangSanXuat = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    GiaBan = table.Column<decimal>(type: "decimal(15,2)", precision: 15, scale: 2, nullable: false),
                    TrangThai = table.Column<byte>(type: "tinyint", nullable: false),
                    BaoHanhThang = table.Column<byte>(type: "tinyint", nullable: false),
                    XuatXu = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    MoTaNgan = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    MoTaChiTiet = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ThongSoKyThuat = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HinhAnhJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DiemDanhGia = table.Column<decimal>(type: "decimal(15,2)", precision: 15, scale: 2, nullable: false),
                    LuotXem = table.Column<int>(type: "int", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThietBi", x => x.MaThietBi);
                    table.ForeignKey(
                        name: "FK_ThietBi_DonViTinh_MaDVT",
                        column: x => x.MaDVT,
                        principalTable: "DonViTinh",
                        principalColumn: "MaDVT");
                    table.ForeignKey(
                        name: "FK_ThietBi_LoaiThietBi_MaLoai",
                        column: x => x.MaLoai,
                        principalTable: "LoaiThietBi",
                        principalColumn: "MaLoai");
                });

            migrationBuilder.CreateTable(
                name: "TaiKhoan",
                columns: table => new
                {
                    MaTaiKhoan = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenDangNhap = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    MatKhau = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    HoTen = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    SoDienThoai = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: true),
                    MaVaiTro = table.Column<byte>(type: "tinyint", nullable: true),
                    MaChiNhanh = table.Column<byte>(type: "tinyint", nullable: true),
                    TrangThai = table.Column<bool>(type: "bit", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaiKhoan", x => x.MaTaiKhoan);
                    table.ForeignKey(
                        name: "FK_TaiKhoan_ChiNhanh_MaChiNhanh",
                        column: x => x.MaChiNhanh,
                        principalTable: "ChiNhanh",
                        principalColumn: "MaChiNhanh");
                    table.ForeignKey(
                        name: "FK_TaiKhoan_VaiTro_MaVaiTro",
                        column: x => x.MaVaiTro,
                        principalTable: "VaiTro",
                        principalColumn: "MaVaiTro");
                });

            migrationBuilder.CreateTable(
                name: "TonKhoChiTiet",
                columns: table => new
                {
                    MaKho = table.Column<byte>(type: "tinyint", nullable: false),
                    MaThietBi = table.Column<int>(type: "int", nullable: false),
                    SoLuongTon = table.Column<int>(type: "int", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TonKhoChiTiet", x => new { x.MaKho, x.MaThietBi });
                    table.ForeignKey(
                        name: "FK_TonKhoChiTiet_Kho_MaKho",
                        column: x => x.MaKho,
                        principalTable: "Kho",
                        principalColumn: "MaKho",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TonKhoChiTiet_ThietBi_MaThietBi",
                        column: x => x.MaThietBi,
                        principalTable: "ThietBi",
                        principalColumn: "MaThietBi",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DonDatHang",
                columns: table => new
                {
                    MaDonHang = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NgayDat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    MaKH = table.Column<int>(type: "int", nullable: true),
                    MaTaiKhoan = table.Column<int>(type: "int", nullable: true),
                    TongGiaTri = table.Column<decimal>(type: "decimal(15,2)", precision: 15, scale: 2, nullable: false),
                    TrangThai = table.Column<byte>(type: "tinyint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DonDatHang", x => x.MaDonHang);
                    table.ForeignKey(
                        name: "FK_DonDatHang_KhachHang_MaKH",
                        column: x => x.MaKH,
                        principalTable: "KhachHang",
                        principalColumn: "MaKH");
                    table.ForeignKey(
                        name: "FK_DonDatHang_TaiKhoan_MaTaiKhoan",
                        column: x => x.MaTaiKhoan,
                        principalTable: "TaiKhoan",
                        principalColumn: "MaTaiKhoan");
                });

            migrationBuilder.CreateTable(
                name: "NhatKyHeThong",
                columns: table => new
                {
                    MaLog = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaTaiKhoan = table.Column<int>(type: "int", nullable: true),
                    ThoiGian = table.Column<DateTime>(type: "datetime2", nullable: false),
                    HanhDong = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    NoiDung = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DiaChiIP = table.Column<string>(type: "nvarchar(45)", maxLength: 45, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NhatKyHeThong", x => x.MaLog);
                    table.ForeignKey(
                        name: "FK_NhatKyHeThong_TaiKhoan_MaTaiKhoan",
                        column: x => x.MaTaiKhoan,
                        principalTable: "TaiKhoan",
                        principalColumn: "MaTaiKhoan");
                });

            migrationBuilder.CreateTable(
                name: "PhieuNhapKho",
                columns: table => new
                {
                    MaPhieuNhap = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NgayNhap = table.Column<DateTime>(type: "datetime2", nullable: false),
                    MaNCC = table.Column<int>(type: "int", nullable: true),
                    MaKho = table.Column<byte>(type: "tinyint", nullable: true),
                    MaTaiKhoan = table.Column<int>(type: "int", nullable: true),
                    GhiChu = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhieuNhapKho", x => x.MaPhieuNhap);
                    table.ForeignKey(
                        name: "FK_PhieuNhapKho_Kho_MaKho",
                        column: x => x.MaKho,
                        principalTable: "Kho",
                        principalColumn: "MaKho");
                    table.ForeignKey(
                        name: "FK_PhieuNhapKho_NhaCungCap_MaNCC",
                        column: x => x.MaNCC,
                        principalTable: "NhaCungCap",
                        principalColumn: "MaNCC");
                    table.ForeignKey(
                        name: "FK_PhieuNhapKho_TaiKhoan_MaTaiKhoan",
                        column: x => x.MaTaiKhoan,
                        principalTable: "TaiKhoan",
                        principalColumn: "MaTaiKhoan");
                });

            migrationBuilder.CreateTable(
                name: "ThanhLyHangHoa",
                columns: table => new
                {
                    MaThanhLy = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaThietBi = table.Column<int>(type: "int", nullable: true),
                    MaKho = table.Column<byte>(type: "tinyint", nullable: true),
                    NgayThanhLy = table.Column<DateTime>(type: "datetime2", nullable: true),
                    SoLuong = table.Column<int>(type: "int", nullable: false),
                    LyDo = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    MaTaiKhoan = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThanhLyHangHoa", x => x.MaThanhLy);
                    table.ForeignKey(
                        name: "FK_ThanhLyHangHoa_Kho_MaKho",
                        column: x => x.MaKho,
                        principalTable: "Kho",
                        principalColumn: "MaKho");
                    table.ForeignKey(
                        name: "FK_ThanhLyHangHoa_TaiKhoan_MaTaiKhoan",
                        column: x => x.MaTaiKhoan,
                        principalTable: "TaiKhoan",
                        principalColumn: "MaTaiKhoan");
                    table.ForeignKey(
                        name: "FK_ThanhLyHangHoa_ThietBi_MaThietBi",
                        column: x => x.MaThietBi,
                        principalTable: "ThietBi",
                        principalColumn: "MaThietBi");
                });

            migrationBuilder.CreateTable(
                name: "ChiTietDonHang",
                columns: table => new
                {
                    MaDonHang = table.Column<int>(type: "int", nullable: false),
                    MaThietBi = table.Column<int>(type: "int", nullable: false),
                    SoLuong = table.Column<int>(type: "int", nullable: false),
                    DonGiaBan = table.Column<decimal>(type: "decimal(15,2)", precision: 15, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietDonHang", x => new { x.MaDonHang, x.MaThietBi });
                    table.ForeignKey(
                        name: "FK_ChiTietDonHang_DonDatHang_MaDonHang",
                        column: x => x.MaDonHang,
                        principalTable: "DonDatHang",
                        principalColumn: "MaDonHang",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChiTietDonHang_ThietBi_MaThietBi",
                        column: x => x.MaThietBi,
                        principalTable: "ThietBi",
                        principalColumn: "MaThietBi",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HopDong",
                columns: table => new
                {
                    MaHopDong = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    MaDonHang = table.Column<int>(type: "int", nullable: true),
                    NgayKy = table.Column<DateTime>(type: "datetime2", nullable: true),
                    NoiDungTomTat = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GiaTriHopDong = table.Column<decimal>(type: "decimal(15,2)", precision: 15, scale: 2, nullable: false),
                    TrangThaiHieuLuc = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HopDong", x => x.MaHopDong);
                    table.ForeignKey(
                        name: "FK_HopDong_DonDatHang_MaDonHang",
                        column: x => x.MaDonHang,
                        principalTable: "DonDatHang",
                        principalColumn: "MaDonHang");
                });

            migrationBuilder.CreateTable(
                name: "ChiTietNhapKho",
                columns: table => new
                {
                    MaPhieuNhap = table.Column<int>(type: "int", nullable: false),
                    MaThietBi = table.Column<int>(type: "int", nullable: false),
                    SoLuong = table.Column<int>(type: "int", nullable: false),
                    DonGiaNhap = table.Column<decimal>(type: "decimal(15,2)", precision: 15, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietNhapKho", x => new { x.MaPhieuNhap, x.MaThietBi });
                    table.ForeignKey(
                        name: "FK_ChiTietNhapKho_PhieuNhapKho_MaPhieuNhap",
                        column: x => x.MaPhieuNhap,
                        principalTable: "PhieuNhapKho",
                        principalColumn: "MaPhieuNhap",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChiTietNhapKho_ThietBi_MaThietBi",
                        column: x => x.MaThietBi,
                        principalTable: "ThietBi",
                        principalColumn: "MaThietBi",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PhieuChi",
                columns: table => new
                {
                    MaPhieuChi = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SoPhieu = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    NgayChi = table.Column<DateTime>(type: "datetime2", nullable: false),
                    MaNCC = table.Column<int>(type: "int", nullable: true),
                    MaPhieuNhap = table.Column<int>(type: "int", nullable: true),
                    SoTien = table.Column<decimal>(type: "decimal(15,2)", precision: 15, scale: 2, nullable: false),
                    MaTaiKhoan = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhieuChi", x => x.MaPhieuChi);
                    table.ForeignKey(
                        name: "FK_PhieuChi_NhaCungCap_MaNCC",
                        column: x => x.MaNCC,
                        principalTable: "NhaCungCap",
                        principalColumn: "MaNCC");
                    table.ForeignKey(
                        name: "FK_PhieuChi_PhieuNhapKho_MaPhieuNhap",
                        column: x => x.MaPhieuNhap,
                        principalTable: "PhieuNhapKho",
                        principalColumn: "MaPhieuNhap");
                    table.ForeignKey(
                        name: "FK_PhieuChi_TaiKhoan_MaTaiKhoan",
                        column: x => x.MaTaiKhoan,
                        principalTable: "TaiKhoan",
                        principalColumn: "MaTaiKhoan");
                });

            migrationBuilder.CreateTable(
                name: "DanhMucSeri",
                columns: table => new
                {
                    MaSeri = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    MaThietBi = table.Column<int>(type: "int", nullable: true),
                    MaKho = table.Column<byte>(type: "tinyint", nullable: true),
                    MaHopDong = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    TrangThai = table.Column<byte>(type: "tinyint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DanhMucSeri", x => x.MaSeri);
                    table.ForeignKey(
                        name: "FK_DanhMucSeri_HopDong_MaHopDong",
                        column: x => x.MaHopDong,
                        principalTable: "HopDong",
                        principalColumn: "MaHopDong");
                    table.ForeignKey(
                        name: "FK_DanhMucSeri_Kho_MaKho",
                        column: x => x.MaKho,
                        principalTable: "Kho",
                        principalColumn: "MaKho");
                    table.ForeignKey(
                        name: "FK_DanhMucSeri_ThietBi_MaThietBi",
                        column: x => x.MaThietBi,
                        principalTable: "ThietBi",
                        principalColumn: "MaThietBi");
                });

            migrationBuilder.CreateTable(
                name: "HoaDon",
                columns: table => new
                {
                    MaHoaDon = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    MaHopDong = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    NgayXuat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ThueSuat = table.Column<byte>(type: "tinyint", nullable: false),
                    TongTienSauThue = table.Column<decimal>(type: "decimal(15,2)", precision: 15, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HoaDon", x => x.MaHoaDon);
                    table.ForeignKey(
                        name: "FK_HoaDon_HopDong_MaHopDong",
                        column: x => x.MaHopDong,
                        principalTable: "HopDong",
                        principalColumn: "MaHopDong");
                });

            migrationBuilder.CreateTable(
                name: "KeHoachCongNo",
                columns: table => new
                {
                    MaKeHoach = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaHopDong = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    LoaiCongNo = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    SoTienDuKien = table.Column<decimal>(type: "decimal(15,2)", precision: 15, scale: 2, nullable: false),
                    HanThanhToan = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TrangThai = table.Column<byte>(type: "tinyint", nullable: false),
                    GhiChu = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KeHoachCongNo", x => x.MaKeHoach);
                    table.ForeignKey(
                        name: "FK_KeHoachCongNo_HopDong_MaHopDong",
                        column: x => x.MaHopDong,
                        principalTable: "HopDong",
                        principalColumn: "MaHopDong");
                });

            migrationBuilder.CreateTable(
                name: "PhieuThu",
                columns: table => new
                {
                    MaPhieuThu = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SoPhieu = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    NgayThu = table.Column<DateTime>(type: "datetime2", nullable: false),
                    MaKH = table.Column<int>(type: "int", nullable: true),
                    MaHopDong = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    SoTien = table.Column<decimal>(type: "decimal(15,2)", precision: 15, scale: 2, nullable: false),
                    HinhThucThanhToan = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    MaTaiKhoan = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhieuThu", x => x.MaPhieuThu);
                    table.ForeignKey(
                        name: "FK_PhieuThu_HopDong_MaHopDong",
                        column: x => x.MaHopDong,
                        principalTable: "HopDong",
                        principalColumn: "MaHopDong");
                    table.ForeignKey(
                        name: "FK_PhieuThu_KhachHang_MaKH",
                        column: x => x.MaKH,
                        principalTable: "KhachHang",
                        principalColumn: "MaKH");
                    table.ForeignKey(
                        name: "FK_PhieuThu_TaiKhoan_MaTaiKhoan",
                        column: x => x.MaTaiKhoan,
                        principalTable: "TaiKhoan",
                        principalColumn: "MaTaiKhoan");
                });

            migrationBuilder.CreateTable(
                name: "PhieuXuatKho",
                columns: table => new
                {
                    MaPhieuXuat = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NgayXuat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    MaHopDong = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    MaKho = table.Column<byte>(type: "tinyint", nullable: true),
                    MaTaiKhoan = table.Column<int>(type: "int", nullable: true),
                    LyDoXuat = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhieuXuatKho", x => x.MaPhieuXuat);
                    table.ForeignKey(
                        name: "FK_PhieuXuatKho_HopDong_MaHopDong",
                        column: x => x.MaHopDong,
                        principalTable: "HopDong",
                        principalColumn: "MaHopDong");
                    table.ForeignKey(
                        name: "FK_PhieuXuatKho_Kho_MaKho",
                        column: x => x.MaKho,
                        principalTable: "Kho",
                        principalColumn: "MaKho");
                    table.ForeignKey(
                        name: "FK_PhieuXuatKho_TaiKhoan_MaTaiKhoan",
                        column: x => x.MaTaiKhoan,
                        principalTable: "TaiKhoan",
                        principalColumn: "MaTaiKhoan");
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietDonHang_MaThietBi",
                table: "ChiTietDonHang",
                column: "MaThietBi");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietNhapKho_MaThietBi",
                table: "ChiTietNhapKho",
                column: "MaThietBi");

            migrationBuilder.CreateIndex(
                name: "IX_DanhMucSeri_MaHopDong",
                table: "DanhMucSeri",
                column: "MaHopDong");

            migrationBuilder.CreateIndex(
                name: "IX_DanhMucSeri_MaKho",
                table: "DanhMucSeri",
                column: "MaKho");

            migrationBuilder.CreateIndex(
                name: "IX_DanhMucSeri_MaThietBi",
                table: "DanhMucSeri",
                column: "MaThietBi");

            migrationBuilder.CreateIndex(
                name: "IX_DonDatHang_MaKH",
                table: "DonDatHang",
                column: "MaKH");

            migrationBuilder.CreateIndex(
                name: "IX_DonDatHang_MaTaiKhoan",
                table: "DonDatHang",
                column: "MaTaiKhoan");

            migrationBuilder.CreateIndex(
                name: "IX_HoaDon_MaHopDong",
                table: "HoaDon",
                column: "MaHopDong");

            migrationBuilder.CreateIndex(
                name: "IX_HopDong_MaDonHang",
                table: "HopDong",
                column: "MaDonHang");

            migrationBuilder.CreateIndex(
                name: "IX_KeHoachCongNo_MaHopDong",
                table: "KeHoachCongNo",
                column: "MaHopDong");

            migrationBuilder.CreateIndex(
                name: "IX_Kho_MaChiNhanh",
                table: "Kho",
                column: "MaChiNhanh");

            migrationBuilder.CreateIndex(
                name: "IX_NhatKyHeThong_MaTaiKhoan",
                table: "NhatKyHeThong",
                column: "MaTaiKhoan");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuChi_MaNCC",
                table: "PhieuChi",
                column: "MaNCC");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuChi_MaPhieuNhap",
                table: "PhieuChi",
                column: "MaPhieuNhap");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuChi_MaTaiKhoan",
                table: "PhieuChi",
                column: "MaTaiKhoan");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuNhapKho_MaKho",
                table: "PhieuNhapKho",
                column: "MaKho");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuNhapKho_MaNCC",
                table: "PhieuNhapKho",
                column: "MaNCC");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuNhapKho_MaTaiKhoan",
                table: "PhieuNhapKho",
                column: "MaTaiKhoan");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuThu_MaHopDong",
                table: "PhieuThu",
                column: "MaHopDong");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuThu_MaKH",
                table: "PhieuThu",
                column: "MaKH");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuThu_MaTaiKhoan",
                table: "PhieuThu",
                column: "MaTaiKhoan");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuXuatKho_MaHopDong",
                table: "PhieuXuatKho",
                column: "MaHopDong");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuXuatKho_MaKho",
                table: "PhieuXuatKho",
                column: "MaKho");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuXuatKho_MaTaiKhoan",
                table: "PhieuXuatKho",
                column: "MaTaiKhoan");

            migrationBuilder.CreateIndex(
                name: "IX_TaiKhoan_MaChiNhanh",
                table: "TaiKhoan",
                column: "MaChiNhanh");

            migrationBuilder.CreateIndex(
                name: "IX_TaiKhoan_MaVaiTro",
                table: "TaiKhoan",
                column: "MaVaiTro");

            migrationBuilder.CreateIndex(
                name: "IX_ThanhLyHangHoa_MaKho",
                table: "ThanhLyHangHoa",
                column: "MaKho");

            migrationBuilder.CreateIndex(
                name: "IX_ThanhLyHangHoa_MaTaiKhoan",
                table: "ThanhLyHangHoa",
                column: "MaTaiKhoan");

            migrationBuilder.CreateIndex(
                name: "IX_ThanhLyHangHoa_MaThietBi",
                table: "ThanhLyHangHoa",
                column: "MaThietBi");

            migrationBuilder.CreateIndex(
                name: "IX_ThietBi_MaDVT",
                table: "ThietBi",
                column: "MaDVT");

            migrationBuilder.CreateIndex(
                name: "IX_ThietBi_MaLoai",
                table: "ThietBi",
                column: "MaLoai");

            migrationBuilder.CreateIndex(
                name: "IX_TonKhoChiTiet_MaThietBi",
                table: "TonKhoChiTiet",
                column: "MaThietBi");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChiTietDonHang");

            migrationBuilder.DropTable(
                name: "ChiTietNhapKho");

            migrationBuilder.DropTable(
                name: "DanhMucSeri");

            migrationBuilder.DropTable(
                name: "HoaDon");

            migrationBuilder.DropTable(
                name: "KeHoachCongNo");

            migrationBuilder.DropTable(
                name: "NhatKyHeThong");

            migrationBuilder.DropTable(
                name: "PhieuChi");

            migrationBuilder.DropTable(
                name: "PhieuThu");

            migrationBuilder.DropTable(
                name: "PhieuXuatKho");

            migrationBuilder.DropTable(
                name: "ThanhLyHangHoa");

            migrationBuilder.DropTable(
                name: "TonKhoChiTiet");

            migrationBuilder.DropTable(
                name: "YeuCauHoTro");

            migrationBuilder.DropTable(
                name: "PhieuNhapKho");

            migrationBuilder.DropTable(
                name: "HopDong");

            migrationBuilder.DropTable(
                name: "ThietBi");

            migrationBuilder.DropTable(
                name: "Kho");

            migrationBuilder.DropTable(
                name: "NhaCungCap");

            migrationBuilder.DropTable(
                name: "DonDatHang");

            migrationBuilder.DropTable(
                name: "DonViTinh");

            migrationBuilder.DropTable(
                name: "LoaiThietBi");

            migrationBuilder.DropTable(
                name: "KhachHang");

            migrationBuilder.DropTable(
                name: "TaiKhoan");

            migrationBuilder.DropTable(
                name: "ChiNhanh");

            migrationBuilder.DropTable(
                name: "VaiTro");

            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ColorCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Department = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsApproved = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    Brand = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CertificationsJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ImagesJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDiscontinued = table.Column<bool>(type: "bit", nullable: false),
                    LowStockThreshold = table.Column<int>(type: "int", nullable: false),
                    Model = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Origin = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Rating = table.Column<double>(type: "float", nullable: false),
                    ReviewCount = table.Column<int>(type: "int", nullable: false),
                    ShortDescription = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SpecsJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StockQuantity = table.Column<int>(type: "int", nullable: false),
                    Warranty = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Products_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuoteRequests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    AcceptedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AdminReply = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RejectedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RejectionReason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TotalQuotedPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuoteRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuoteRequests_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProductReviews",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Comment = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductReviews", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductReviews_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProductReviews_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CustomerId = table.Column<int>(type: "int", nullable: false),
                    QuoteRequestId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedByUserId = table.Column<int>(type: "int", nullable: false),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OrderCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentMethod = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Orders_QuoteRequests_QuoteRequestId",
                        column: x => x.QuoteRequestId,
                        principalTable: "QuoteRequests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Orders_Users_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "QuoteRequestItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    QuoteRequestId = table.Column<int>(type: "int", nullable: false),
                    ProductName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    ReferencePrice = table.Column<decimal>(type: "decimal(18,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuoteRequestItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuoteRequestItems_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuoteRequestItems_QuoteRequests_QuoteRequestId",
                        column: x => x.QuoteRequestId,
                        principalTable: "QuoteRequests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Contracts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderId = table.Column<int>(type: "int", nullable: false),
                    AdditionalTerms = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ApprovedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ApprovedByUserId = table.Column<int>(type: "int", nullable: true),
                    ContractDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ContractNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DeliveryTerms = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DiscountPercent = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    PartyAAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PartyABank = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PartyABankAccount = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PartyAFax = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PartyAName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PartyAPhone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PartyAPosition = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PartyARepresentative = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PartyATaxCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PartyBAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PartyBBank = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PartyBBankAccount = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PartyBFax = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PartyBName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PartyBPhone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PartyBPosition = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PartyBRepresentative = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PartyBTaxCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PaymentTerms = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RejectionReason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SignedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Subject = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TotalAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    WarrantyTerms = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Contracts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Contracts_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DeliveryOrders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderId = table.Column<int>(type: "int", nullable: false),
                    WarehouseStaffId = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DeliveredAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeliveryAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeliveryCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReceiverName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReceiverPhone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeliveryOrders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DeliveryOrders_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DeliveryOrders_Users_WarehouseStaffId",
                        column: x => x.WarehouseStaffId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Invoices",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderId = table.Column<int>(type: "int", nullable: false),
                    AmountInWords = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BankAccount = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BuyerAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BuyerCompany = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BuyerName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BuyerTaxCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Department = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    InvoiceDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    InvoiceNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IssuedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PaymentMethod = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RecipientName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SubTotal = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    VatAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    VatRate = table.Column<decimal>(type: "decimal(5,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Invoices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Invoices_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "OrderItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderId = table.Column<int>(type: "int", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    InstallLocation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProductName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    SerialNumbersJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TotalPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Unit = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UnitPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderItems_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderItems_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PaymentSchedules",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderId = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PaidAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Percentage = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    PhaseName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhaseOrder = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaymentSchedules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PaymentSchedules_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WarrantyRecords",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderItemId = table.Column<int>(type: "int", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CustomerName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CustomerPhone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    InstallLocation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SerialNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    WarrantyEndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    WarrantyStartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    WarrantyTerms = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WarrantyRecords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WarrantyRecords_OrderItems_OrderItemId",
                        column: x => x.OrderItemId,
                        principalTable: "OrderItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WarrantyRecords_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Contracts_OrderId",
                table: "Contracts",
                column: "OrderId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DeliveryOrders_OrderId",
                table: "DeliveryOrders",
                column: "OrderId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DeliveryOrders_WarehouseStaffId",
                table: "DeliveryOrders",
                column: "WarehouseStaffId");

            migrationBuilder.CreateIndex(
                name: "IX_Invoices_OrderId",
                table: "Invoices",
                column: "OrderId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_OrderId",
                table: "OrderItems",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_ProductId",
                table: "OrderItems",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_CustomerId",
                table: "Orders",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_QuoteRequestId",
                table: "Orders",
                column: "QuoteRequestId");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentSchedules_OrderId",
                table: "PaymentSchedules",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductReviews_ProductId_UserId",
                table: "ProductReviews",
                columns: new[] { "ProductId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProductReviews_UserId",
                table: "ProductReviews",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_CategoryId",
                table: "Products",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_QuoteRequestItems_ProductId",
                table: "QuoteRequestItems",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_QuoteRequestItems_QuoteRequestId",
                table: "QuoteRequestItems",
                column: "QuoteRequestId");

            migrationBuilder.CreateIndex(
                name: "IX_QuoteRequests_UserId",
                table: "QuoteRequests",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_WarrantyRecords_OrderItemId",
                table: "WarrantyRecords",
                column: "OrderItemId");

            migrationBuilder.CreateIndex(
                name: "IX_WarrantyRecords_ProductId",
                table: "WarrantyRecords",
                column: "ProductId");
        }
    }
}
