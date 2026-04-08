namespace SocialMediaForGamersApp.Models
{
    public class Notification : BaseEntity
    {
        public string Type { get; set; }
        public string Message { get; set; }
        public bool IsRead { get; set; } = false;
        public int UserId { get; set; }
        public User User { get; set; }
        public int? PostId { get; set; }
        public Post? Post { get; set; }
        public int? CommentId { get; set; }
        public PostComment? Comment { get; set; }
    }
}
