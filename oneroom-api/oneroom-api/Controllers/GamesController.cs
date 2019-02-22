using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using oneroom_api.Model;

namespace oneroom_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GamesController : ControllerBase
    {
        private readonly OneRoomContext _context;

        public GamesController(OneRoomContext context)
        {
            _context = context;
        }

        // GET: api/Games
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Game>>> GetGame()
        {
            return await _context.Games.ToListAsync();
        }

        // GET: api/Games/5
        [HttpGet("{groupName}")]
        public async Task<ActionResult<Game>> GetGame(String groupName)
        {
            var game = await _context.Games.Where(g => g.GroupName.Equals(groupName))
                                           .SingleOrDefaultAsync();

            if (game == null)
            {
                return NotFound();
            }

            return game;
        }

        // POST: api/Games
        [HttpPost("{groupName}")]
        public async Task<ActionResult<Game>> CreateGame(String groupName)
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
