using Microsoft.AspNetCore.SignalR;
using oneroom_api.Model;
using System.Threading.Tasks;

namespace oneroom_api.Hubs
{
    public interface IUserClient
    {
        Task GetNewUser(User u);
    }

    public class UsersHub : Hub
    {
        public Task SendNewUser(User user)
        {
            return Clients.All.SendAsync("GetNewUser", user);
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }
    }
}
