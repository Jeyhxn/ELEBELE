using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SocialMediaForGamersApp.Migrations
{
    /// <inheritdoc />
    public partial class AddUserDeleteTrigger : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Users_UserId",
                table: "Comments");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Users_UserId",
                table: "Comments",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.Sql(@"
CREATE OR ALTER TRIGGER trg_Users_InsteadOfDelete
ON [Users]
INSTEAD OF DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- Delete notifications
    DELETE FROM [Notifications] WHERE [UserId] IN (SELECT [Id] FROM deleted);

    -- Delete post votes
    DELETE FROM [PostVotes] WHERE [UserId] IN (SELECT [Id] FROM deleted);
    DELETE FROM [PostVotes] WHERE [PostId] IN (SELECT [Id] FROM [Posts] WHERE [UserId] IN (SELECT [Id] FROM deleted));

    -- Delete post comments
    DELETE FROM [PostComments] WHERE [UserId] IN (SELECT [Id] FROM deleted);
    DELETE FROM [PostComments] WHERE [PostId] IN (SELECT [Id] FROM [Posts] WHERE [UserId] IN (SELECT [Id] FROM deleted));

    -- Delete posts
    DELETE FROM [Posts] WHERE [UserId] IN (SELECT [Id] FROM deleted);

    -- Delete game comments
    DELETE FROM [Comments] WHERE [UserId] IN (SELECT [Id] FROM deleted);

    -- Delete community memberships
    DELETE FROM [CommunityMembers] WHERE [UserId] IN (SELECT [Id] FROM deleted);

    -- Delete communities created by user
    DELETE FROM [CommunityMembers] WHERE [CommunityId] IN (SELECT [Id] FROM [Communities] WHERE [CreatedByUserId] IN (SELECT [Id] FROM deleted));
    DELETE FROM [Communities] WHERE [CreatedByUserId] IN (SELECT [Id] FROM deleted);

    -- Finally delete the user rows
    DELETE FROM [Users] WHERE [Id] IN (SELECT [Id] FROM deleted);
END;
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP TRIGGER IF EXISTS trg_Users_InsteadOfDelete;");

            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Users_UserId",
                table: "Comments");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Users_UserId",
                table: "Comments",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
