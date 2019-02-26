using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using oneroom_api.Hubs;
using oneroom_api.Model;


// TODO : add put and send signal to update config if changed


namespace oneroom_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GamesController : ControllerBase
    {
        private readonly OneRoomContext _context;
        private readonly IHubContext<LeaderBoardHub, IActionClient> _hubClients;

        public GamesController(OneRoomContext context, IHubContext<LeaderBoardHub, IActionClient> hubClients)
        {
            _context = context;
            _hubClients = hubClients;
        }


        // GET: api/Games
        [HttpGet]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<IEnumerable<Game>>>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<IEnumerable<Game>>> GetGames()
        {
            return await _context.Games.ToListAsync();
        }

        // GET: api/Games/5
        [HttpGet("{groupName}")]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<Game>>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<Game>> GetGame(String groupName)
        {
            var game = await _context.Games.Where(g => g.GroupName.Equals(groupName))
                                           .SingleOrDefaultAsync();

            if (game == null)
            {
                return NotFound();
            }

            // add client to group hub
            await _hubClients.Groups.AddToGroupAsync(ControllerContext.HttpContext.Connection.Id, groupName);

            return game;
        }

        // POST: api/Games
        [HttpPost("{groupName}")]
        [ProducesResponseType(201, Type = typeof(Task<ActionResult<Game>>))]
        [ProducesResponseType(404)]
        [ProducesResponseType(409)]
        public async Task<ActionResult<Game>> CreateGame(string groupName)
        {
            Game game = new Game(groupName);
            _context.Games.Add(game);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return Conflict("Game Already Exists");
            }

            return CreatedAtAction("GetGame", new { id = game.GameId }, game);
        }

        // DELETE: api/Games/5
        [HttpDelete("{groupName}")]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<Game>>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<Game>> DeleteGame(String groupName)
        {
            var game = await _context.Games.Where(g => g.GroupName.Equals(groupName))
                                           .SingleOrDefaultAsync();
            if (game == null)
            {
                return NotFound();
            }

            _context.Games.Remove(game);
            await _context.SaveChangesAsync();

            return game;
        }

        private bool GameExists(int id)
        {
            return _context.Games.Any(e => e.GameId == id);
        }
    }
}
