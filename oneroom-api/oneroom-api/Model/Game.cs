﻿using System;
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
        // All users for the game
        public List<User> Users { get; set; } = new List<User>();
        // Team containing users
        public List<Team> Teams { get; set; } = new List<Team>();

        // (optional) required for automatic configuration of clients
        public Configuration Config { get; set; }


        public Game(string groupName)
        {
            GroupName = groupName;
        }
    }
}
