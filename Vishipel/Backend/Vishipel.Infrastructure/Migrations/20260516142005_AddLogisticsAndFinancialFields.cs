using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vishipel.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddLogisticsAndFinancialFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AssigneeId",
                table: "DonDatHang",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BillingInfo",
                table: "DonDatHang",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "Deadline",
                table: "DonDatHang",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ExpectedDeliveryDate",
                table: "DonDatHang",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDepositPaid",
                table: "DonDatHang",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "ReceiverName",
                table: "DonDatHang",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReceiverPhone",
                table: "DonDatHang",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ShippingAddress",
                table: "DonDatHang",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "ShippingCost",
                table: "DonDatHang",
                type: "decimal(15,2)",
                precision: 15,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ShippingMethod",
                table: "DonDatHang",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TechnicalNotes",
                table: "DonDatHang",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<byte>(
                name: "WarehouseId",
                table: "DonDatHang",
                type: "tinyint",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WarrantyTerms",
                table: "DonDatHang",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_DonDatHang_AssigneeId",
                table: "DonDatHang",
                column: "AssigneeId");

            migrationBuilder.CreateIndex(
                name: "IX_DonDatHang_WarehouseId",
                table: "DonDatHang",
                column: "WarehouseId");

            migrationBuilder.AddForeignKey(
                name: "FK_DonDatHang_Kho_WarehouseId",
                table: "DonDatHang",
                column: "WarehouseId",
                principalTable: "Kho",
                principalColumn: "MaKho");

            migrationBuilder.AddForeignKey(
                name: "FK_DonDatHang_TaiKhoan_AssigneeId",
                table: "DonDatHang",
                column: "AssigneeId",
                principalTable: "TaiKhoan",
                principalColumn: "MaTaiKhoan");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DonDatHang_Kho_WarehouseId",
                table: "DonDatHang");

            migrationBuilder.DropForeignKey(
                name: "FK_DonDatHang_TaiKhoan_AssigneeId",
                table: "DonDatHang");

            migrationBuilder.DropIndex(
                name: "IX_DonDatHang_AssigneeId",
                table: "DonDatHang");

            migrationBuilder.DropIndex(
                name: "IX_DonDatHang_WarehouseId",
                table: "DonDatHang");

            migrationBuilder.DropColumn(
                name: "AssigneeId",
                table: "DonDatHang");

            migrationBuilder.DropColumn(
                name: "BillingInfo",
                table: "DonDatHang");

            migrationBuilder.DropColumn(
                name: "Deadline",
                table: "DonDatHang");

            migrationBuilder.DropColumn(
                name: "ExpectedDeliveryDate",
                table: "DonDatHang");

            migrationBuilder.DropColumn(
                name: "IsDepositPaid",
                table: "DonDatHang");

            migrationBuilder.DropColumn(
                name: "ReceiverName",
                table: "DonDatHang");

            migrationBuilder.DropColumn(
                name: "ReceiverPhone",
                table: "DonDatHang");

            migrationBuilder.DropColumn(
                name: "ShippingAddress",
                table: "DonDatHang");

            migrationBuilder.DropColumn(
                name: "ShippingCost",
                table: "DonDatHang");

            migrationBuilder.DropColumn(
                name: "ShippingMethod",
                table: "DonDatHang");

            migrationBuilder.DropColumn(
                name: "TechnicalNotes",
                table: "DonDatHang");

            migrationBuilder.DropColumn(
                name: "WarehouseId",
                table: "DonDatHang");

            migrationBuilder.DropColumn(
                name: "WarrantyTerms",
                table: "DonDatHang");
        }
    }
}
