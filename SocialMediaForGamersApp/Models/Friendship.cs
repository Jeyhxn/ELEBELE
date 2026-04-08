namespace SocialMediaForGamersApp.Models
{
    public class Friendship : BaseEntity
    {
        public int RequesterId { get; set; }
        public User Requester { get; set; }
        public int AddresseeId { get; set; }
        public User Addressee { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, Accepted, Declined
    }
}
