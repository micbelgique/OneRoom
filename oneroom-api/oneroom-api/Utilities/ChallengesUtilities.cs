using oneroom_api.Model;

namespace oneroom_api.Utilities
{
    public static class ChallengesUtilities
    {
        public static ChallengeDTO ToDTO(this Challenge challenge)
        {
            return new ChallengeDTO()
            {
                ChallengeId = challenge.ChallengeId,
                Title = challenge.Title,
                AppName = challenge.AppName,
                ToolName = challenge.ToolName,
                Config = challenge.Config
            };
        }
    }
}