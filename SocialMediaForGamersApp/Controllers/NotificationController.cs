using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocialMediaForGamersApp.Data;

namespace SocialMediaForGamersApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NotificationController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int userId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId && !n.IsDeleted)
                .OrderByDescending(n => n.CreatedAt)
                .Take(50)
                .Select(n => new
                {
                    n.Id,
                    n.Type,
                    n.Message,
                    n.IsRead,
                    n.PostId,
                    n.CommentId,
                    n.CreatedAt
                })
                .ToListAsync();

            return Ok(notifications);
        }

        [HttpGet("unread-count")]
        public async Task<IActionResult> GetUnreadCount([FromQuery] int userId)
        {
            var count = await _context.Notifications
                .CountAsync(n => n.UserId == userId && !n.IsRead && !n.IsDeleted);

            return Ok(new { count });
        }

        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id, [FromQuery] int userId)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null || notification.IsDeleted || notification.UserId != userId)
                return NotFound();

            notification.IsRead = true;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("read-all")]
        public async Task<IActionResult> MarkAllAsRead([FromQuery] int userId)
        {
            var unread = await _context.Notifications
                .Where(n => n.UserId == userId && !n.IsRead && !n.IsDeleted)
                .ToListAsync();

            foreach (var n in unread)
                n.IsRead = true;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("clear-all")]
        public async Task<IActionResult> ClearAll([FromQuery] int userId)
        {
            var all = await _context.Notifications
                .Where(n => n.UserId == userId && !n.IsDeleted)
                .ToListAsync();

            foreach (var n in all)
                n.IsDeleted = true;

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
