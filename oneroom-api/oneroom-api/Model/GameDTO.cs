using System;
using System.Collections.Generic;

namespace oneroom_api.Model
{
    public class GameDto
    {
        public int GameId { get; set; }
        public string GroupName { get; set; }
        public DateTime CreationDate { get; set; } = DateTime.Now;
        public List<User> Users { get; set; } = new List<User>();
        public List<Team> Teams { get; set; } = new List<Team>();
        public State State { get; set; } = State.REGISTER;
        public Configuration Config { get; set; } = new Configuration();
        public ScenarioDto Scenario { get; set; }
    }
}
