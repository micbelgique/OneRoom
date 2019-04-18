using System.Collections.Generic;
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
    public class ScenariosController : ControllerBase
    {
        private readonly OneRoomContext _context;

        public ScenariosController(OneRoomContext context)
        {
            _context = context;
        }

        // GET: api/Scenarios
        [HttpGet]
        [ProducesResponseType(200,Type = typeof(Task<ActionResult<IEnumerable<ScenarioDto>>>))]
        public async Task<ActionResult<IEnumerable<ScenarioDto>>> GetScenarios()
        {
            return await _context.Scenarios.Include(s => s.ScenarioChallenges)
                                              .ThenInclude(sc =>  sc.Challenge)
                                           .Select(s => s.ToDto())
                                           .ToListAsync();
        }

        // GET: api/Scenarios/5
        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<ScenarioDto>>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<ScenarioDto>> GetScenario(int id)
        {
            var scenario = await _context.Scenarios.Include(s => s.ScenarioChallenges)
                                                      .ThenInclude(sc => sc.Challenge)
                                                   .SingleOrDefaultAsync(s => s.ScenarioId == id);

            if (scenario == null)
            {
                return NotFound();
            }

            return scenario.ToDto();
        }

        // POST: api/Scenarios
        [HttpPost]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<Scenario>>))]
        [ProducesResponseType(409)]
        public async Task<ActionResult<Scenario>> PostScenario(Scenario scenario)
        {
            var sc = await _context.Scenarios.FindAsync(scenario.ScenarioId);
            if (sc != null) return Conflict("Scenario already exist");
            _context.Scenarios.Add(scenario);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetScenario", new { id = scenario.ScenarioId }, scenario);
        }

        // POST: api/Games/5/Scenario
        [HttpPost("~/api/Games/{GameId}/Scenario")]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<Scenario>>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<Scenario>> SetScenarioToGame( int gameId, Scenario scenario)
        {
            var game = await _context.Games.SingleOrDefaultAsync(g => g.GameId == gameId);
            if (game == null)
            {
                return NotFound("game not found");
            }

            var scenarioContext = await _context.Scenarios.FindAsync(scenario.ScenarioId);
            if (scenarioContext == null)
            {
                return NotFound("scenario not found");
            }

            game.Scenario = scenarioContext;

            _context.Entry(game).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetScenario", new { id = scenarioContext.ScenarioId }, scenarioContext);
        }

        // DELETE: api/Scenarios/5
        [HttpDelete("{id}")]
        [ProducesResponseType(200,Type = typeof(Task<ActionResult<Scenario>>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<Scenario>> DeleteScenario(int id)
        {
            var scenario = await _context.Scenarios.FindAsync(id);
            if (scenario == null)
            {
                return NotFound();
            }

            _context.Scenarios.Remove(scenario);
            await _context.SaveChangesAsync();

            return scenario;
        }

        // DELETE: api/Games/5/Scenario
        [HttpDelete("~/api/Games/{GameId}/Scenario")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<Scenario>> DeleteScenarioFromGame( int gameId)
        {
            var game = await _context.Games.Include(g => g.Scenario)
                                         .SingleOrDefaultAsync(g => g.GameId == gameId);
            if (game?.Scenario == null)
            {
                return NotFound();
            }

            game.Scenario = null;
            _context.Entry(game).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
