using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocialMediaForGamersApp.Data;
using SocialMediaForGamersApp.Models;

namespace SocialMediaForGamersApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameImageController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GameImageController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("game/{gameId}")]
        public async Task<IActionResult> GetByGame(int gameId)
        {
            var images = await _context.GameImages
                .Where(gi => gi.GameId == gameId && !gi.IsDeleted)
                .OrderBy(gi => gi.CreatedAt)
                .Select(gi => new
                {
                    gi.Id,
                    gi.ImageURL,
                    gi.GameId,
                    gi.CreatedAt
                })
                .ToListAsync();

            return Ok(images);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateGameImageDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.ImageURL))
                return BadRequest(new { message = "Image URL is required" });

            var game = await _context.Games.FindAsync(dto.GameId);
            if (game == null)
                return BadRequest(new { message = "Game not found" });

            var gameImage = new GameImage
            {
                ImageURL = dto.ImageURL,
                GameId = dto.GameId,
                CreatedAt = DateTime.UtcNow
            };

            _context.GameImages.Add(gameImage);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                gameImage.Id,
                gameImage.ImageURL,
                gameImage.GameId,
                gameImage.CreatedAt
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var gameImage = await _context.GameImages.FindAsync(id);
            if (gameImage == null)
                return NotFound();

            gameImage.IsDeleted = true;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public class CreateGameImageDto
    {
        public string ImageURL { get; set; }
        public int GameId { get; set; }
    }
}
