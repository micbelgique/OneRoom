using oneroom_api.Model;

namespace oneroom_api.Utilities
{
    public static class ScenarioUtilities
    {
        public static ScenarioDto ToDto(this Scenario scenario)
        {
            return new ScenarioDto()
            {
                ScenarioId = scenario.ScenarioId,
                Title = scenario.Title,
                Description = scenario.Description
            };
        }
    }
}
