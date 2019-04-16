using System.Collections.Generic;

namespace oneroom_api.Model
{
    public class ChallengeDTO
    {
        public int ChallengeId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string AppName { get; set; }
        public int Order { get; set; }
        public int TimeBox { get; set; }
        public List<string> Hints { get; set; }
        public List<string> Answers { get; set; }
        public Dictionary<string, string> Config { get; set; }
    }
}
