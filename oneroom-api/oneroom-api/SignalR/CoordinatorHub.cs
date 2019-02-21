using Microsoft.AspNetCore.SignalR;
using oneroom_api.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace oneroom_api.SignalR
{
    public class CoordinatorHub : Hub
    {
        public Task SendNewUser(User user)
        {
            return Clients.All.SendAsync("GetNewUser", user);
        }
    }
}
