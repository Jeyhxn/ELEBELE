using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SocialMediaForGamersApp.Migrations
{
    /// <inheritdoc />
    public partial class AddSettingsFeatures : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "NotifyCommentReplies",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "NotifyNewPosts",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "NotifyPostVotes",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "MutedCommunities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    CommunityId = table.Column<int>(type: "int", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MutedCommunities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MutedCommunities_Communities_CommunityId",
                        column: x => x.CommunityId,
                        principalTable: "Communities",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_MutedCommunities_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MutedCommunities_CommunityId",
                table: "MutedCommunities",
                column: "CommunityId");

            migrationBuilder.CreateIndex(
                name: "IX_MutedCommunities_UserId_CommunityId",
                table: "MutedCommunities",
                columns: new[] { "UserId", "CommunityId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MutedCommunities");

            migrationBuilder.DropColumn(
                name: "NotifyCommentReplies",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "NotifyNewPosts",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "NotifyPostVotes",
                table: "Users");
        }
    }
}
