using oneroom_api.Model;

namespace oneroom_api.Utilities
{
    public static class GameUtilities
    {
        public static GameDTO ToDTO(this Game game)
        {
            return new GameDTO()
            {
                GameId = game.GameId,
                GroupName = game.GroupName,
                CreationDate = game.CreationDate,
                Users = game.Users,
                Teams = game.Teams,
                State = game.State,
                Config = game.Config,
                Scenario = game.Scenario?.ToDTO()

            };
        }
    }
}
