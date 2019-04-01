using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace oneroom_api.Migrations
{
    public partial class Scenario : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GameChallenge");

            migrationBuilder.AddColumn<int>(
                name: "ScenarioId",
                table: "Games",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Scenarios",
                columns: table => new
                {
                    ScenarioId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Title = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Scenarios", x => x.ScenarioId);
                });

            migrationBuilder.CreateTable(
                name: "ScenarioChallenge",
                columns: table => new
                {
                    ScenarioId = table.Column<int>(nullable: false),
                    ChallengeId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScenarioChallenge", x => new { x.ScenarioId, x.ChallengeId });
                    table.ForeignKey(
                        name: "FK_ScenarioChallenge_Challenges_ChallengeId",
                        column: x => x.ChallengeId,
                        principalTable: "Challenges",
                        principalColumn: "ChallengeId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ScenarioChallenge_Scenarios_ScenarioId",
                        column: x => x.ScenarioId,
                        principalTable: "Scenarios",
                        principalColumn: "ScenarioId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Games_ScenarioId",
                table: "Games",
                column: "ScenarioId");

            migrationBuilder.CreateIndex(
                name: "IX_ScenarioChallenge_ChallengeId",
                table: "ScenarioChallenge",
                column: "ChallengeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Games_Scenarios_ScenarioId",
                table: "Games",
                column: "ScenarioId",
                principalTable: "Scenarios",
                principalColumn: "ScenarioId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Games_Scenarios_ScenarioId",
                table: "Games");

            migrationBuilder.DropTable(
                name: "ScenarioChallenge");

            migrationBuilder.DropTable(
                name: "Scenarios");

            migrationBuilder.DropIndex(
                name: "IX_Games_ScenarioId",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "ScenarioId",
                table: "Games");

            migrationBuilder.CreateTable(
                name: "GameChallenge",
                columns: table => new
                {
                    GameId = table.Column<int>(nullable: false),
                    ChallengeId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameChallenge", x => new { x.GameId, x.ChallengeId });
                    table.ForeignKey(
                        name: "FK_GameChallenge_Challenges_ChallengeId",
                        column: x => x.ChallengeId,
                        principalTable: "Challenges",
                        principalColumn: "ChallengeId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GameChallenge_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "GameId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GameChallenge_ChallengeId",
                table: "GameChallenge",
                column: "ChallengeId");
        }
    }
}
