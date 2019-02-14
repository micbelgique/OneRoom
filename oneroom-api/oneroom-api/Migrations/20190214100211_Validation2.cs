using Microsoft.EntityFrameworkCore.Migrations;

namespace oneroom_api.Migrations
{
    public partial class Validation2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Face_Users_UserId",
                table: "Face");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Face",
                table: "Face");

            migrationBuilder.RenameTable(
                name: "Face",
                newName: "Faces");

            migrationBuilder.RenameIndex(
                name: "IX_Face_UserId",
                table: "Faces",
                newName: "IX_Faces_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Faces",
                table: "Faces",
                column: "FaceId");

            migrationBuilder.AddForeignKey(
                name: "FK_Faces_Users_UserId",
                table: "Faces",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Faces_Users_UserId",
                table: "Faces");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Faces",
                table: "Faces");

            migrationBuilder.RenameTable(
                name: "Faces",
                newName: "Face");

            migrationBuilder.RenameIndex(
                name: "IX_Faces_UserId",
                table: "Face",
                newName: "IX_Face_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Face",
                table: "Face",
                column: "FaceId");

            migrationBuilder.AddForeignKey(
                name: "FK_Face_Users_UserId",
                table: "Face",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
