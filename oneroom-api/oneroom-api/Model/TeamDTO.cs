using System;
using System.Collections.Generic;

namespace oneroom_api.Model
{
    public class TeamDto
    {
        public int TeamId { get; set; }
        public string TeamName { get; set; }
        public string Description { get; set; }
        public string TeamColor { get; set; }
        public DateTime CreationDate { get; set; } = DateTime.Now;
        public List<User> Users { get; set; } = new List<User>();
        public List<ChallengeTeamDto> Challenges { get; set; } = new List<ChallengeTeamDto>();
    }
}
