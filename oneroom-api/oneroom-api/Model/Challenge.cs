﻿using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace oneroom_api.Model
{
    // Many to Many manual pattern
    // See here : https://docs.microsoft.com/en-us/ef/core/modeling/relationships#many-to-many
    public class GameChallenge
    {
        public int GameId { get; set; }
        public Game Game { get; set; }

        public int ChallengeId { get; set; }
        public Challenge Challenge { get; set; }
    }

    public class Challenge
    {
        public int ChallengeId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        [Url]
        public string URLDocumentation { get; set; }

        public List<GameChallenge> GameChallenges { get; set; } = new List<GameChallenge>();
    }
}