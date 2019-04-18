using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace oneroom_api.Model
{
    // Many to Many manual pattern
    // See here : https://docs.microsoft.com/en-us/ef/core/modeling/relationships#many-to-many
    public class ScenarioChallenge
    {
        public int ScenarioId { get; set; }
        public Scenario Scenario { get; set; }

        public int ChallengeId { get; set; }
        public Challenge Challenge { get; set; }
    }

    public class TeamChallenge
    {
        public int TeamId { get; set; }
        public Team Team { get; set; }

        public int ChallengeId { get; set; }
        public Challenge Challenge { get; set; }

        public Boolean Completed { get; set; }
    }

    public class Challenge
    {
        public int ChallengeId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string AppName { get; set; }
        public int Order { get; set; }
        public int TimeBox { get; set; }
        public List<string> Hints { get; set; } = new List<string>();
        public List<string> Answers { get; set; } = new List<string>();
        public Dictionary<string, string> Config { get; set; } = new Dictionary<string, string>();

        public List<ScenarioChallenge> ScenarioChallenges { get; set; } = new List<ScenarioChallenge>();
        public List<TeamChallenge> TeamChallenges { get; set; } = new List<TeamChallenge>();

        public override bool Equals(object obj)
        {
            return obj is Challenge challenge &&
                   ChallengeId == challenge.ChallengeId;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(ChallengeId);
        }
    }
}
