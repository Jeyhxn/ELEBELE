using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SocialMediaForGamersApp.Migrations
{
    /// <inheritdoc />
    public partial class SeedGameCommunities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                DECLARE @adminId INT = (SELECT TOP 1 Id FROM Users WHERE IsAdmin = 1 AND IsDeleted = 0 ORDER BY Id);
                IF @adminId IS NULL
                    SET @adminId = (SELECT TOP 1 Id FROM Users WHERE IsDeleted = 0 ORDER BY Id);

                IF @adminId IS NOT NULL
                BEGIN
                    INSERT INTO Communities (Name, Description, GameId, CreatedByUserId, IsDeleted, CreatedAt)
                    SELECT
                        g.Name,
                        CONCAT('Community for ', g.Name),
                        g.Id,
                        @adminId,
                        0,
                        GETUTCDATE()
                    FROM Games g
                    WHERE g.IsDeleted = 0
                      AND NOT EXISTS (
                          SELECT 1 FROM Communities c
                          WHERE c.GameId = g.Id AND c.IsDeleted = 0
                      );
                END
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                DELETE FROM Communities WHERE GameId IS NOT NULL;
            ");
        }
    }
}
