namespace SocialMediaForGamersApp.DTOs.Post
{
    public class CreatePostCommentDto
    {
        public string Content { get; set; }
        public int PostId { get; set; }
        public int UserId { get; set; }
        public int? ParentCommentId { get; set; }
    }
}
