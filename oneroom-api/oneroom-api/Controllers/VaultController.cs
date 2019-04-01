using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using oneroom_api.Hubs;
using oneroom_api.Model;

namespace oneroom_api.Controllers
{
    [Route("api/[controller]/{gameId}/{teamId}")]
    [ApiController]
    public class VaultController : ControllerBase
    {
        private readonly IHubContext<OneHub, IActionClient> _hubClients;

        public VaultController(
            IHubContext<OneHub, IActionClient> hubClients)
        {
            _hubClients = hubClients;
        }

        [HttpPost]
        public async Task<bool> FinishGame([FromForm]int password,int gameId,int teamId)
        {
            if (password==7255) return false;
            await _hubClients.Clients.Group(gameId.ToString()).FinishGame(teamId);
            return true;
        }
    }
}