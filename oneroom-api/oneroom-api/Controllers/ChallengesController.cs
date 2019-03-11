using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using oneroom_api.Model;
using oneroom_api.Utilities;

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
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<IEnumerable<ChallengeDTO>>>))]
        public async Task<ActionResult<IEnumerable<ChallengeDTO>>> GetChallenges()
        {
            return await _context.Challenges.Select(c => ChallengesUtilities.ToChallengeDTOMap(c))
                                            .ToListAsync();
        }

        // GET: api/Games/5/Challenges
        [HttpGet("~/api/Games/{GameId}/Challenges")]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<IEnumerable<ChallengeDTO>>>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<IEnumerable<ChallengeDTO>>> GetChallengesByGame(int GameId)
        {
            if(!GameExists(GameId)) return NotFound("There is no game with id:" + GameId);

            List<ChallengeDTO> challenges = await _context.Challenges.Include(c => c.GameChallenges)
                                                                  .Where(c => c.GameChallenges.Any(gc => gc.GameId == GameId))
                                                                  .Select(c => ChallengesUtilities.ToChallengeDTOMap(c))
                                                                  .ToListAsync();

            return challenges;
        }

        // GET: api/Challenges/5
        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<ChallengeDTO>>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<ChallengeDTO>> GetChallenge(int id)
        {
            var challenge = await _context.Challenges.FindAsync(id);

            if (challenge == null)
            {
                return NotFound();
            }

            return ChallengesUtilities.ToChallengeDTOMap(challenge);
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
        [ProducesResponseType(201, Type = typeof(Task<ActionResult<ChallengeDTO>>))]
        public async Task<ActionResult<ChallengeDTO>> PostChallenge(Challenge challenge)
        {
            _context.Challenges.Add(challenge);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetChallenge", new { id = challenge.ChallengeId }, ChallengesUtilities.ToChallengeDTOMap(challenge));
        }

        // POST: api/Games/5/Challenges
        [HttpPost("~/api/Games/{GameId}/Challenges")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<ActionResult> AddChallengeInGame( int GameId, [FromBody] int[] ChallengesId)
        {
            Game game = await _context.Games.Include(c => c.GameChallenges)
                                .Where(g => g.GameId == GameId)
                                .SingleOrDefaultAsync();

            if (game == null) return NotFound("There is no game with id:" + GameId);

            foreach( int ChallengeId in ChallengesId)
            {
                game.GameChallenges.Add(new GameChallenge { Game = game, Challenge = _context.Challenges.Find(ChallengeId) });
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Challenges/5
        [HttpDelete("{id}")]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<Challenge>>))]
        [ProducesResponseType(404)]
        [ProducesResponseType(409)]
        public async Task<ActionResult<Challenge>> DeleteChallenge(int id)
        {
            var challenge = await _context.Challenges.Include(c => c.GameChallenges)
                                                     .Where(c => c.ChallengeId == id)
                                                     .SingleOrDefaultAsync();
            if (challenge == null)
            {
                return NotFound();
            }

            if (challenge.GameChallenges.Count() != 0) return Conflict("This Challenge is still used in at least one Game!");
            
            _context.Challenges.Remove(challenge);
            await _context.SaveChangesAsync();

            return challenge;
        }

        // DELETE: api/Games/5/Challenges
        [HttpDelete("~/api/Games/{GameId}/Challenges")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<ActionResult> DeleteChallengeInGame(int GameId, [FromBody] int[] ChallengesId)
        {
            Game game = await _context.Games.Include(c => c.GameChallenges)
                                .Where(g => g.GameId == GameId)
                                .SingleOrDefaultAsync();

            if (game == null) return NotFound("There is no game with id:" + GameId);

            game.GameChallenges.RemoveAll(gc => ChallengesId.Contains(gc.ChallengeId));

            await _context.SaveChangesAsync();

            return NoContent();
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
