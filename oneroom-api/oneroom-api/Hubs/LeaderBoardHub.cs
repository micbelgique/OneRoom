using Microsoft.AspNetCore.SignalR;
using oneroom_api.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace oneroom_api.Hubs
{
    public interface ILeaderBoardClient
    {
        Task UpdateUsers( User u);
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
