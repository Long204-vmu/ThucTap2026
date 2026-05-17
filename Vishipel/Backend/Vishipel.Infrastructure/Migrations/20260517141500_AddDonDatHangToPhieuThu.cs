using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vishipel.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDonDatHangToPhieuThu : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsPaid",
                table: "PhieuThu",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "MaDonHang",
                table: "PhieuThu",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_PhieuThu_MaDonHang",
                table: "PhieuThu",
                column: "MaDonHang");

            migrationBuilder.AddForeignKey(
                name: "FK_PhieuThu_DonDatHang_MaDonHang",
                table: "PhieuThu",
                column: "MaDonHang",
                principalTable: "DonDatHang",
                principalColumn: "MaDonHang");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PhieuThu_DonDatHang_MaDonHang",
                table: "PhieuThu");

            migrationBuilder.DropIndex(
                name: "IX_PhieuThu_MaDonHang",
                table: "PhieuThu");

            migrationBuilder.DropColumn(
                name: "IsPaid",
                table: "PhieuThu");

            migrationBuilder.DropColumn(
                name: "MaDonHang",
                table: "PhieuThu");
        }
    }
}
