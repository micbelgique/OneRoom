using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
            return await _context.Challenges.Select(c => c.ToDTO())
                                            .ToListAsync();
        }

        // GET: api/Scenarios/5/Challenges
        [HttpGet("~/api/Scenarios/{ScenarioId}/Challenges")]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<IEnumerable<ChallengeDTO>>>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<IEnumerable<ChallengeDTO>>> GetChallengesByScenario(int ScenarioId)
        {
            if(!ScenarioExists(ScenarioId)) return NotFound("There is no scenario with id:" + ScenarioId);

            List<ChallengeDTO> challenges = await _context.Challenges.Include(c => c.ScenarioChallenges)
                                                                     .Where(c => c.ScenarioChallenges.Any(sc => sc.ScenarioId == ScenarioId))
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

        // POST: api/Scenarios/5/Challenges
        [HttpPost("~/api/Scenarios/{ScenarioId}/Challenges")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<ActionResult> AddChallengeInScenario( int ScenarioId, [FromBody] Challenge[] challenges)
        {
            Scenario Scenario = await _context.Scenarios.Include(s => s.ScenarioChallenges)
                                              .SingleOrDefaultAsync(s => s.ScenarioId == ScenarioId);

            if (Scenario == null) return NotFound("There is no scenario with id:" + ScenarioId);

            foreach( Challenge challenge in challenges)
            {
                Scenario.ScenarioChallenges.Add(new ScenarioChallenge { Scenario = Scenario, Challenge = _context.Challenges.Find(challenge.ChallengeId) });
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
            var challenge = await _context.Challenges.Include(c => c.ScenarioChallenges)
                                                     .SingleOrDefaultAsync(c => c.ChallengeId == id);
            if (challenge == null)
            {
                return NotFound();
            }

            if (challenge.ScenarioChallenges.Count() != 0) return Conflict("This Challenge is still used in at least one Game!");
            
            _context.Challenges.Remove(challenge);
            await _context.SaveChangesAsync();

            return challenge;
        }

        // DELETE: api/Scenarios/5/Challenges
        [HttpDelete("~/api/Scenarios/{ScenarioId}/Challenges")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<ActionResult> DeleteChallengeInScenario(int ScenarioId, [FromBody] Challenge[] challenges)
        {
            Scenario Scenario = await _context.Scenarios.Include(s => s.ScenarioChallenges)
                                                            .ThenInclude(sc => sc.Challenge)
                                                        .SingleOrDefaultAsync(s => s.ScenarioId == ScenarioId);

            if (Scenario == null) return NotFound("There is no scenario with id:" + ScenarioId);

            Scenario.ScenarioChallenges.RemoveAll(sc => challenges.Contains(sc.Challenge));

            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ChallengeExists(int id)
        {
            return _context.Challenges.Any(e => e.ChallengeId == id);
        }

        private bool ScenarioExists(int id)
        {
            return _context.Scenarios.Any(e => e.ScenarioId == id);
        }
    }
}
