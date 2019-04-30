using oneroom_api.Model;

namespace oneroom_api.Utilities
{
    public static class TeamUtilities
    {
        public static TeamDto ToDto(this Team team)
        {
            return new TeamDto()
            {
                TeamId = team.TeamId,
                TeamName = team.TeamName,
                Description = team.Description,
                TeamColor = team.TeamColor,
                CreationDate = team.CreationDate,
                Users = team.Users,
                Challenges = team.TeamChallenges?.ConvertAll(tc => tc.Challenge.ToTeamDto(tc.Completed))
            };
        }
    }
}
