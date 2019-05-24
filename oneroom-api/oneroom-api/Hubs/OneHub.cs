using Microsoft.AspNetCore.SignalR;
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
        Task UpdateTeams( IEnumerable<TeamDto> teams);
        //
        Task DeleteTeams(int gameId);
        // All clients receive automatic configuration when changed
        Task UpdateConfigurations();
        // When game state changed
        Task UpdateGameState(State state);
        // when game deleted or updated
        Task UpdateGame(int gameId);
        // Wwhen a challenge is completed by a team
        Task HasCompletedChallenge(int teamId, int challengeId);
        Task FinishGame(int teamId);
    }

    public class OneHub : Hub<IActionClient>
    {
        public override async Task OnConnectedAsync()
        {
            Console.WriteLine(Context.ConnectionId);
            await base.OnConnectedAsync();
        }

        public async Task JoinGroupAsync(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        }

        public async Task LeaveGroupAsync(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        }
    }
}
