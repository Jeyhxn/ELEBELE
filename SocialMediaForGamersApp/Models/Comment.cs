namespace SocialMediaForGamersApp.Models
{
    public class Comment : BaseEntity
    {
        public string Content { get; set; }
        public bool IsPositive { get; set; }

        public int GameId { get; set; }
        public Game Game { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }
    }
}
