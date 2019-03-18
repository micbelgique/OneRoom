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
                Description = challenge.Description,
                URLDocumentation = challenge.URLDocumentation
            };
        }
    }
}
