using System.Text.Json.Serialization;

namespace SocialMediaForGamersApp.Models
{
    public class GameTag : BaseEntity
    {
        public int GameId { get; set; }

        [JsonIgnore]
        public Game Game { get; set; }

        public int TagId { get; set; }

        public Tag Tag { get; set; }
    }
}
