using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using oneroom_api.Model;

namespace oneroom_api.Controllers
{
    [Route("api/Games/{GameId}/[controller]")]
    [ApiController]
    public class TeamsController : ControllerBase
    {
        private readonly OneRoomContext _context;

        public TeamsController(OneRoomContext context)
        {
            _context = context;
        }

        // GET: api/Games/1/Teams
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Team>>> GetTeam( int GameId)
        {
            return await _context.Teams.Where(t => EF.Property<int>(t, "GameId") == GameId)
                                       .Include(t => t.Users)
                                       .ToListAsync();
        }

        // GET: api/Games/1/Teams/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Team>> GetTeam( int GameId, int id)
        {
            var team = await _context.Teams.Where(t => EF.Property<int>(t, "GameId") == GameId && t.TeamId == id)
                                           .SingleOrDefaultAsync();

            if (team == null)
            {
                return NotFound();
            }

            return team;
        }

        // POST: api/Games/1/Teams/2
        [HttpPost("{numOfTeams}")]
        public async Task<ActionResult<Team>> CreateTeam( int GameId, int numOfTeams)
        {
            var count = await _context.Teams.Where(t => EF.Property<int>(t, "GameId") == GameId)
                                            .CountAsync();
            if (count > 0) return Conflict("Teams are alredy created");

            List<User> users = await _context.Users.Where(u => EF.Property<int>(u, "GameId") == GameId)
                                                   .ToListAsync();
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
                _context.Entry(team).Property("GameId").CurrentValue = GameId;

            }
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTeam", new { GameId}, teams);
        }

        // DELETE: api/Games/1/Teams
        [HttpDelete]
        public async Task<ActionResult<List<Team>>> DeleteTeams( int GameId)
        {
            var teams = await _context.Teams.Where(t => EF.Property<int>(t, "GameId") == GameId)
                                            .Include(t => t.Users).ToListAsync();
            if (teams == null)
            {
                return NotFound();
            }

            _context.Teams.RemoveRange(teams);
            await _context.SaveChangesAsync();

            return teams;
        }
    }
}
