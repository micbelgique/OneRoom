using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace oneroom_api.Model
{
    public class Game
    {
        public int GameId { get; set; }
        [Required]
        public string GroupName { get; set; }
        public DateTime CreationDate { get; set; } = DateTime.Now;
        public List<User> Users { get; set; } = new List<User>();
        public List<Team> Teams { get; set; } = new List<Team>();
        public State State { get; set; } = State.REGISTER;

        public Game(string groupName)
        {
            GroupName = groupName;
        }
    }
    public enum State
    {
        REGISTER,
        LAUNCH,
        END
    }
}
