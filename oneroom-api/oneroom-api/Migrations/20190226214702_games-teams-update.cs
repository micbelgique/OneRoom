using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace oneroom_api.Migrations
{
    public partial class gamesteamsupdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Client");

            migrationBuilder.AddColumn<string>(
                name: "TeamColor",
                table: "Teams",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TeamName",
                table: "Teams",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ConfigId",
                table: "Games",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Configuration",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    FaceEndpoint = table.Column<string>(nullable: false),
                    FaceKey = table.Column<string>(nullable: false),
                    VisionEndpoint = table.Column<string>(nullable: false),
                    VisionKey = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Configuration", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Games_ConfigId",
                table: "Games",
                column: "ConfigId");

            migrationBuilder.AddForeignKey(
                name: "FK_Games_Configuration_ConfigId",
                table: "Games",
                column: "ConfigId",
                principalTable: "Configuration",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Games_Configuration_ConfigId",
                table: "Games");

            migrationBuilder.DropTable(
                name: "Configuration");

            migrationBuilder.DropIndex(
                name: "IX_Games_ConfigId",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "TeamColor",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "TeamName",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "ConfigId",
                table: "Games");

            migrationBuilder.CreateTable(
                name: "Client",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Group = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    Type = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Client", x => x.Id);
                });
        }
    }
}
