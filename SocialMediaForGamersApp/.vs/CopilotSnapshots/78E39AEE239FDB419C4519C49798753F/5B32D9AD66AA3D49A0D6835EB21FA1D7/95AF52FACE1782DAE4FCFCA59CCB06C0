using System.Text.Json.Serialization;

namespace SocialMediaForGamersApp.Models
{
    public class GamePlatform : BaseEntity
    {
        public int GameId { get; set; }

        [JsonIgnore]
        public Game Game { get; set; }

        public int PlatformId { get; set; }

        public Platform Platform { get; set; }
    }
}
