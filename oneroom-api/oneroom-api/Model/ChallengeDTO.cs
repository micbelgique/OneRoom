using System.ComponentModel.DataAnnotations;

namespace oneroom_api.Model
{
    public class ChallengeDTO
    {
        public int ChallengeId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        [Url]
        public string UrlDocumentation { get; set; }
    }
}
