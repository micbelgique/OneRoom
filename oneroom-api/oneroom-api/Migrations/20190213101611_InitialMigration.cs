using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace oneroom_api.Migrations
{
    public partial class InitialMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    PersonId = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    Username = table.Column<string>(nullable: true),
                    UrlAvatar = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "Face",
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
                    HairColor = table.Column<string>(nullable: true),
                    UserId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Face", x => x.FaceId);
                    table.ForeignKey(
                        name: "FK_Face_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Face_UserId",
                table: "Face",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Face");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
