namespace SocialMediaForGamersApp.DTOs.Comment
{
    public class CreateCommentDto
    {
        public string Content { get; set; }
        public bool IsPositive { get; set; }
        public int GameId { get; set; }
        public int UserId { get; set; }
    }
}
