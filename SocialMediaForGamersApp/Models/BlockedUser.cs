namespace SocialMediaForGamersApp.Models
{
    public class BlockedUser : BaseEntity
    {
        public int BlockerId { get; set; }
        public User Blocker { get; set; }
        public int BlockedUserId { get; set; }
        public User Blocked { get; set; }
    }
}
