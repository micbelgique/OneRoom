using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using oneroom_api.Model;

namespace oneroom_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChallengesController : ControllerBase
    {
        private readonly OneRoomContext _context;

        public ChallengesController(OneRoomContext context)
        {
            _context = context;
        }

        // GET: api/Challenges
        [HttpGet]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<IEnumerable<Challenge>>>))]
        public async Task<ActionResult<IEnumerable<Challenge>>> GetChallenges()
        {
            return await _context.Challenges.ToListAsync();
        }

        // GET: api/Games/5/Challenges
        [HttpGet("~/api/Games/{GameId}/Challenges")]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<IEnumerable<Challenge>>>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<IEnumerable<Challenge>>> GetChallengesByGame(int GameId)
        {
            if(!GameExists(GameId)) return NotFound("There is no game with id:" + GameId);

            return await _context.Challenges.Include(c => c.GameChallenges)
                                            .Where(c => c.GameChallenges.All(gc => gc.GameId == GameId))
                                            .ToListAsync();
        }

        // GET: api/Challenges/5
        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<Challenge>>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<Challenge>> GetChallenge(int id)
        {
            var challenge = await _context.Challenges.FindAsync(id);

            if (challenge == null)
            {
                return NotFound();
            }

            return challenge;
        }

        // PUT: api/Challenges/5
        [HttpPut("{id}")]
        [ProducesResponseType(204)]
        public async Task<IActionResult> PutChallenge(int id, Challenge challenge)
        {
            if (id != challenge.ChallengeId)
            {
                return BadRequest();
            }

            _context.Entry(challenge).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ChallengeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Challenges
        [HttpPost]
        [ProducesResponseType(201, Type = typeof(Task<ActionResult<Challenge>>))]
        public async Task<ActionResult<Challenge>> PostChallenge(Challenge challenge)
        {
            _context.Challenges.Add(challenge);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetChallenge", new { id = challenge.ChallengeId }, challenge);
        }

        // POST: api/Games/5/Challenges
        [HttpPost("~/api/Games/{GameId}/Challenges")]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<IEnumerable<Challenge>>>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<IEnumerable<Challenge>>> AddChallengeInGame( int GameId, [FromBody] int[] ChallengesId)
        {
            Game game = await _context.Games.Include(c => c.GameChallenges)
                                .Where(g => g.GameId == GameId)
                                .SingleOrDefaultAsync();

            if (game == null) return NotFound("There is no game with id:" + GameId);

            foreach( int ChallengeId in ChallengesId)
            {
                game.GameChallenges.Add(new GameChallenge { Game = game, Challenge = _context.Challenges.Find(ChallengesId) });
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetChallengesByGame", new { GameId });
        }

        // DELETE: api/Challenges/5
        [HttpDelete("{id}")]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<Challenge>>))]
        public async Task<ActionResult<Challenge>> DeleteChallenge(int id)
        {
            var challenge = await _context.Challenges.FindAsync(id);
            if (challenge == null)
            {
                return NotFound();
            }

            _context.Challenges.Remove(challenge);
            await _context.SaveChangesAsync();

            return challenge;
        }

        private bool ChallengeExists(int id)
        {
            return _context.Challenges.Any(e => e.ChallengeId == id);
        }

        private bool GameExists(int id)
        {
            return _context.Games.Any(e => e.GameId == id);
        }
    }
}
