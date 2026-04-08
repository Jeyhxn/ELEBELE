namespace SocialMediaForGamersApp.Models
{
    public class PostView
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public int PostId { get; set; }
        public Post Post { get; set; }
        public DateTime ViewedAt { get; set; }
    }
}
