using Microsoft.EntityFrameworkCore.Migrations;

namespace oneroom_api.Migrations
{
    public partial class UniqueIdAndCascadeDelete : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Faces_Users_UserId",
                table: "Faces");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Group_GroupId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_UserId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Group_GroupId",
                table: "Group");

            migrationBuilder.DropIndex(
                name: "IX_Faces_FaceId",
                table: "Faces");

            migrationBuilder.CreateIndex(
                name: "IX_Users_UserId",
                table: "Users",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Group_GroupId",
                table: "Group",
                column: "GroupId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Faces_FaceId",
                table: "Faces",
                column: "FaceId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Faces_Users_UserId",
                table: "Faces",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Group_GroupId",
                table: "Users",
                column: "GroupId",
                principalTable: "Group",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Faces_Users_UserId",
                table: "Faces");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Group_GroupId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_UserId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Group_GroupId",
                table: "Group");

            migrationBuilder.DropIndex(
                name: "IX_Faces_FaceId",
                table: "Faces");

            migrationBuilder.CreateIndex(
                name: "IX_Users_UserId",
                table: "Users",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Group_GroupId",
                table: "Group",
                column: "GroupId");

            migrationBuilder.CreateIndex(
                name: "IX_Faces_FaceId",
                table: "Faces",
                column: "FaceId");

            migrationBuilder.AddForeignKey(
                name: "FK_Faces_Users_UserId",
                table: "Faces",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Group_GroupId",
                table: "Users",
                column: "GroupId",
                principalTable: "Group",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
