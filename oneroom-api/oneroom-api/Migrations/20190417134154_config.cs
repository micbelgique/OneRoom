using Microsoft.EntityFrameworkCore.Migrations;

namespace oneroom_api.Migrations
{
    public partial class config : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "VisionEndpointSkinColor",
                table: "Configuration",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VisionKeySkinColor",
                table: "Configuration",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "VisionEndpointSkinColor",
                table: "Configuration");

            migrationBuilder.DropColumn(
                name: "VisionKeySkinColor",
                table: "Configuration");
        }
    }
}
