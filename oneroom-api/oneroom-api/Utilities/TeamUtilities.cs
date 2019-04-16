using oneroom_api.Model;

namespace oneroom_api.Utilities
{
    public static class TeamUtilities
    {
        public static TeamDTO ToDTO(this Team team)
        {
            return new TeamDTO()
            {
                TeamId = team.TeamId,
                TeamName = team.TeamName,
                TeamColor = team.TeamColor,
                CreationDate = team.CreationDate,
                Users = team.Users,
                Challenges = team.TeamChallenges?.ConvertAll<ChallengeTeamDTO>(tc => tc.Challenge.ToTeamDTO(tc.Completed))
            };
        }
    }
}
