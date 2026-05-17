using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vishipel.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateBusinessWorkflow : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_HopDong_MaDonHang",
                table: "HopDong");

            migrationBuilder.DropColumn(
                name: "LoaiCongNo",
                table: "KeHoachCongNo");

            migrationBuilder.DropColumn(
                name: "TrangThai",
                table: "KeHoachCongNo");

            migrationBuilder.DropColumn(
                name: "TrangThaiHieuLuc",
                table: "HopDong");

            migrationBuilder.DropColumn(
                name: "TrangThai",
                table: "DonDatHang");

            migrationBuilder.RenameColumn(
                name: "TongTienSauThue",
                table: "HoaDon",
                newName: "TotalAmount");

            migrationBuilder.RenameColumn(
                name: "DonGiaBan",
                table: "ChiTietDonHang",
                newName: "DonGia");

            migrationBuilder.AddColumn<int>(
                name: "MaDonHang",
                table: "KeHoachCongNo",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Percentage",
                table: "KeHoachCongNo",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PhaseName",
                table: "KeHoachCongNo",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PhaseOrder",
                table: "KeHoachCongNo",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "KeHoachCongNo",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PartyAName",
                table: "HopDong",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "HopDong",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "TotalAmount",
                table: "HopDong",
                type: "decimal(15,2)",
                precision: 15,
                scale: 2,
                nullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "ThueSuat",
                table: "HoaDon",
                type: "decimal(15,2)",
                precision: 15,
                scale: 2,
                nullable: false,
                oldClrType: typeof(byte),
                oldType: "tinyint");

            migrationBuilder.AddColumn<string>(
                name: "BuyerName",
                table: "HoaDon",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaDonHang",
                table: "HoaDon",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "HoaDon",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TaxCode",
                table: "HoaDon",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Note",
                table: "DonDatHang",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OrderCode",
                table: "DonDatHang",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PaymentMethod",
                table: "DonDatHang",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "QuoteRequestId",
                table: "DonDatHang",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "DonDatHang",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "InstallLocation",
                table: "ChiTietDonHang",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SerialNumbersJson",
                table: "ChiTietDonHang",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Unit",
                table: "ChiTietDonHang",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ChiTietXuatKho",
                columns: table => new
                {
                    MaPhieuXuat = table.Column<int>(type: "int", nullable: false),
                    MaThietBi = table.Column<int>(type: "int", nullable: false),
                    SoLuong = table.Column<int>(type: "int", nullable: false),
                    DonGiaBan = table.Column<decimal>(type: "decimal(15,2)", precision: 15, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietXuatKho", x => new { x.MaPhieuXuat, x.MaThietBi });
                    table.ForeignKey(
                        name: "FK_ChiTietXuatKho_PhieuXuatKho_MaPhieuXuat",
                        column: x => x.MaPhieuXuat,
                        principalTable: "PhieuXuatKho",
                        principalColumn: "MaPhieuXuat",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChiTietXuatKho_ThietBi_MaThietBi",
                        column: x => x.MaThietBi,
                        principalTable: "ThietBi",
                        principalColumn: "MaThietBi",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuoteRequests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AdminReply = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TotalQuotedPrice = table.Column<decimal>(type: "decimal(15,2)", precision: 15, scale: 2, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuoteRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuoteRequests_TaiKhoan_UserId",
                        column: x => x.UserId,
                        principalTable: "TaiKhoan",
                        principalColumn: "MaTaiKhoan",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuoteRequestItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuoteRequestId = table.Column<int>(type: "int", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    ProductName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    ReferencePrice = table.Column<decimal>(type: "decimal(15,2)", precision: 15, scale: 2, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuoteRequestItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuoteRequestItems_QuoteRequests_QuoteRequestId",
                        column: x => x.QuoteRequestId,
                        principalTable: "QuoteRequests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_KeHoachCongNo_MaDonHang",
                table: "KeHoachCongNo",
                column: "MaDonHang");

            migrationBuilder.CreateIndex(
                name: "IX_HopDong_MaDonHang",
                table: "HopDong",
                column: "MaDonHang",
                unique: true,
                filter: "[MaDonHang] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_HoaDon_MaDonHang",
                table: "HoaDon",
                column: "MaDonHang",
                unique: true,
                filter: "[MaDonHang] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_DonDatHang_QuoteRequestId",
                table: "DonDatHang",
                column: "QuoteRequestId");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietXuatKho_MaThietBi",
                table: "ChiTietXuatKho",
                column: "MaThietBi");

            migrationBuilder.CreateIndex(
                name: "IX_QuoteRequestItems_QuoteRequestId",
                table: "QuoteRequestItems",
                column: "QuoteRequestId");

            migrationBuilder.CreateIndex(
                name: "IX_QuoteRequests_UserId",
                table: "QuoteRequests",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_DonDatHang_QuoteRequests_QuoteRequestId",
                table: "DonDatHang",
                column: "QuoteRequestId",
                principalTable: "QuoteRequests",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_HoaDon_DonDatHang_MaDonHang",
                table: "HoaDon",
                column: "MaDonHang",
                principalTable: "DonDatHang",
                principalColumn: "MaDonHang");

            migrationBuilder.AddForeignKey(
                name: "FK_KeHoachCongNo_DonDatHang_MaDonHang",
                table: "KeHoachCongNo",
                column: "MaDonHang",
                principalTable: "DonDatHang",
                principalColumn: "MaDonHang");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DonDatHang_QuoteRequests_QuoteRequestId",
                table: "DonDatHang");

            migrationBuilder.DropForeignKey(
                name: "FK_HoaDon_DonDatHang_MaDonHang",
                table: "HoaDon");

            migrationBuilder.DropForeignKey(
                name: "FK_KeHoachCongNo_DonDatHang_MaDonHang",
                table: "KeHoachCongNo");

            migrationBuilder.DropTable(
                name: "ChiTietXuatKho");

            migrationBuilder.DropTable(
                name: "QuoteRequestItems");

            migrationBuilder.DropTable(
                name: "QuoteRequests");

            migrationBuilder.DropIndex(
                name: "IX_KeHoachCongNo_MaDonHang",
                table: "KeHoachCongNo");

            migrationBuilder.DropIndex(
                name: "IX_HopDong_MaDonHang",
                table: "HopDong");

            migrationBuilder.DropIndex(
                name: "IX_HoaDon_MaDonHang",
                table: "HoaDon");

            migrationBuilder.DropIndex(
                name: "IX_DonDatHang_QuoteRequestId",
                table: "DonDatHang");

            migrationBuilder.DropColumn(
                name: "MaDonHang",
                table: "KeHoachCongNo");

            migrationBuilder.DropColumn(
                name: "Percentage",
                table: "KeHoachCongNo");

            migrationBuilder.DropColumn(
                name: "PhaseName",
                table: "KeHoachCongNo");

            migrationBuilder.DropColumn(
                name: "PhaseOrder",
                table: "KeHoachCongNo");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "KeHoachCongNo");

            migrationBuilder.DropColumn(
                name: "PartyAName",
                table: "HopDong");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "HopDong");

            migrationBuilder.DropColumn(
                name: "TotalAmount",
                table: "HopDong");

            migrationBuilder.DropColumn(
                name: "BuyerName",
                table: "HoaDon");

            migrationBuilder.DropColumn(
                name: "MaDonHang",
                table: "HoaDon");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "HoaDon");

            migrationBuilder.DropColumn(
                name: "TaxCode",
                table: "HoaDon");

            migrationBuilder.DropColumn(
                name: "Note",
                table: "DonDatHang");

            migrationBuilder.DropColumn(
                name: "OrderCode",
                table: "DonDatHang");

            migrationBuilder.DropColumn(
                name: "PaymentMethod",
                table: "DonDatHang");

            migrationBuilder.DropColumn(
                name: "QuoteRequestId",
                table: "DonDatHang");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "DonDatHang");

            migrationBuilder.DropColumn(
                name: "InstallLocation",
                table: "ChiTietDonHang");

            migrationBuilder.DropColumn(
                name: "SerialNumbersJson",
                table: "ChiTietDonHang");

            migrationBuilder.DropColumn(
                name: "Unit",
                table: "ChiTietDonHang");

            migrationBuilder.RenameColumn(
                name: "TotalAmount",
                table: "HoaDon",
                newName: "TongTienSauThue");

            migrationBuilder.RenameColumn(
                name: "DonGia",
                table: "ChiTietDonHang",
                newName: "DonGiaBan");

            migrationBuilder.AddColumn<string>(
                name: "LoaiCongNo",
                table: "KeHoachCongNo",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<byte>(
                name: "TrangThai",
                table: "KeHoachCongNo",
                type: "tinyint",
                nullable: false,
                defaultValue: (byte)0);

            migrationBuilder.AddColumn<bool>(
                name: "TrangThaiHieuLuc",
                table: "HopDong",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<byte>(
                name: "ThueSuat",
                table: "HoaDon",
                type: "tinyint",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(15,2)",
                oldPrecision: 15,
                oldScale: 2);

            migrationBuilder.AddColumn<byte>(
                name: "TrangThai",
                table: "DonDatHang",
                type: "tinyint",
                nullable: false,
                defaultValue: (byte)0);

            migrationBuilder.CreateIndex(
                name: "IX_HopDong_MaDonHang",
                table: "HopDong",
                column: "MaDonHang");
        }
    }
}
