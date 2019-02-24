using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace oneroom_api.Hubs
{
    public interface ILeaderBoardClient
    {
        Task UpdateUsers();
    }

    public class LeaderBoardHub : Hub<ILeaderBoardClient>
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
