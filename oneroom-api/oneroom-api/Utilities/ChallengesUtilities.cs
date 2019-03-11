using oneroom_api.Model;

namespace oneroom_api.Utilities
{
    public class ChallengesUtilities
    {
        public static ChallengeDTO ToChallengeDTOMap(Challenge challenge)
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
