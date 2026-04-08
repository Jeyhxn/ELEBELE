using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocialMediaForGamersApp.Data;
using SocialMediaForGamersApp.Models;

namespace SocialMediaForGamersApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TagController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TagController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var tags = await _context.Tags
                .Where(t => !t.IsDeleted)
                .OrderBy(t => t.Name)
                .Select(t => new { t.Id, t.Name })
                .ToListAsync();

            return Ok(tags);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var tag = await _context.Tags.FindAsync(id);
            if (tag == null || tag.IsDeleted) return NotFound();

            return Ok(new { tag.Id, tag.Name });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTagDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest(new { message = "Tag name is required" });

            var exists = await _context.Tags.AnyAsync(t => t.Name == dto.Name && !t.IsDeleted);
            if (exists)
                return BadRequest(new { message = $"Tag '{dto.Name}' already exists" });

            var tag = new Tag
            {
                Name = dto.Name,
                CreatedAt = DateTime.UtcNow
            };

            _context.Tags.Add(tag);
            await _context.SaveChangesAsync();

            return StatusCode(StatusCodes.Status201Created, new { tag.Id, tag.Name });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var tag = await _context.Tags.FindAsync(id);
            if (tag == null) return NotFound();

            tag.IsDeleted = true;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public class CreateTagDto
    {
        public string Name { get; set; }
    }
}
