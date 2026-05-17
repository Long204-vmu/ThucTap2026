using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vishipel.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddMoTaToLoaiThietBi : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MoTa",
                table: "LoaiThietBi",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MoTa",
                table: "LoaiThietBi");
        }
    }
}
