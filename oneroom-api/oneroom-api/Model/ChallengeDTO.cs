using System.ComponentModel.DataAnnotations;

namespace oneroom_api.Model
{
    public class ChallengeDTO
    {
        public int ChallengeId { get; set; }
        public string Title { get; set; }
        public string AppName { get; set; }
        public string ToolName { get; set; }
        public string Config { get; set; }
    }
}
