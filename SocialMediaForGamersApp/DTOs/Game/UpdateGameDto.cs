using Microsoft.AspNetCore.Http;

namespace SocialMediaForGamersApp.DTOs
{
    public class UpdateGameDto
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public DateTime ReleaseDate { get; set; }

        public string Developer { get; set; }

        public string Publisher { get; set; }

        public double Rating { get; set; }

        public string CategoryName { get; set; }

        public string? AboutThisGame { get; set; }

        public List<int> PlatformIds { get; set; } = new();

        public List<int> TagIds { get; set; } = new();

        public IFormFile? MainImage { get; set; }
    }
}
