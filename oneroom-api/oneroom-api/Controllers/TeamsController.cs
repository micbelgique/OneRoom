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
    public class TeamsController : ControllerBase
    {
        private readonly OneRoomContext _context;

        public TeamsController(OneRoomContext context)
        {
            _context = context;
        }

        // GET: api/Teams
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Team>>> GetTeam()
        {
            return await _context.Teams.Include(t => t.Users)
                                       .ToListAsync();
        }

        // GET: api/Teams/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Team>> GetTeam(int id)
        {
            var team = await _context.Teams.FindAsync(id);

            if (team == null)
            {
                return NotFound();
            }

            return team;
        }

        // POST: api/Teams
        [HttpPost("{numOfTeams}")]
        public async Task<ActionResult<Team>> CreateTeam(int numOfTeams)
        {
            var count = await _context.Teams.CountAsync();
            if (count > 0) return Conflict("Teams are alredy created");

            List<User> users = _context.Users.ToList();
            List<Team> teams = new List<Team>();
            users.Shuffle();
            int nbUserPerTeam = (int)Math.Ceiling((double)users.Count() / numOfTeams);

            for (int i = 0; i<numOfTeams; i++)
            {
                Team team = new Team();
                teams.Add(team);
                try
                {
                    team.Users.AddRange(users.GetRange(0, nbUserPerTeam));
                    users.RemoveRange(0, nbUserPerTeam);
                } catch (ArgumentException)
                {
                    team.Users.AddRange(users);
                }
                _context.Teams.Add(team);
            }
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTeam", teams);
        }

        // DELETE: api/Teams
        [HttpDelete]
        public async Task<ActionResult<List<Team>>> DeleteTeams()
        {
            var teams = await _context.Teams.Include(t => t.Users).ToListAsync();
            if (teams == null)
            {
                return NotFound();
            }

            _context.Teams.RemoveRange(teams);
            await _context.SaveChangesAsync();

            return teams;
        }

        // DELETE: api/Teams/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Team>> DeleteTeam(int id)
        {
            var team = await _context.Teams.Include(t => t.Users).Where(t => t.TeamId == id).SingleOrDefaultAsync();
            if (team == null)
            {
                return NotFound();
            }

            _context.Teams.Remove(team);
            await _context.SaveChangesAsync();

            return team;
        }

        private bool TeamExists(int id)
        {
            return _context.Teams.Any(e => e.TeamId == id);
        }
    }
}
