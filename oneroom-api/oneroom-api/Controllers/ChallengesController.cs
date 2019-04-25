using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using oneroom_api.Model;
using oneroom_api.Utilities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using oneroom_api.data;
using System;
using Microsoft.AspNetCore.SignalR;
using oneroom_api.Hubs;

namespace oneroom_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChallengesController : ControllerBase
    {
        private readonly OneRoomContext _context;
        private readonly IHubContext<OneHub, IActionClient> _hubClients;

        public ChallengesController(OneRoomContext context, IHubContext<OneHub, IActionClient> hubClients)
        {
            _context = context;
            _hubClients = hubClients;
        }

        // GET: api/Challenges
        [HttpGet]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<IEnumerable<ChallengeDto>>>))]
        public async Task<ActionResult<IEnumerable<ChallengeDto>>> GetChallenges()
        {
            return await _context.Challenges.Select(c => c.ToDto())
                                            .ToListAsync();
        }

        // GET: api/Scenarios/5/Challenges
        [HttpGet("~/api/Scenarios/{ScenarioId}/Challenges")]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<IEnumerable<ChallengeDto>>>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<IEnumerable<ChallengeDto>>> GetChallengesByScenario(int scenarioId)
        {
            if (!ScenarioExists(scenarioId)) return NotFound("There is no scenario with id:" + scenarioId);

            List<ChallengeDto> challenges = await _context.Challenges.Include(c => c.ScenarioChallenges)
                                                                     .Where(c => c.ScenarioChallenges.Any(sc => sc.ScenarioId == scenarioId))
                                                                     .Select(c => c.ToDto())
                                                                     .ToListAsync();

            return challenges;
        }

        // GET: api/Challenges/5
        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<ChallengeDto>>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<ChallengeDto>> GetChallenge(int id)
        {
            Challenge challenge = await _context.Challenges.FindAsync(id);

            if (challenge == null)
            {
                return NotFound();
            }

            return challenge.ToDto();
        }

        // PUT: api/Challenges/5
        [HttpPut("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
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
        [ProducesResponseType(201, Type = typeof(Task<ActionResult<ChallengeDto>>))]
        public async Task<ActionResult<ChallengeDto>> PostChallenge(ChallengeDto challengeDto)
        {
            Challenge challenge = _context.Challenges.Add(challengeDto.FromDto()).Entity;
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetChallenge", new { id = challenge.ChallengeId }, challenge.ToDto());
        }

        // POST: api/Games/5/Teams/6/Challenges
        [HttpPost("~/api/Games/{GameId}/Teams/{TeamId}/Challenge/{ChallengeId}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<ActionResult> SetChallengeCompleted(int GameId, int TeamId, int ChallengeId)
        {
            Team team = await _context.Teams.Include(t => t.TeamChallenges)
                                            .SingleOrDefaultAsync(t => t.GameId == GameId && t.TeamId == TeamId);

            if (team == null) return NotFound("There is no team with id:" + TeamId + ". Or the game with id:" + GameId + " doesn't exist.");

            try
            {
                team.TeamChallenges.SingleOrDefault(tc => tc.ChallengeId == ChallengeId).Completed = true;                
            } catch (NullReferenceException)
            {
                return NotFound("There is no challenge with id:" + ChallengeId);
            }

            await _context.SaveChangesAsync();
            await _hubClients.Clients.Group(GameId.ToString()).HasCompletedChallenge(TeamId, ChallengeId);

            return NoContent();
        }

        // POST: api/Scenarios/5/Challenges
        [HttpPost("~/api/Scenarios/{ScenarioId}/Challenges")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<ActionResult> AddChallengeInScenario(int scenarioId, [FromBody] Challenge[] challenges)
        {
            Scenario scenario = await _context.Scenarios.Include(s => s.ScenarioChallenges)
                                              .SingleOrDefaultAsync(s => s.ScenarioId == scenarioId);

            if (scenario == null) return NotFound("There is no scenario with id:" + scenarioId);

            foreach (Challenge challenge in challenges)
            {
                scenario.ScenarioChallenges.Add(new ScenarioChallenge { Scenario = scenario, Challenge = _context.Challenges.Find(challenge.ChallengeId) });
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Challenges/5
        [HttpDelete("{id}")]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<ChallengeDto>>))]
        [ProducesResponseType(404)]
        [ProducesResponseType(409)]
        public async Task<ActionResult<ChallengeDto>> DeleteChallenge(int id)
        {
            Challenge challenge = await _context.Challenges.Include(c => c.ScenarioChallenges)
                                                           .SingleOrDefaultAsync(c => c.ChallengeId == id);
            if (challenge == null)
            {
                return NotFound("There is no challenge with id:" + id);
            }

            if (challenge.ScenarioChallenges.Count() != 0) return Conflict("The Challenge \"" + challenge.Title + "\" is still used in at least one scenario!");

            _context.Challenges.Remove(challenge);
            await _context.SaveChangesAsync();

            return challenge.ToDto();
        }

        // DELETE: api/Scenarios/5/Challenges
        [HttpDelete("~/api/Scenarios/{ScenarioId}/Challenges")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<ActionResult> DeleteChallengeInScenario(int scenarioId, [FromBody] Challenge[] challenges)
        {
            Scenario scenario = await _context.Scenarios.Include(s => s.ScenarioChallenges)
                                                            .ThenInclude(sc => sc.Challenge)
                                                        .SingleOrDefaultAsync(s => s.ScenarioId == scenarioId);

            if (scenario == null) return NotFound("There is no scenario with id:" + scenarioId);

            scenario.ScenarioChallenges.RemoveAll(sc => challenges.Contains(sc.Challenge));

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
