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
        private readonly IHubContext<OneHub, IActionClient> _hubClients;

        public GamesController(OneRoomContext context, IHubContext<OneHub, IActionClient> hubClients)
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
            // return config to select it
            return await _context.Games.Include(g => g.Config)
                                       .ToListAsync();
        }

        // GET: api/Games/groupName
        [HttpGet("{groupName}")]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<Game>>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<Game>> GetGame(string groupName)
        {
            var game = await _context.Games.Include(g => g.Users)
                                           .Include(g => g.Teams)
                                           .Include(g => g.Config)
                                           .SingleOrDefaultAsync(g => g.GroupName.Equals(groupName));

            if (game == null)
            {
                return NotFound();
            }

            return game;
        }

        // GET api/Games/groupName/State
        [HttpGet("{groupName}/State")]
        [ProducesResponseType(200, Type = typeof(Task<State>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<State>> GetStateGame(string groupName)
        {
            var game = await (from e in _context.Games where e.GroupName == groupName select e).FirstOrDefaultAsync();
            if (game != null)
                return game.State;
            else
                return NotFound();
        }

        // POST api/Games/groupName/NextState
        [HttpPost("{groupName}/SwitchState/{newState}")]
        [ProducesResponseType(200, Type =typeof(Task<State>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<State>> SwitchState(string groupName, State newState)
        {
            var game = await _context.Games.Where( e => e.GroupName == groupName).Include(g => g.Teams).FirstOrDefaultAsync();
            if (game != null)
            {
                game.State = newState;

                if (newState.Equals(State.REGISTER))
                {
                    // TODO : delete teams
                    // game.Teams.Clear();
                }

                _context.Entry(game).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                // update state clients
                await _hubClients.Clients.Group(game.GameId.ToString()).UpdateGameState(game.GameId);

                /*if (newState.Equals(State.REGISTER))
                    await _hubClients.Clients.Group(game.GameId.ToString()).DeleteTeams(game.GameId);*/

                return game.State;
            }
            else
                return NotFound();
        }

        // POST: api/Games
        [HttpPost]
        [ProducesResponseType(201, Type = typeof(Task<ActionResult<Game>>))]
        [ProducesResponseType(404)]
        [ProducesResponseType(409)]
        public async Task<ActionResult<Game>> CreateGame(Game game)
        {
            if(game == null)
            {
                return BadRequest();
            }
            
            _context.Games.Add(game);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return Conflict("Game Already Exists");
            }

            return CreatedAtAction("GetGame", new { game.GroupName }, game);
        }

        // DELETE: api/Games/groupName
        [HttpDelete("{groupName}")]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<Game>>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<Game>> DeleteGame(string groupName)
        {
            var game = await _context.Games.SingleOrDefaultAsync(g => g.GroupName.Equals(groupName));
            if (game == null)
            {
                return NotFound();
            }

            _context.Games.Remove(game);
            await _context.SaveChangesAsync();
            // update clients
            // await _hubClients.Clients.Group(groupName).UpdateGame();
            await _hubClients.Clients.Group(game.GameId.ToString()).UpdateGame(game.GameId);

            return game;
        }

        private bool GameExists(int id)
        {
            return _context.Games.Any(e => e.GameId == id);
        }
    }
}
