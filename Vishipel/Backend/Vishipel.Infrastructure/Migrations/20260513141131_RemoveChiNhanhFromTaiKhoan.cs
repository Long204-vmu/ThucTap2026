using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vishipel.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveChiNhanhFromTaiKhoan : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_TaiKhoan_ChiNhanh_MaChiNhanh')
                    ALTER TABLE [TaiKhoan] DROP CONSTRAINT [FK_TaiKhoan_ChiNhanh_MaChiNhanh];
                
                IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_TaiKhoan_MaChiNhanh' AND object_id = OBJECT_ID('TaiKhoan'))
                    DROP INDEX [IX_TaiKhoan_MaChiNhanh] ON [TaiKhoan];
                
                IF EXISTS (SELECT * FROM sys.columns WHERE name = 'MaChiNhanh' AND object_id = OBJECT_ID('TaiKhoan'))
                    ALTER TABLE [TaiKhoan] DROP COLUMN [MaChiNhanh];
            ");
        }



        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte>(
                name: "MaChiNhanh",
                table: "TaiKhoan",
                type: "tinyint",
                nullable: true);


            migrationBuilder.CreateIndex(
                name: "IX_TaiKhoan_MaChiNhanh",
                table: "TaiKhoan",
                column: "MaChiNhanh");

            migrationBuilder.AddForeignKey(
                name: "FK_TaiKhoan_ChiNhanh_MaChiNhanh",
                table: "TaiKhoan",
                column: "MaChiNhanh",
                principalTable: "ChiNhanh",
                principalColumn: "MaChiNhanh");
        }
    }
}
