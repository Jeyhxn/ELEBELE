using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SocialMediaForGamersApp.Migrations
{
    /// <inheritdoc />
    public partial class AddPostViewUniqueIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Remove duplicate views keeping only the most recent per user+post
            migrationBuilder.Sql(@"
WITH cte AS (
    SELECT Id, ROW_NUMBER() OVER (PARTITION BY UserId, PostId ORDER BY ViewedAt DESC) AS rn
    FROM PostViews
)
DELETE FROM cte WHERE rn > 1;
");

            migrationBuilder.DropIndex(
                name: "IX_PostViews_UserId",
                table: "PostViews");

            migrationBuilder.CreateIndex(
                name: "IX_PostViews_UserId_PostId",
                table: "PostViews",
                columns: new[] { "UserId", "PostId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_PostViews_UserId_PostId",
                table: "PostViews");

            migrationBuilder.CreateIndex(
                name: "IX_PostViews_UserId",
                table: "PostViews",
                column: "UserId");
        }
    }
}
