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
    public class ScenariosController : ControllerBase
    {
        private readonly OneRoomContext _context;

        public ScenariosController(OneRoomContext context)
        {
            _context = context;
        }

        // GET: api/Scenarios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Scenario>>> GetScenarios()
        {
            return await _context.Scenarios.ToListAsync();
        }

        // GET: api/Scenarios/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Scenario>> GetScenario(int id)
        {
            var scenario = await _context.Scenarios.FindAsync(id);

            if (scenario == null)
            {
                return NotFound();
            }

            return scenario;
        } 

        // POST: api/Scenarios
        [HttpPost]
        public async Task<ActionResult<Scenario>> PostScenario(Scenario scenario)
        {
            _context.Scenarios.Add(scenario);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetScenario", new { id = scenario.ScenarioId }, scenario);
        }

        // POST: api/Games/5/Scenario
        [HttpPost("~/api/Games/{GameId}/Scenario")]
        public async Task<ActionResult<Scenario>> SetScenarioToGame( int GameId, Scenario scenario)
        {
            var game = await _context.Games.SingleOrDefaultAsync(g => g.GameId == GameId);

            game.Scenario = scenario;

            _context.Entry(game).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetScenario", new { id = scenario.ScenarioId }, scenario);
        }

        // DELETE: api/Scenarios/5
        [HttpDelete("{id}")]
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
        public async Task<ActionResult<Scenario>> DeleteScenarioFromGame( int GameId)
        {
            var game = await _context.Games.Include(g => g.Scenario)
                                         .SingleOrDefaultAsync(g => g.GameId == GameId);
            if (game?.Scenario == null)
            {
                return NotFound();
            }

            _context.Scenarios.Remove(game.Scenario);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ScenarioExists(int id)
        {
            return _context.Scenarios.Any(e => e.ScenarioId == id);
        }
    }
}
