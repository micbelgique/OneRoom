using System.Collections.Generic;

namespace oneroom_api.Model
{
    /*
    * ScenarioChallenge class to handle the many to many relation ship 
    * between Scenario and Challenge is in Challenge.cs
    */
    public class Scenario
    {
        public int ScenarioId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

        public List<Game> Games { get; set; } = new List<Game>();

        public List<ScenarioChallenge> ScenarioChallenges { get; set; } = new List<ScenarioChallenge>();
    }
}
