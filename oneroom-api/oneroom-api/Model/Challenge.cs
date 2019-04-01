using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

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

    public class Challenge
    {
        public int ChallengeId { get; set; }
        public string Title { get; set; }
        public string AppName { get; set; }
        public string ToolName { get; set; }
        /* a Json string who contains all the critical informations */
        public string Config { get; set; }

        public List<ScenarioChallenge> ScenarioChallenges { get; set; } = new List<ScenarioChallenge>();

        public override bool Equals(object obj)
        {
            var challenge = obj as Challenge;
            return challenge != null &&
                   ChallengeId == challenge.ChallengeId;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(ChallengeId);
        }
    }
}
