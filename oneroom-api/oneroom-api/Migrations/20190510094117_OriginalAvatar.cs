using Microsoft.EntityFrameworkCore.Migrations;

namespace oneroom_api.Migrations
{
    public partial class OriginalAvatar : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OriginalUrlAvatar",
                table: "Users",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OriginalUrlAvatar",
                table: "Users");
        }
    }
}
