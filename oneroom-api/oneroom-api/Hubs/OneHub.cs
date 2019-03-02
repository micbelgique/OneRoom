using Microsoft.AspNetCore.SignalR;
using oneroom_api.Model;
using System;
using System.Threading.Tasks;

namespace oneroom_api.Hubs
{
    public interface IActionClient
    {
        // User is in front of the cameras
        Task HighlightUser(Guid userId);
        // When user added or deleted
        Task UpdateUsers();
        Task UpdateTeams();
        // All clients receive automatic configuration
        Task UpdateConfigurations();
        // When game state changed
        Task UpdateGameState();
        // when game deleted or updated
        Task UpdateGame();
    }

    // possible clients
    public enum ClientType
    {
        Leaderboard,
        Dashboard,
        Register
    }

    public class OneHub : Hub<IActionClient>
    {
        public OneHub()
        {
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }



        // todo : groups 
    }
}
