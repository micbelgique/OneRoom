using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace oneroom_api.Hubs
{
    public interface IActionClient
    {
        // leaderboard & dashboard
        Task UpdateUsers();
        // All clients receive automatic configuration
        Task UpdateConfigurations();
    }

    // possible clients
    public enum ClientType
    {
        Leaderboard,
        Dashboard,
        Register
    }

    public class LeaderBoardHub : Hub<IActionClient>
    {
        public LeaderBoardHub()
        {
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }
    }
}
