using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vishipel.Infrastructure.Migrations
{
    public partial class AddUserTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1. ÐÃ COMMENT B?NG CATEGORIES (VÌ ÐÃ CÓ TRONG SQL)
            /*
            migrationBuilder.CreateTable(
                name: "Categories",
                ...
            */

            // 2. CH? GI? L?I L?NH T?O B?NG USERS NÀY:
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Department = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsApproved = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            // 3. ÐÃ COMMENT B?NG PRODUCTS VÀ INDEX (VÌ ÐÃ CÓ TRONG SQL)
            /*
            migrationBuilder.CreateTable(
                name: "Products",
                ...
            migrationBuilder.CreateIndex(
                name: "IX_Products_CategoryId",
                ...
            */
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Tuong t?, khi undo (down) thì ch? r?t b?ng Users
            migrationBuilder.DropTable(name: "Users");

            // migrationBuilder.DropTable(name: "Products");
            // migrationBuilder.DropTable(name: "Categories");
        }
    }
}
