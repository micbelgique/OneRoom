﻿using Microsoft.AspNetCore.SignalR;
using oneroom_api.Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace oneroom_api.Hubs
{
    public interface IActionClient
    {
        // User is in front of the cameras
        Task HighlightUser(Guid userId);
        // When users added or deleted
        Task UpdateUsers(List<User> users);
        //
        Task CreateUser(User u);
        //
        Task UpdateUser(User u);
        // 
        Task DeleteUser(User u);
        //
        Task UpdateTeams( IEnumerable<Team> teams);
        //
        Task DeleteTeams(int gameID);
        // All clients receive automatic configuration when changed
        Task UpdateConfigurations();
        // When game state changed
        Task UpdateGameState(int gameId);
        // when game deleted or updated
        Task UpdateGame(int gameId);
        Task JoinGroupAsync(string groupName);
        Task LeaveGroupAsync(string groupName);
    }

    public class OneHub : Hub<IActionClient>
    {
        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }

        public async Task JoinGroupAsync(string groupName) => await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

        public async Task LeaveGroupAsync(string groupName) => await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

        // todo : groups 
    }
}
