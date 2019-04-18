using oneroom_api.Model;

namespace oneroom_api.Utilities
{
    public static class ChallengesUtilities
    {
        public static ChallengeDto ToDto(this Challenge challenge)
        {
            return new ChallengeDto()
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

        public static ChallengeTeamDto ToTeamDto(this Challenge challenge, bool completed)
        {
            return new ChallengeTeamDto()
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

        public static Challenge FromDto(this ChallengeDto challengeDto)
        {
            return new Challenge()
            {
                ChallengeId = challengeDto.ChallengeId,
                Title = challengeDto.Title,
                Description = challengeDto.Description,
                AppName = challengeDto.AppName,
                Order = challengeDto.Order,
                TimeBox = challengeDto.TimeBox,
                Hints = challengeDto.Hints,
                Answers = challengeDto.Answers,
                Config = challengeDto.Config
            };
        }
    }
}