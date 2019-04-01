using oneroom_api.Model;
using System.Collections.Generic;

namespace oneroom_api.Utilities
{
    public static class ScenarioUtilities
    {
        public static ScenarioDTO ToDTO(this Scenario scenario)
        {
            return new ScenarioDTO()
            {
                ScenarioId = scenario.ScenarioId,
                Title = scenario.Title,
                Description = scenario.Description
            };
        }
    }
}
