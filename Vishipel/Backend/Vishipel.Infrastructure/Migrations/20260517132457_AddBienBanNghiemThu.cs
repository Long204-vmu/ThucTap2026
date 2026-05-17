using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vishipel.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddBienBanNghiemThu : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BienBanNghiemThu",
                columns: table => new
                {
                    MaBienBan = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaDonHang = table.Column<int>(type: "int", nullable: false),
                    NgayLap = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NguoiLapId = table.Column<int>(type: "int", nullable: true),
                    GhiChuKiemTra = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    DanhGiaChung = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    CustomerConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    NgayXacNhan = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BienBanNghiemThu", x => x.MaBienBan);
                    table.ForeignKey(
                        name: "FK_BienBanNghiemThu_DonDatHang_MaDonHang",
                        column: x => x.MaDonHang,
                        principalTable: "DonDatHang",
                        principalColumn: "MaDonHang",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BienBanNghiemThu_TaiKhoan_NguoiLapId",
                        column: x => x.NguoiLapId,
                        principalTable: "TaiKhoan",
                        principalColumn: "MaTaiKhoan");
                });

            migrationBuilder.CreateIndex(
                name: "IX_BienBanNghiemThu_MaDonHang",
                table: "BienBanNghiemThu",
                column: "MaDonHang");

            migrationBuilder.CreateIndex(
                name: "IX_BienBanNghiemThu_NguoiLapId",
                table: "BienBanNghiemThu",
                column: "NguoiLapId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BienBanNghiemThu");
        }
    }
}
