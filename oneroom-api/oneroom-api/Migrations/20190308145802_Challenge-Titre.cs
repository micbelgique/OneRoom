using Microsoft.EntityFrameworkCore.Migrations;

namespace oneroom_api.Migrations
{
    public partial class ChallengeTitre : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Titre",
                table: "Challenges",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Titre",
                table: "Challenges");
        }
    }
}
