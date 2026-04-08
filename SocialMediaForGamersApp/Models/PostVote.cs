namespace SocialMediaForGamersApp.Models
{
    public class PostVote : BaseEntity
    {
        public bool IsUpvote { get; set; }
        public int PostId { get; set; }
        public Post Post { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
