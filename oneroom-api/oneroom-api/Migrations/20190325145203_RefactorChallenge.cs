using Microsoft.EntityFrameworkCore.Migrations;

namespace oneroom_api.Migrations
{
    public partial class RefactorChallenge : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "URLDocumentation",
                table: "Challenges",
                newName: "ToolName");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Challenges",
                newName: "Config");

            migrationBuilder.AddColumn<string>(
                name: "AppName",
                table: "Challenges",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AppName",
                table: "Challenges");

            migrationBuilder.RenameColumn(
                name: "ToolName",
                table: "Challenges",
                newName: "URLDocumentation");

            migrationBuilder.RenameColumn(
                name: "Config",
                table: "Challenges",
                newName: "Description");
        }
    }
}
