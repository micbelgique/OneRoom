using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace oneroom_api.Model
{
    public class Scenario
    {
        public int ScenarioId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

        public List<Game> Games { get; set; } = new List<Game>();

        public List<ScenarioChallenge> ScenarioChallenges { get; set; } = new List<ScenarioChallenge>();
    }
}
