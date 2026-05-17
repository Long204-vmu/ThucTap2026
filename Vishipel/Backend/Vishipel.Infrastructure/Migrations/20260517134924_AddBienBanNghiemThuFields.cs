using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vishipel.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddBienBanNghiemThuFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ChucVuBenA",
                table: "BienBanNghiemThu",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ChucVuBenB",
                table: "BienBanNghiemThu",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DaiDienBenA",
                table: "BienBanNghiemThu",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DaiDienBenB",
                table: "BienBanNghiemThu",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DiaDiem",
                table: "BienBanNghiemThu",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NoiDungDichVu",
                table: "BienBanNghiemThu",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ThoiGianBatDau",
                table: "BienBanNghiemThu",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ThoiGianKetThuc",
                table: "BienBanNghiemThu",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ChucVuBenA",
                table: "BienBanNghiemThu");

            migrationBuilder.DropColumn(
                name: "ChucVuBenB",
                table: "BienBanNghiemThu");

            migrationBuilder.DropColumn(
                name: "DaiDienBenA",
                table: "BienBanNghiemThu");

            migrationBuilder.DropColumn(
                name: "DaiDienBenB",
                table: "BienBanNghiemThu");

            migrationBuilder.DropColumn(
                name: "DiaDiem",
                table: "BienBanNghiemThu");

            migrationBuilder.DropColumn(
                name: "NoiDungDichVu",
                table: "BienBanNghiemThu");

            migrationBuilder.DropColumn(
                name: "ThoiGianBatDau",
                table: "BienBanNghiemThu");

            migrationBuilder.DropColumn(
                name: "ThoiGianKetThuc",
                table: "BienBanNghiemThu");
        }
    }
}
