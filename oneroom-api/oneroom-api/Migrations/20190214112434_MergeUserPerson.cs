using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace oneroom_api.Migrations
{
    public partial class MergeUserPerson : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    UrlAvatar = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "Faces",
                columns: table => new
                {
                    FaceId = table.Column<Guid>(nullable: false),
                    Age = table.Column<double>(nullable: false),
                    IsMale = table.Column<bool>(nullable: false),
                    SmileLevel = table.Column<double>(nullable: false),
                    MoustacheLevel = table.Column<double>(nullable: false),
                    BeardLevel = table.Column<double>(nullable: false),
                    GlassesType = table.Column<int>(nullable: false),
                    BaldLevel = table.Column<double>(nullable: false),
                    HairColor = table.Column<string>(nullable: false),
                    UserId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Faces", x => x.FaceId);
                    table.ForeignKey(
                        name: "FK_Faces_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Faces_UserId",
                table: "Faces",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Faces");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
