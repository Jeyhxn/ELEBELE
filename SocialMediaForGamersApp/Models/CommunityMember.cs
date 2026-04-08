namespace SocialMediaForGamersApp.Models
{
    public class CommunityMember : BaseEntity
    {
        public int CommunityId { get; set; }
        public Community Community { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
