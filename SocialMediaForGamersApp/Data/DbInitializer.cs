using Microsoft.EntityFrameworkCore;
using SocialMediaForGamersApp.Models;
using System.Security.Cryptography;
using System.Text;

namespace SocialMediaForGamersApp.Data
{
    public static class DbInitializer
    {
        public static async Task SeedAsync(AppDbContext context)
        {
            //only if theres users
            if (await context.Users.AnyAsync())
                return;

            var now = DateTime.UtcNow;

            //users
            var users = new List<User>
            {
                new User
                {
                    Username = "admin",
                    Email = "admin@gameily.com",
                    PasswordHash = HashPassword("Admin123!"),
                    FirstName = "Admin",
                    LastName = "User",
                    IsAdmin = true,
                    IsEmailVerified = true,
                    CreatedAt = now
                },
                new User
                {
                    Username = "gamer_jane",
                    Email = "jane@example.com",
                    PasswordHash = HashPassword("Jane123!"),
                    FirstName = "Jane",
                    LastName = "Doe",
                    IsEmailVerified = true,
                    CreatedAt = now
                },
                new User
                {
                    Username = "pixel_master",
                    Email = "pixel@example.com",
                    PasswordHash = HashPassword("Pixel123!"),
                    FirstName = "Alex",
                    LastName = "Smith",
                    IsEmailVerified = true,
                    CreatedAt = now
                },
                new User
                {
                    Username = "retro_player",
                    Email = "retro@example.com",
                    PasswordHash = HashPassword("Retro123!"),
                    FirstName = "Sam",
                    LastName = "Johnson",
                    IsEmailVerified = true,
                    CreatedAt = now
                },
                new User
                {
                    Username = "night_owl",
                    Email = "owl@example.com",
                    PasswordHash = HashPassword("Owl12345!"),
                    FirstName = "Chris",
                    LastName = "Lee",
                    IsEmailVerified = true,
                    CreatedAt = now
                }
            };

            context.Users.AddRange(users);
            await context.SaveChangesAsync();

            //categories
            var categories = new List<Category>
            {
                new Category { Name = "Action", CreatedAt = now },
                new Category { Name = "RPG", CreatedAt = now },
                new Category { Name = "Adventure", CreatedAt = now },
                new Category { Name = "Strategy", CreatedAt = now }
            };

            context.Categories.AddRange(categories);
            await context.SaveChangesAsync();

            //platforms
            var platforms = new List<Platform>
            {
                new Platform { Name = "PC", CreatedAt = now },
                new Platform { Name = "PlayStation 5", CreatedAt = now },
                new Platform { Name = "Xbox Series X", CreatedAt = now },
                new Platform { Name = "Nintendo Switch", CreatedAt = now }
            };

            context.Platforms.AddRange(platforms);
            await context.SaveChangesAsync();

            //tags
            var tags = new List<Tag>
            {
                new Tag { Name = "Open World", CreatedAt = now },
                new Tag { Name = "Multiplayer", CreatedAt = now },
                new Tag { Name = "Singleplayer", CreatedAt = now },
                new Tag { Name = "Indie", CreatedAt = now }
            };

            context.Tags.AddRange(tags);
            await context.SaveChangesAsync();

            //games
            var games = new List<Game>
            {
                new Game
                {
                    Name = "Elden Ring",
                    Description = "An action RPG set in a vast open world.",
                    ReleaseDate = new DateTime(2022, 2, 25),
                    Developer = "FromSoftware",
                    Publisher = "Bandai Namco",
                    Rating = 9.5,
                    ImageURL = "https://placeholder.co/400x300?text=Elden+Ring",
                    AboutThisGame = "Elden Ring is an expansive fantasy action-RPG game.",
                    CategoryId = categories[1].Id, // RPG
                    CreatedAt = now
                },
                new Game
                {
                    Name = "The Legend of Zelda: Tears of the Kingdom",
                    Description = "An epic adventure across the lands and skies of Hyrule.",
                    ReleaseDate = new DateTime(2023, 5, 12),
                    Developer = "Nintendo",
                    Publisher = "Nintendo",
                    Rating = 9.7,
                    ImageURL = "https://placeholder.co/400x300?text=Zelda+TotK",
                    AboutThisGame = "Explore a reimagined Hyrule with new abilities.",
                    CategoryId = categories[2].Id, // Adventure
                    CreatedAt = now
                },
                new Game
                {
                    Name = "Hades II",
                    Description = "A rogue-like dungeon crawler with fast-paced action.",
                    ReleaseDate = new DateTime(2024, 5, 6),
                    Developer = "Supergiant Games",
                    Publisher = "Supergiant Games",
                    Rating = 9.0,
                    ImageURL = "https://placeholder.co/400x300?text=Hades+II",
                    AboutThisGame = "Battle your way out of the underworld once more.",
                    CategoryId = categories[0].Id, // Action
                    CreatedAt = now
                }
            };

            context.Games.AddRange(games);
            await context.SaveChangesAsync();

            //gamePlatforms
            var gamePlatforms = new List<GamePlatform>
            {
                new GamePlatform { GameId = games[0].Id, PlatformId = platforms[0].Id, CreatedAt = now }, // Elden Ring - PC
                new GamePlatform { GameId = games[0].Id, PlatformId = platforms[1].Id, CreatedAt = now }, // Elden Ring - PS5
                new GamePlatform { GameId = games[0].Id, PlatformId = platforms[2].Id, CreatedAt = now }, // Elden Ring - Xbox
                new GamePlatform { GameId = games[1].Id, PlatformId = platforms[3].Id, CreatedAt = now }, // Zelda - Switch
                new GamePlatform { GameId = games[2].Id, PlatformId = platforms[0].Id, CreatedAt = now }, // Hades II - PC
            };

            context.GamePlatforms.AddRange(gamePlatforms);
            await context.SaveChangesAsync();

            //gameTags
            var gameTags = new List<GameTag>
            {
                new GameTag { GameId = games[0].Id, TagId = tags[0].Id, CreatedAt = now }, // Elden Ring - Open World
                new GameTag { GameId = games[0].Id, TagId = tags[2].Id, CreatedAt = now }, // Elden Ring - Singleplayer
                new GameTag { GameId = games[1].Id, TagId = tags[0].Id, CreatedAt = now }, // Zelda - Open World
                new GameTag { GameId = games[1].Id, TagId = tags[2].Id, CreatedAt = now }, // Zelda - Singleplayer
                new GameTag { GameId = games[2].Id, TagId = tags[2].Id, CreatedAt = now }, // Hades II - Singleplayer
                new GameTag { GameId = games[2].Id, TagId = tags[3].Id, CreatedAt = now }, // Hades II - Indie
            };

            context.GameTags.AddRange(gameTags);
            await context.SaveChangesAsync();

            //communites
            var communities = new List<Community>
            {
                new Community
                {
                    Name = "Elden Ring Fans",
                    Description = "Discuss all things Elden Ring.",
                    CreatedByUserId = users[0].Id,
                    GameId = games[0].Id,
                    CreatedAt = now
                },
                new Community
                {
                    Name = "Zelda Universe",
                    Description = "A community for Zelda enthusiasts.",
                    CreatedByUserId = users[1].Id,
                    GameId = games[1].Id,
                    CreatedAt = now
                },
                new Community
                {
                    Name = "Hades Enjoyers",
                    Description = "Share tips, builds, and memes about Hades II.",
                    CreatedByUserId = users[2].Id,
                    GameId = games[2].Id,
                    CreatedAt = now
                }
            };

            context.Communities.AddRange(communities);
            await context.SaveChangesAsync();

            //communityMembers
            var members = new List<CommunityMember>
            {
                new CommunityMember { CommunityId = communities[0].Id, UserId = users[0].Id, CreatedAt = now },
                new CommunityMember { CommunityId = communities[0].Id, UserId = users[1].Id, CreatedAt = now },
                new CommunityMember { CommunityId = communities[0].Id, UserId = users[3].Id, CreatedAt = now },
                new CommunityMember { CommunityId = communities[1].Id, UserId = users[1].Id, CreatedAt = now },
                new CommunityMember { CommunityId = communities[1].Id, UserId = users[4].Id, CreatedAt = now },
                new CommunityMember { CommunityId = communities[2].Id, UserId = users[2].Id, CreatedAt = now },
                new CommunityMember { CommunityId = communities[2].Id, UserId = users[3].Id, CreatedAt = now },
                new CommunityMember { CommunityId = communities[2].Id, UserId = users[4].Id, CreatedAt = now },
            };

            context.CommunityMembers.AddRange(members);
            await context.SaveChangesAsync();

            //posts  
            var posts = new List<Post>
            {
                new Post
                {
                    Title = "Best Elden Ring build for beginners?",
                    Content = "I just started Elden Ring and I'm struggling. What build do you recommend for a new player?",
                    CommunityId = communities[0].Id,
                    UserId = users[1].Id,
                    CreatedAt = now.AddHours(-10)
                },
                new Post
                {
                    Title = "Tears of the Kingdom is a masterpiece",
                    Content = "I finished the main story and it's one of the best games I've ever played. The creativity the game allows is insane.",
                    CommunityId = communities[1].Id,
                    UserId = users[4].Id,
                    CreatedAt = now.AddHours(-8)
                },
                new Post
                {
                    Title = "Hades II early access impressions",
                    Content = "The early access version is already incredible. Supergiant did it again. Melinoë feels so different from Zagreus.",
                    CommunityId = communities[2].Id,
                    UserId = users[2].Id,
                    CreatedAt = now.AddHours(-6)
                },
                new Post
                {
                    Title = "My Elden Ring boss tier list",
                    Content = "After 200 hours, here is my personal boss difficulty ranking. Malenia is still #1 for me.",
                    CommunityId = communities[0].Id,
                    UserId = users[3].Id,
                    CreatedAt = now.AddHours(-4)
                },
                new Post
                {
                    Title = "Favorite Zelda shrine?",
                    Content = "What is your favorite shrine in TotK? I love the physics-based puzzle ones.",
                    CommunityId = communities[1].Id,
                    UserId = users[1].Id,
                    CreatedAt = now.AddHours(-2)
                }
            };

            context.Posts.AddRange(posts);
            await context.SaveChangesAsync();

            //comments on games
            var gameComments = new List<Comment>
            {
                new Comment
                {
                    Content = "Elden Ring changed the way I look at open-world games. Absolute gem.",
                    IsPositive = true,
                    GameId = games[0].Id,
                    UserId = users[1].Id,
                    CreatedAt = now.AddHours(-9)
                },
                new Comment
                {
                    Content = "The difficulty can be frustrating at times but the sense of achievement is unmatched.",
                    IsPositive = true,
                    GameId = games[0].Id,
                    UserId = users[3].Id,
                    CreatedAt = now.AddHours(-7)
                },
                new Comment
                {
                    Content = "Tears of the Kingdom is easily the best Switch game. The Ultrahand ability is genius.",
                    IsPositive = true,
                    GameId = games[1].Id,
                    UserId = users[4].Id,
                    CreatedAt = now.AddHours(-6)
                },
                new Comment
                {
                    Content = "I wish TotK had better performance on the Switch. Frame drops in some areas.",
                    IsPositive = false,
                    GameId = games[1].Id,
                    UserId = users[2].Id,
                    CreatedAt = now.AddHours(-5)
                },
                new Comment
                {
                    Content = "Hades II is shaping up to be even better than the first. Great soundtrack too!",
                    IsPositive = true,
                    GameId = games[2].Id,
                    UserId = users[0].Id,
                    CreatedAt = now.AddHours(-4)
                },
                new Comment
                {
                    Content = "Still in early access but already has more content than most full releases.",
                    IsPositive = true,
                    GameId = games[2].Id,
                    UserId = users[3].Id,
                    CreatedAt = now.AddHours(-3)
                }
            };

            context.Comments.AddRange(gameComments);
            await context.SaveChangesAsync();

            //comments on posts
            var postComments = new List<PostComment>
            {
                new PostComment
                {
                    Content = "Go with a Strength/Vigor build. Get a big shield and a heavy weapon. Makes early game much easier.",
                    PostId = posts[0].Id,
                    UserId = users[3].Id,
                    CreatedAt = now.AddHours(-9)
                },
                new PostComment
                {
                    Content = "I'd recommend a magic build. Sorceries let you deal damage from a safe distance.",
                    PostId = posts[0].Id,
                    UserId = users[2].Id,
                    CreatedAt = now.AddHours(-8)
                },
                new PostComment
                {
                    Content = "Totally agree! The sky islands blew my mind.",
                    PostId = posts[1].Id,
                    UserId = users[1].Id,
                    CreatedAt = now.AddHours(-7)
                },
                new PostComment
                {
                    Content = "The building mechanics alone make it worth the price.",
                    PostId = posts[1].Id,
                    UserId = users[3].Id,
                    CreatedAt = now.AddHours(-6)
                },
                new PostComment
                {
                    Content = "Melinoë's toolkit is so fun. The sprint-cast combo is addictive.",
                    PostId = posts[2].Id,
                    UserId = users[4].Id,
                    CreatedAt = now.AddHours(-5)
                },
                new PostComment
                {
                    Content = "Malenia is overrated difficulty-wise. Radahn pre-nerf was the real nightmare.",
                    PostId = posts[3].Id,
                    UserId = users[1].Id,
                    CreatedAt = now.AddHours(-3)
                },
                new PostComment
                {
                    Content = "Hard disagree, Malenia's Waterfowl Dance is the hardest move in the game.",
                    PostId = posts[3].Id,
                    UserId = users[4].Id,
                    CreatedAt = now.AddHours(-2)
                },
                new PostComment
                {
                    Content = "The one where you have to build a bridge with Ultrahand is so creative.",
                    PostId = posts[4].Id,
                    UserId = users[4].Id,
                    CreatedAt = now.AddHours(-1)
                }
            };

            context.PostComments.AddRange(postComments);
            await context.SaveChangesAsync();
        }

        private static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }
    }
}
