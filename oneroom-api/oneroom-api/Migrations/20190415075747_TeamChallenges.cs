using Microsoft.EntityFrameworkCore.Migrations;

namespace oneroom_api.Migrations
{
    public partial class TeamChallenges : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TeamChallenge",
                columns: table => new
                {
                    TeamId = table.Column<int>(nullable: false),
                    ChallengeId = table.Column<int>(nullable: false),
                    Completed = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeamChallenge", x => new { x.TeamId, x.ChallengeId });
                    table.ForeignKey(
                        name: "FK_TeamChallenge_Challenges_ChallengeId",
                        column: x => x.ChallengeId,
                        principalTable: "Challenges",
                        principalColumn: "ChallengeId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TeamChallenge_Teams_TeamId",
                        column: x => x.TeamId,
                        principalTable: "Teams",
                        principalColumn: "TeamId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TeamChallenge_ChallengeId",
                table: "TeamChallenge",
                column: "ChallengeId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TeamChallenge");
        }
    }
}
