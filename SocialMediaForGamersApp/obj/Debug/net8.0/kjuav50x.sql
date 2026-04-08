IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260213125109_CreatingDatabaseAndTables'
)
BEGIN
    CREATE TABLE [Categories] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Categories] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260213125109_CreatingDatabaseAndTables'
)
BEGIN
    CREATE TABLE [Platforms] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Platforms] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260213125109_CreatingDatabaseAndTables'
)
BEGIN
    CREATE TABLE [Games] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [ReleaseDate] datetime2 NOT NULL,
        [Developer] nvarchar(max) NOT NULL,
        [Publisher] nvarchar(max) NOT NULL,
        [Rating] float NOT NULL,
        [ImageURL] nvarchar(max) NOT NULL,
        [CategoryId] int NOT NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Games] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Games_Categories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [Categories] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260213125109_CreatingDatabaseAndTables'
)
BEGIN
    CREATE TABLE [GamePlatforms] (
        [Id] int NOT NULL IDENTITY,
        [GameId] int NOT NULL,
        [PlatformId] int NOT NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_GamePlatforms] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_GamePlatforms_Games_GameId] FOREIGN KEY ([GameId]) REFERENCES [Games] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_GamePlatforms_Platforms_PlatformId] FOREIGN KEY ([PlatformId]) REFERENCES [Platforms] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260213125109_CreatingDatabaseAndTables'
)
BEGIN
    CREATE INDEX [IX_GamePlatforms_GameId] ON [GamePlatforms] ([GameId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260213125109_CreatingDatabaseAndTables'
)
BEGIN
    CREATE INDEX [IX_GamePlatforms_PlatformId] ON [GamePlatforms] ([PlatformId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260213125109_CreatingDatabaseAndTables'
)
BEGIN
    CREATE INDEX [IX_Games_CategoryId] ON [Games] ([CategoryId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260213125109_CreatingDatabaseAndTables'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260213125109_CreatingDatabaseAndTables', N'8.0.24');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260213132324_FixingCategoryTable'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260213132324_FixingCategoryTable', N'8.0.24');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260218135637_AddUserTable'
)
BEGIN
    CREATE TABLE [Users] (
        [Id] int NOT NULL IDENTITY,
        [Username] nvarchar(max) NOT NULL,
        [Email] nvarchar(max) NOT NULL,
        [PasswordHash] nvarchar(max) NOT NULL,
        [FirstName] nvarchar(max) NOT NULL,
        [LastName] nvarchar(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260218135637_AddUserTable'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260218135637_AddUserTable', N'8.0.24');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260218145018_AddCommentTable'
)
BEGIN
    CREATE TABLE [Comments] (
        [Id] int NOT NULL IDENTITY,
        [Content] nvarchar(max) NOT NULL,
        [GameId] int NOT NULL,
        [UserId] int NOT NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Comments] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Comments_Games_GameId] FOREIGN KEY ([GameId]) REFERENCES [Games] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_Comments_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260218145018_AddCommentTable'
)
BEGIN
    CREATE INDEX [IX_Comments_GameId] ON [Comments] ([GameId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260218145018_AddCommentTable'
)
BEGIN
    CREATE INDEX [IX_Comments_UserId] ON [Comments] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260218145018_AddCommentTable'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260218145018_AddCommentTable', N'8.0.24');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260218150256_AddGameImageTable'
)
BEGIN
    CREATE TABLE [GameImages] (
        [Id] int NOT NULL IDENTITY,
        [ImageURL] nvarchar(max) NOT NULL,
        [GameId] int NOT NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_GameImages] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_GameImages_Games_GameId] FOREIGN KEY ([GameId]) REFERENCES [Games] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260218150256_AddGameImageTable'
)
BEGIN
    CREATE INDEX [IX_GameImages_GameId] ON [GameImages] ([GameId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260218150256_AddGameImageTable'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260218150256_AddGameImageTable', N'8.0.24');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260218152143_AddAboutThisGameToGame'
)
BEGIN
    ALTER TABLE [Games] ADD [AboutThisGame] nvarchar(max) NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260218152143_AddAboutThisGameToGame'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260218152143_AddAboutThisGameToGame', N'8.0.24');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260218154141_AddIsPositiveToComment'
)
BEGIN
    ALTER TABLE [Comments] ADD [IsPositive] bit NOT NULL DEFAULT CAST(0 AS bit);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260218154141_AddIsPositiveToComment'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260218154141_AddIsPositiveToComment', N'8.0.24');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260218155041_AddTagAndGameTag'
)
BEGIN
    CREATE TABLE [Tags] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Tags] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260218155041_AddTagAndGameTag'
)
BEGIN
    CREATE TABLE [GameTags] (
        [Id] int NOT NULL IDENTITY,
        [GameId] int NOT NULL,
        [TagId] int NOT NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_GameTags] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_GameTags_Games_GameId] FOREIGN KEY ([GameId]) REFERENCES [Games] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_GameTags_Tags_TagId] FOREIGN KEY ([TagId]) REFERENCES [Tags] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260218155041_AddTagAndGameTag'
)
BEGIN
    CREATE INDEX [IX_GameTags_GameId] ON [GameTags] ([GameId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260218155041_AddTagAndGameTag'
)
BEGIN
    CREATE INDEX [IX_GameTags_TagId] ON [GameTags] ([TagId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260218155041_AddTagAndGameTag'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260218155041_AddTagAndGameTag', N'8.0.24');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260220124230_AddIsAdminToUser'
)
BEGIN
    ALTER TABLE [Users] ADD [IsAdmin] bit NOT NULL DEFAULT CAST(0 AS bit);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260220124230_AddIsAdminToUser'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260220124230_AddIsAdminToUser', N'8.0.24');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223115330_AddPostTables'
)
BEGIN
    CREATE TABLE [Posts] (
        [Id] int NOT NULL IDENTITY,
        [Title] nvarchar(max) NOT NULL,
        [Content] nvarchar(max) NOT NULL,
        [ImageURL] nvarchar(max) NULL,
        [GameId] int NULL,
        [UserId] int NOT NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Posts] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Posts_Games_GameId] FOREIGN KEY ([GameId]) REFERENCES [Games] ([Id]),
        CONSTRAINT [FK_Posts_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223115330_AddPostTables'
)
BEGIN
    CREATE TABLE [PostComments] (
        [Id] int NOT NULL IDENTITY,
        [Content] nvarchar(max) NOT NULL,
        [PostId] int NOT NULL,
        [UserId] int NOT NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_PostComments] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_PostComments_Posts_PostId] FOREIGN KEY ([PostId]) REFERENCES [Posts] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_PostComments_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223115330_AddPostTables'
)
BEGIN
    CREATE TABLE [PostVotes] (
        [Id] int NOT NULL IDENTITY,
        [IsUpvote] bit NOT NULL,
        [PostId] int NOT NULL,
        [UserId] int NOT NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_PostVotes] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_PostVotes_Posts_PostId] FOREIGN KEY ([PostId]) REFERENCES [Posts] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_PostVotes_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223115330_AddPostTables'
)
BEGIN
    CREATE INDEX [IX_PostComments_PostId] ON [PostComments] ([PostId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223115330_AddPostTables'
)
BEGIN
    CREATE INDEX [IX_PostComments_UserId] ON [PostComments] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223115330_AddPostTables'
)
BEGIN
    CREATE INDEX [IX_Posts_GameId] ON [Posts] ([GameId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223115330_AddPostTables'
)
BEGIN
    CREATE INDEX [IX_Posts_UserId] ON [Posts] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223115330_AddPostTables'
)
BEGIN
    CREATE INDEX [IX_PostVotes_PostId] ON [PostVotes] ([PostId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223115330_AddPostTables'
)
BEGIN
    CREATE INDEX [IX_PostVotes_UserId] ON [PostVotes] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223115330_AddPostTables'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260223115330_AddPostTables', N'8.0.24');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223121335_AddCommunitiesAndUpdatePosts'
)
BEGIN
    ALTER TABLE [Posts] DROP CONSTRAINT [FK_Posts_Games_GameId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223121335_AddCommunitiesAndUpdatePosts'
)
BEGIN
    DROP INDEX [IX_Posts_GameId] ON [Posts];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223121335_AddCommunitiesAndUpdatePosts'
)
BEGIN
    DECLARE @var0 sysname;
    SELECT @var0 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Posts]') AND [c].[name] = N'GameId');
    IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [Posts] DROP CONSTRAINT [' + @var0 + '];');
    ALTER TABLE [Posts] DROP COLUMN [GameId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223121335_AddCommunitiesAndUpdatePosts'
)
BEGIN
    ALTER TABLE [Posts] ADD [CommunityId] int NOT NULL DEFAULT 0;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223121335_AddCommunitiesAndUpdatePosts'
)
BEGIN
    CREATE TABLE [Communities] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NULL,
        [IconURL] nvarchar(max) NULL,
        [CreatedByUserId] int NOT NULL,
        [GameId] int NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Communities] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Communities_Games_GameId] FOREIGN KEY ([GameId]) REFERENCES [Games] ([Id]),
        CONSTRAINT [FK_Communities_Users_CreatedByUserId] FOREIGN KEY ([CreatedByUserId]) REFERENCES [Users] ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223121335_AddCommunitiesAndUpdatePosts'
)
BEGIN
    CREATE TABLE [CommunityMembers] (
        [Id] int NOT NULL IDENTITY,
        [CommunityId] int NOT NULL,
        [UserId] int NOT NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_CommunityMembers] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_CommunityMembers_Communities_CommunityId] FOREIGN KEY ([CommunityId]) REFERENCES [Communities] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_CommunityMembers_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223121335_AddCommunitiesAndUpdatePosts'
)
BEGIN
    CREATE INDEX [IX_Posts_CommunityId] ON [Posts] ([CommunityId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223121335_AddCommunitiesAndUpdatePosts'
)
BEGIN
    CREATE INDEX [IX_Communities_CreatedByUserId] ON [Communities] ([CreatedByUserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223121335_AddCommunitiesAndUpdatePosts'
)
BEGIN
    CREATE INDEX [IX_Communities_GameId] ON [Communities] ([GameId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223121335_AddCommunitiesAndUpdatePosts'
)
BEGIN
    CREATE UNIQUE INDEX [IX_CommunityMembers_CommunityId_UserId] ON [CommunityMembers] ([CommunityId], [UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223121335_AddCommunitiesAndUpdatePosts'
)
BEGIN
    CREATE INDEX [IX_CommunityMembers_UserId] ON [CommunityMembers] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223121335_AddCommunitiesAndUpdatePosts'
)
BEGIN

                    DECLARE @firstUserId INT = (SELECT TOP 1 Id FROM Users WHERE IsDeleted = 0 ORDER BY Id);
                    IF @firstUserId IS NOT NULL
                    BEGIN
                        INSERT INTO Communities (Name, Description, CreatedByUserId, IsDeleted, CreatedAt)
                        VALUES ('General', 'General discussion', @firstUserId, 0, GETUTCDATE());

                        DECLARE @generalId INT = SCOPE_IDENTITY();
                        UPDATE Posts SET CommunityId = @generalId WHERE CommunityId = 0;
                    END
                
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223121335_AddCommunitiesAndUpdatePosts'
)
BEGIN
    ALTER TABLE [Posts] ADD CONSTRAINT [FK_Posts_Communities_CommunityId] FOREIGN KEY ([CommunityId]) REFERENCES [Communities] ([Id]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223121335_AddCommunitiesAndUpdatePosts'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260223121335_AddCommunitiesAndUpdatePosts', N'8.0.24');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223122721_SeedGameCommunities'
)
BEGIN

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
                
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223122721_SeedGameCommunities'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260223122721_SeedGameCommunities', N'8.0.24');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223124457_AddCommentReplies'
)
BEGIN
    ALTER TABLE [PostComments] ADD [ParentCommentId] int NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223124457_AddCommentReplies'
)
BEGIN
    CREATE INDEX [IX_PostComments_ParentCommentId] ON [PostComments] ([ParentCommentId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223124457_AddCommentReplies'
)
BEGIN
    ALTER TABLE [PostComments] ADD CONSTRAINT [FK_PostComments_PostComments_ParentCommentId] FOREIGN KEY ([ParentCommentId]) REFERENCES [PostComments] ([Id]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223124457_AddCommentReplies'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260223124457_AddCommentReplies', N'8.0.24');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223125730_AddPostMedia'
)
BEGIN
    ALTER TABLE [Posts] ADD [MediaType] nvarchar(max) NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223125730_AddPostMedia'
)
BEGIN
    ALTER TABLE [Posts] ADD [MediaURL] nvarchar(max) NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260223125730_AddPostMedia'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260223125730_AddPostMedia', N'8.0.24');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224123926_AddNotifications'
)
BEGIN
    CREATE TABLE [Notifications] (
        [Id] int NOT NULL IDENTITY,
        [Type] nvarchar(max) NOT NULL,
        [Message] nvarchar(max) NOT NULL,
        [IsRead] bit NOT NULL,
        [UserId] int NOT NULL,
        [PostId] int NULL,
        [CommentId] int NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Notifications] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Notifications_PostComments_CommentId] FOREIGN KEY ([CommentId]) REFERENCES [PostComments] ([Id]),
        CONSTRAINT [FK_Notifications_Posts_PostId] FOREIGN KEY ([PostId]) REFERENCES [Posts] ([Id]),
        CONSTRAINT [FK_Notifications_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224123926_AddNotifications'
)
BEGIN
    CREATE INDEX [IX_Notifications_CommentId] ON [Notifications] ([CommentId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224123926_AddNotifications'
)
BEGIN
    CREATE INDEX [IX_Notifications_PostId] ON [Notifications] ([PostId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224123926_AddNotifications'
)
BEGIN
    CREATE INDEX [IX_Notifications_UserId] ON [Notifications] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224123926_AddNotifications'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260224123926_AddNotifications', N'8.0.24');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224125748_AddUserDeleteTrigger'
)
BEGIN
    ALTER TABLE [Comments] DROP CONSTRAINT [FK_Comments_Users_UserId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224125748_AddUserDeleteTrigger'
)
BEGIN
    ALTER TABLE [Comments] ADD CONSTRAINT [FK_Comments_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224125748_AddUserDeleteTrigger'
)
BEGIN

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

END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224125748_AddUserDeleteTrigger'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260224125748_AddUserDeleteTrigger', N'8.0.24');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224133858_AddPostViews'
)
BEGIN
    CREATE TABLE [PostViews] (
        [Id] int NOT NULL IDENTITY,
        [UserId] int NOT NULL,
        [PostId] int NOT NULL,
        [ViewedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_PostViews] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_PostViews_Posts_PostId] FOREIGN KEY ([PostId]) REFERENCES [Posts] ([Id]),
        CONSTRAINT [FK_PostViews_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224133858_AddPostViews'
)
BEGIN
    CREATE INDEX [IX_PostViews_PostId] ON [PostViews] ([PostId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224133858_AddPostViews'
)
BEGIN
    CREATE INDEX [IX_PostViews_UserId] ON [PostViews] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224133858_AddPostViews'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260224133858_AddPostViews', N'8.0.24');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224134917_AddPostViewUniqueIndex'
)
BEGIN

    WITH cte AS (
        SELECT Id, ROW_NUMBER() OVER (PARTITION BY UserId, PostId ORDER BY ViewedAt DESC) AS rn
        FROM PostViews
    )
    DELETE FROM cte WHERE rn > 1;

END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224134917_AddPostViewUniqueIndex'
)
BEGIN
    DROP INDEX [IX_PostViews_UserId] ON [PostViews];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224134917_AddPostViewUniqueIndex'
)
BEGIN
    CREATE UNIQUE INDEX [IX_PostViews_UserId_PostId] ON [PostViews] ([UserId], [PostId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260224134917_AddPostViewUniqueIndex'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260224134917_AddPostViewUniqueIndex', N'8.0.24');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260301100007_AddSettingsFeatures'
)
BEGIN
    ALTER TABLE [Users] ADD [NotifyCommentReplies] bit NOT NULL DEFAULT CAST(0 AS bit);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260301100007_AddSettingsFeatures'
)
BEGIN
    ALTER TABLE [Users] ADD [NotifyNewPosts] bit NOT NULL DEFAULT CAST(0 AS bit);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260301100007_AddSettingsFeatures'
)
BEGIN
    ALTER TABLE [Users] ADD [NotifyPostVotes] bit NOT NULL DEFAULT CAST(0 AS bit);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260301100007_AddSettingsFeatures'
)
BEGIN
    CREATE TABLE [MutedCommunities] (
        [Id] int NOT NULL IDENTITY,
        [UserId] int NOT NULL,
        [CommunityId] int NOT NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_MutedCommunities] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_MutedCommunities_Communities_CommunityId] FOREIGN KEY ([CommunityId]) REFERENCES [Communities] ([Id]),
        CONSTRAINT [FK_MutedCommunities_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260301100007_AddSettingsFeatures'
)
BEGIN
    CREATE INDEX [IX_MutedCommunities_CommunityId] ON [MutedCommunities] ([CommunityId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260301100007_AddSettingsFeatures'
)
BEGIN
    CREATE UNIQUE INDEX [IX_MutedCommunities_UserId_CommunityId] ON [MutedCommunities] ([UserId], [CommunityId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260301100007_AddSettingsFeatures'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260301100007_AddSettingsFeatures', N'8.0.24');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260302150555_AddChatMessages'
)
BEGIN
    CREATE TABLE [ChatMessages] (
        [Id] int NOT NULL IDENTITY,
        [SenderId] int NOT NULL,
        [ReceiverId] int NOT NULL,
        [Content] nvarchar(max) NOT NULL,
        [IsRead] bit NOT NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_ChatMessages] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_ChatMessages_Users_ReceiverId] FOREIGN KEY ([ReceiverId]) REFERENCES [Users] ([Id]),
        CONSTRAINT [FK_ChatMessages_Users_SenderId] FOREIGN KEY ([SenderId]) REFERENCES [Users] ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260302150555_AddChatMessages'
)
BEGIN
    CREATE INDEX [IX_ChatMessages_ReceiverId] ON [ChatMessages] ([ReceiverId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260302150555_AddChatMessages'
)
BEGIN
    CREATE INDEX [IX_ChatMessages_SenderId] ON [ChatMessages] ([SenderId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260302150555_AddChatMessages'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260302150555_AddChatMessages', N'8.0.24');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260302153243_AddFriendships'
)
BEGIN
    CREATE TABLE [Friendships] (
        [Id] int NOT NULL IDENTITY,
        [RequesterId] int NOT NULL,
        [AddresseeId] int NOT NULL,
        [Status] nvarchar(max) NOT NULL,
        [IsDeleted] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Friendships] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Friendships_Users_AddresseeId] FOREIGN KEY ([AddresseeId]) REFERENCES [Users] ([Id]),
        CONSTRAINT [FK_Friendships_Users_RequesterId] FOREIGN KEY ([RequesterId]) REFERENCES [Users] ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260302153243_AddFriendships'
)
BEGIN
    CREATE INDEX [IX_Friendships_AddresseeId] ON [Friendships] ([AddresseeId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260302153243_AddFriendships'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Friendships_RequesterId_AddresseeId] ON [Friendships] ([RequesterId], [AddresseeId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260302153243_AddFriendships'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260302153243_AddFriendships', N'8.0.24');
END;
GO

COMMIT;
GO

