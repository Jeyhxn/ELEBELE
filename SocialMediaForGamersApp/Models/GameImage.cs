namespace SocialMediaForGamersApp.Models
{
    public class GameImage : BaseEntity
    {
        public string ImageURL { get; set; }

        public int GameId { get; set; }
        public Game Game { get; set; }
    }
}
