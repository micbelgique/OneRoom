using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using oneroom_api.Hubs;
using oneroom_api.Model;

namespace oneroom_api.Controllers
{
    [Route("api/[controller]/{gameId}/{teamId}")]
    [ApiController]
    public class VaultController : ControllerBase
    {
        private readonly OneRoomContext _context;
        private readonly IHubContext<OneHub, IActionClient> _hubClients;

        public VaultController(
            OneRoomContext context,
            IHubContext<OneHub, IActionClient> hubClients)
        {
            _context = context;
            _hubClients = hubClients;
        }

        [HttpGet]
        public async void FinishGame(int teamId,int gameId)
        {
            await _hubClients.Clients.Group(gameId.ToString()).FinishGame(teamId);
        }
    }
}