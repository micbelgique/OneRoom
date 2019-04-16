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
                AppName = challenge.AppName,
                Order = challenge.Order,
                TimeBox = challenge.TimeBox,
                Hints = challenge.Hints,
                Answers = challenge.Answers,
                Config = challenge.Config
            };
        }

        public static ChallengeTeamDTO ToTeamDTO(this Challenge challenge, bool completed)
        {
            return new ChallengeTeamDTO()
            {
                ChallengeId = challenge.ChallengeId,
                Title = challenge.Title,
                Description = challenge.Description,
                AppName = challenge.AppName,
                Order = challenge.Order,
                TimeBox = challenge.TimeBox,
                Hints = challenge.Hints,
                Answers = challenge.Answers,
                Config = challenge.Config,
                Completed = completed
            };
        }

        public static Challenge FromDTO(this ChallengeDTO challengeDTO)
        {
            return new Challenge()
            {
                ChallengeId = challengeDTO.ChallengeId,
                Title = challengeDTO.Title,
                Description = challengeDTO.Description,
                AppName = challengeDTO.AppName,
                Order = challengeDTO.Order,
                TimeBox = challengeDTO.TimeBox,
                Hints = challengeDTO.Hints,
                Answers = challengeDTO.Answers,
                Config = challengeDTO.Config
            };
        }
    }
}