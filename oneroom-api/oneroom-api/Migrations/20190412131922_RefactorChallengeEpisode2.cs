using Microsoft.EntityFrameworkCore.Migrations;

namespace oneroom_api.Migrations
{
    public partial class RefactorChallengeEpisode2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ToolName",
                table: "Challenges",
                newName: "Description");

            migrationBuilder.AddColumn<string>(
                name: "Answers",
                table: "Challenges",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Hints",
                table: "Challenges",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "Challenges",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TimeBox",
                table: "Challenges",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Answers",
                table: "Challenges");

            migrationBuilder.DropColumn(
                name: "Hints",
                table: "Challenges");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "Challenges");

            migrationBuilder.DropColumn(
                name: "TimeBox",
                table: "Challenges");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Challenges",
                newName: "ToolName");
        }
    }
}
