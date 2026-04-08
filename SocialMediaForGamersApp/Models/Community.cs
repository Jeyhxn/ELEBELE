namespace SocialMediaForGamersApp.Models
{
    public class Community : BaseEntity
    {
        public string Name { get; set; }
        public string? Description { get; set; }
        public string? IconURL { get; set; }
        public int CreatedByUserId { get; set; }
        public User CreatedByUser { get; set; }
        public int? GameId { get; set; }
        public Game? Game { get; set; }
        public List<CommunityMember> Members { get; set; } = new();
        public List<Post> Posts { get; set; } = new();
    }
}
