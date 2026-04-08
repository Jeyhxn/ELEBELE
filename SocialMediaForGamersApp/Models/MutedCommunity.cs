namespace SocialMediaForGamersApp.Models
{
    public class MutedCommunity : BaseEntity
    {
        public int UserId { get; set; }
        public User User { get; set; }
        public int CommunityId { get; set; }
        public Community Community { get; set; }
    }
}
