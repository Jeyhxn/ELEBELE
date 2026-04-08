using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocialMediaForGamersApp.Data;
using SocialMediaForGamersApp.DTOs;
using SocialMediaForGamersApp.Models;
using SocialMediaForGamersApp.Repositories.Interfaces;
using SocialMediaForGamersApp.Utilities.Enums;
using SocialMediaForGamersApp.Utilities.Extensions;

namespace SocialMediaForGamersApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameController : ControllerBase
    {
        private readonly IRepository _repository;
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public GameController(IRepository repository, AppDbContext context, IWebHostEnvironment env)
        {
            _repository = repository;
            _context = context;
            _env = env;
        }

        private async Task<string> SaveImageAsync(IFormFile file)
        {
            if (!file.ValidateType("image"))
                throw new ArgumentException("File must be an image");

            if (!file.ValidateSize(FileSize.MB, 5))
                throw new ArgumentException("Image must be less than 5MB");

            return await file.CreateFileAsync(_env.WebRootPath, "images");
        }

        private void DeleteImage(string? fileName)
        {
            if (!string.IsNullOrWhiteSpace(fileName))
            {
                fileName.DeleteFile(_env.WebRootPath, "images");
            }
        }

        [HttpGet]
        public async Task<IActionResult> Get(int page = 1, int take = 20,
            [FromQuery] string? search = null,
            [FromQuery] int? categoryId = null,
            [FromQuery] List<int>? platformIds = null,
            [FromQuery] List<int>? tagIds = null)
        {
            int skipValue = (page - 1) * take;

            var query = _context.Games
                .Where(g => !g.IsDeleted)
                .Include(g => g.Category)
                .Include(g => g.GamePlatforms).ThenInclude(gp => gp.Platform)
                .Include(g => g.GameTags).ThenInclude(gt => gt.Tag)
                .Include(g => g.GameImages)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim().ToLower();
                query = query.Where(g =>
                    g.Name.ToLower().Contains(term) ||
                    g.Developer.ToLower().Contains(term) ||
                    g.Publisher.ToLower().Contains(term) ||
                    g.Description.ToLower().Contains(term));
            }

            if (categoryId.HasValue)
            {
                query = query.Where(g => g.CategoryId == categoryId.Value);
            }

            if (platformIds != null && platformIds.Any())
            {
                query = query.Where(g => platformIds.All(pid => g.GamePlatforms.Any(gp => gp.PlatformId == pid)));
            }

            if (tagIds != null && tagIds.Any())
            {
                query = query.Where(g => tagIds.All(tid => g.GameTags.Any(gt => gt.TagId == tid)));
            }

            var games = await query
                .OrderBy(g => g.Name)
                .Skip(skipValue)
                .Take(take)
                .ToListAsync();

            return Ok(games);
        }

        [HttpGet("top-rated")]
        public async Task<IActionResult> GetTopRated(int take = 10)
        {
            var games = await _context.Games
                .Where(g => !g.IsDeleted)
                .Include(g => g.Category)
                .Include(g => g.GameImages)
                .OrderByDescending(g => g.Rating)
                .Take(take)
                .ToListAsync();

            return Ok(games);
        }

        [HttpGet("most-positive")]
        public async Task<IActionResult> GetMostPositive(int take = 10)
        {
            var games = await _context.Games
                .Where(g => !g.IsDeleted)
                .Include(g => g.Category)
                .Include(g => g.GameImages)
                .Select(g => new
                {
                    Game = g,
                    PositiveCount = g.Comments.Count(c => c.IsPositive && !c.IsDeleted),
                    NegativeCount = g.Comments.Count(c => !c.IsPositive && !c.IsDeleted)
                })
                .OrderByDescending(x => x.PositiveCount - x.NegativeCount)
                .ThenByDescending(x => x.PositiveCount)
                .Take(take)
                .Select(x => x.Game)
                .ToListAsync();

            return Ok(games);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            if (id < 1) return BadRequest();

            Game game = await _repository.GameGetAll(
                expression: g => g.Id == id,
                includes: new string[] { "Category", "GamePlatforms.Platform", "GameImages", "GameTags.Tag" }
            ).FirstOrDefaultAsync();

            if (game is null) return NotFound();

            return Ok(game);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CreateGameDto createGameDto)
        {
            var category = await _repository.CategoryGetAll(expression: c => c.Name == createGameDto.CategoryName)
                .FirstOrDefaultAsync();

            if (category is null)
                return BadRequest($"Category '{createGameDto.CategoryName}' not found");

            if (createGameDto.PlatformIds.Any())
            {
                var existingPlatformIds = await _context.Platforms
                    .Where(p => createGameDto.PlatformIds.Contains(p.Id) && !p.IsDeleted)
                    .Select(p => p.Id)
                    .ToListAsync();

                var invalidPlatformIds = createGameDto.PlatformIds.Except(existingPlatformIds).ToList();
                if (invalidPlatformIds.Any())
                    return BadRequest($"Platform IDs not found: {string.Join(", ", invalidPlatformIds)}");
            }

            if (createGameDto.TagIds.Any())
            {
                var existingTagIds = await _context.Tags
                    .Where(t => createGameDto.TagIds.Contains(t.Id) && !t.IsDeleted)
                    .Select(t => t.Id)
                    .ToListAsync();

                var invalidTagIds = createGameDto.TagIds.Except(existingTagIds).ToList();
                if (invalidTagIds.Any())
                    return BadRequest($"Tag IDs not found: {string.Join(", ", invalidTagIds)}");
            }

            string? mainImageName = null;
            if (createGameDto.MainImage != null && createGameDto.MainImage.Length > 0)
            {
                if (!createGameDto.MainImage.ValidateType("image"))
                    return BadRequest("Main image must be an image file");
                if (!createGameDto.MainImage.ValidateSize(FileSize.MB, 5))
                    return BadRequest("Main image must be less than 5MB");

                mainImageName = await SaveImageAsync(createGameDto.MainImage);
            }

            Game game = new Game
            {
                Name = createGameDto.Name,
                Description = createGameDto.Description,
                ReleaseDate = createGameDto.ReleaseDate,
                Developer = createGameDto.Developer,
                Publisher = createGameDto.Publisher,
                Rating = createGameDto.Rating,
                ImageURL = mainImageName,
                AboutThisGame = createGameDto.AboutThisGame,
                CategoryId = category.Id,
                CreatedAt = DateTime.UtcNow
            };

            await _repository.AddAsync(game);
            await _repository.SaveChangeAsync();

            if (createGameDto.PlatformIds.Any())
            {
                foreach (var platformId in createGameDto.PlatformIds)
                {
                    var gamePlatform = new GamePlatform
                    {
                        GameId = game.Id,
                        PlatformId = platformId,
                        CreatedAt = DateTime.UtcNow
                    };
                    await _repository.AddAsync(gamePlatform);
                }
                await _repository.SaveChangeAsync();
            }

            if (createGameDto.AdditionalImages != null && createGameDto.AdditionalImages.Any())
            {
                foreach (var file in createGameDto.AdditionalImages)
                {
                    if (file.Length > 0)
                    {
                        if (!file.ValidateType("image"))
                            return BadRequest("Additional images must be image files");
                        if (!file.ValidateSize(FileSize.MB, 5))
                            return BadRequest("Each additional image must be less than 5MB");

                        var savedFileName = await SaveImageAsync(file);
                        _context.GameImages.Add(new GameImage
                        {
                            GameId = game.Id,
                            ImageURL = savedFileName,
                            CreatedAt = DateTime.UtcNow
                        });
                    }
                }
                await _context.SaveChangesAsync();
            }

            if (createGameDto.TagIds.Any())
            {
                foreach (var tagId in createGameDto.TagIds)
                {
                    var gameTag = new GameTag
                    {
                        GameId = game.Id,
                        TagId = tagId,
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.GameTags.Add(gameTag);
                }
                await _context.SaveChangesAsync();
            }

            var existingCommunity = await _context.Communities
                .AnyAsync(c => c.GameId == game.Id && !c.IsDeleted);
            if (!existingCommunity)
            {
                _context.Communities.Add(new Community
                {
                    Name = game.Name,
                    Description = $"Community for {game.Name}",
                    GameId = game.Id,
                    CreatedByUserId = createGameDto.UserId ?? 1,
                    CreatedAt = DateTime.UtcNow
                });
                await _context.SaveChangesAsync();
            }

            return StatusCode(StatusCodes.Status201Created, game);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (id < 1) return BadRequest();

            Game game = await _repository.GameGetByIdAsync(id);
            if (game is null) return NotFound();

            game.IsDeleted = true;
            await _repository.SaveChangeAsync();

            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] UpdateGameDto updateGameDto)
        {
            if (id < 1) return BadRequest();

            Game game = await _repository.GameGetByIdAsync(id);

            if (game is null) return NotFound();

            var category = await _repository.CategoryGetAll(expression: c => c.Name == updateGameDto.CategoryName)
                .FirstOrDefaultAsync();

            if (category is null)
                return BadRequest($"Category '{updateGameDto.CategoryName}' not found");

            if (updateGameDto.PlatformIds.Any())
            {
                var existingPlatformIds = await _context.Platforms
                    .Where(p => updateGameDto.PlatformIds.Contains(p.Id) && !p.IsDeleted)
                    .Select(p => p.Id)
                    .ToListAsync();

                var invalidPlatformIds = updateGameDto.PlatformIds.Except(existingPlatformIds).ToList();
                if (invalidPlatformIds.Any())
                    return BadRequest($"Platform IDs not found: {string.Join(", ", invalidPlatformIds)}");
            }

            if (updateGameDto.TagIds.Any())
            {
                var existingTagIds = await _context.Tags
                    .Where(t => updateGameDto.TagIds.Contains(t.Id) && !t.IsDeleted)
                    .Select(t => t.Id)
                    .ToListAsync();

                var invalidTagIds = updateGameDto.TagIds.Except(existingTagIds).ToList();
                if (invalidTagIds.Any())
                    return BadRequest($"Tag IDs not found: {string.Join(", ", invalidTagIds)}");
            }

            game.Name = updateGameDto.Name;
            game.Description = updateGameDto.Description;
            game.ReleaseDate = updateGameDto.ReleaseDate;
            game.Developer = updateGameDto.Developer;
            game.Publisher = updateGameDto.Publisher;
            game.Rating = updateGameDto.Rating;
            game.AboutThisGame = updateGameDto.AboutThisGame;
            game.CategoryId = category.Id;

            if (updateGameDto.MainImage != null && updateGameDto.MainImage.Length > 0)
            {
                if (!updateGameDto.MainImage.ValidateType("image"))
                    return BadRequest("Main image must be an image file");
                if (!updateGameDto.MainImage.ValidateSize(FileSize.MB, 5))
                    return BadRequest("Main image must be less than 5MB");

                DeleteImage(game.ImageURL);

                game.ImageURL = await SaveImageAsync(updateGameDto.MainImage);
            }

            _repository.Update(game);
            await _repository.SaveChangeAsync();

            var existingPlatforms = await _context.GamePlatforms.Where(gp => gp.GameId == id).ToListAsync();
            _context.GamePlatforms.RemoveRange(existingPlatforms);

            if (updateGameDto.PlatformIds.Any())
            {
                foreach (var platformId in updateGameDto.PlatformIds)
                {
                    _context.GamePlatforms.Add(new GamePlatform
                    {
                        GameId = game.Id,
                        PlatformId = platformId,
                        CreatedAt = DateTime.UtcNow
                    });
                }
            }

            var existingTags = await _context.GameTags.Where(gt => gt.GameId == id).ToListAsync();
            _context.GameTags.RemoveRange(existingTags);

            if (updateGameDto.TagIds.Any())
            {
                foreach (var tagId in updateGameDto.TagIds)
                {
                    _context.GameTags.Add(new GameTag
                    {
                        GameId = game.Id,
                        TagId = tagId,
                        CreatedAt = DateTime.UtcNow
                    });
                }
            }
            await _context.SaveChangesAsync();

            var updatedGame = await _repository.GameGetAll(
                expression: g => g.Id == id,
                includes: new string[] { "Category", "GamePlatforms.Platform", "GameImages", "GameTags.Tag" }
            ).FirstOrDefaultAsync();

            return Ok(updatedGame);
        }
    }
}
