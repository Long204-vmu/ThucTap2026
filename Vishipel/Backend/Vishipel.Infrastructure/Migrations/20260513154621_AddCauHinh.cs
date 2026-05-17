using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vishipel.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCauHinh : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CauHinhHeThong",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenWebsite = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Slogan = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    LogoUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Hotline = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    EmailLienHe = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    DiaChi = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    BanQuyen = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    SmtpServer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SmtpPort = table.Column<int>(type: "int", nullable: true),
                    SmtpUser = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SmtpPass = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NgayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CauHinhHeThong", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CauHinhHeThong");
        }
    }
}
