namespace SocialMediaForGamersApp.DTOs.Post
{
    public class VoteDto
    {
        public int PostId { get; set; }
        public int UserId { get; set; }
        public bool IsUpvote { get; set; }
    }
}
