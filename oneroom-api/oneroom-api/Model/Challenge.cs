using System.ComponentModel.DataAnnotations;

namespace oneroom_api.Model
{
    public class Challenge
    {
        public int ChallengeId { get; set; }
        public string Description { get; set; }
        [Url]
        public string URLDocumentation { get; set; }
    }
}
