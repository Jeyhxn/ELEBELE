using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SocialMediaForGamersApp.Migrations
{
    /// <inheritdoc />
    public partial class AddCommunitiesAndUpdatePosts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Posts_Games_GameId",
                table: "Posts");

            migrationBuilder.DropIndex(
                name: "IX_Posts_GameId",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "GameId",
                table: "Posts");

            migrationBuilder.AddColumn<int>(
                name: "CommunityId",
                table: "Posts",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Communities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IconURL = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedByUserId = table.Column<int>(type: "int", nullable: false),
                    GameId = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Communities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Communities_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Communities_Users_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "CommunityMembers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CommunityId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CommunityMembers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CommunityMembers_Communities_CommunityId",
                        column: x => x.CommunityId,
                        principalTable: "Communities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CommunityMembers_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Posts_CommunityId",
                table: "Posts",
                column: "CommunityId");

            migrationBuilder.CreateIndex(
                name: "IX_Communities_CreatedByUserId",
                table: "Communities",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Communities_GameId",
                table: "Communities",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_CommunityMembers_CommunityId_UserId",
                table: "CommunityMembers",
                columns: new[] { "CommunityId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CommunityMembers_UserId",
                table: "CommunityMembers",
                column: "UserId");

            // Seed a "General" community and assign all existing posts to it
            migrationBuilder.Sql(@"
                DECLARE @firstUserId INT = (SELECT TOP 1 Id FROM Users WHERE IsDeleted = 0 ORDER BY Id);
                IF @firstUserId IS NOT NULL
                BEGIN
                    INSERT INTO Communities (Name, Description, CreatedByUserId, IsDeleted, CreatedAt)
                    VALUES ('General', 'General discussion', @firstUserId, 0, GETUTCDATE());

                    DECLARE @generalId INT = SCOPE_IDENTITY();
                    UPDATE Posts SET CommunityId = @generalId WHERE CommunityId = 0;
                END
            ");

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_Communities_CommunityId",
                table: "Posts",
                column: "CommunityId",
                principalTable: "Communities",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Posts_Communities_CommunityId",
                table: "Posts");

            migrationBuilder.DropTable(
                name: "CommunityMembers");

            migrationBuilder.DropTable(
                name: "Communities");

            migrationBuilder.DropIndex(
                name: "IX_Posts_CommunityId",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "CommunityId",
                table: "Posts");

            migrationBuilder.AddColumn<int>(
                name: "GameId",
                table: "Posts",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Posts_GameId",
                table: "Posts",
                column: "GameId");

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_Games_GameId",
                table: "Posts",
                column: "GameId",
                principalTable: "Games",
                principalColumn: "Id");
        }
    }
}
