﻿using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using oneroom_api.data;
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
            return await _context.Challenges.Select(c => c.ToDTO())
                                            .ToListAsync();
        }

        // GET: api/Games/5/Challenges
        [HttpGet("~/api/Games/{GameId}/Challenges")]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<IEnumerable<ChallengeDTO>>>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<IEnumerable<ChallengeDTO>>> GetChallengesByGame(int gameId)
        {
            if(!GameExists(gameId)) return NotFound("There is no game with id:" + gameId);

            List<ChallengeDTO> challenges = await _context.Challenges.Include(c => c.GameChallenges)
                                                                     .Where(c => c.GameChallenges.Any(gc => gc.GameId == gameId))
                                                                     .Select(c => c.ToDTO())
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

            return challenge.ToDTO();
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

            return CreatedAtAction("GetChallenge", new { id = challenge.ChallengeId }, challenge.ToDTO());
        }

        // POST: api/Games/5/Challenges
        [HttpPost("~/api/Games/{GameId}/Challenges")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<ActionResult> AddChallengeInGame( int gameId, [FromBody] Challenge[] challenges)
        {
            Game game = await _context.Games.Include(c => c.GameChallenges)
                                            .SingleOrDefaultAsync(g => g.GameId == gameId);

            if (game == null) return NotFound("There is no game with id:" + gameId);

            foreach( Challenge challenge in challenges)
            {
                game.GameChallenges.Add(new GameChallenge { Game = game, Challenge = _context.Challenges.Find(challenge.ChallengeId) });
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
                                                     .SingleOrDefaultAsync(c => c.ChallengeId == id);
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
        public async Task<ActionResult> DeleteChallengeInGame(int gameId, [FromBody] Challenge[] challenges)
        {
            Game game = await _context.Games.Include(c => c.GameChallenges)
                                                .ThenInclude(gc => gc.Challenge)
                                            .SingleOrDefaultAsync(g => g.GameId == gameId);

            if (game == null) return NotFound("There is no game with id:" + gameId);

            game.GameChallenges.RemoveAll(gc => challenges.Contains(gc.Challenge));

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
