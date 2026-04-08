using System.Text.Json.Serialization;

namespace SocialMediaForGamersApp.Models
{
    public class Category : BaseEntity
    {
        public string Name { get; set; }
        public IEnumerable<Game> Games { get; set; }
    }
}
