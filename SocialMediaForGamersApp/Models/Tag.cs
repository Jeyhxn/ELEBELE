using System.Text.Json.Serialization;

namespace SocialMediaForGamersApp.Models
{
    public class Tag : BaseEntity
    {
        public string Name { get; set; }

        [JsonIgnore]
        public List<GameTag> GameTags { get; set; }
    }
}
