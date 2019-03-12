using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using oneroom_api.Hubs;
using oneroom_api.Model;

namespace oneroom_api.Controllers
{
    [Route("api/Games/{GameId}/[controller]")]
    [ApiController]
    public class TeamsController : ControllerBase
    {
        private readonly OneRoomContext _context;
        private readonly IHubContext<OneHub, IActionClient> _hubClients;

        public TeamsController(OneRoomContext context, IHubContext<OneHub, IActionClient> hubClients)
        {
            _context = context;
            _hubClients = hubClients;
        }

        // GET: api/Games/1/Teams
        [HttpGet]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<IEnumerable<Team>>>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<IEnumerable<Team>>> GetTeam(int GameId)
        {
            return await _context.Teams.Where(t => EF.Property<int>(t, "GameId") == GameId)
                                       .Include(t => t.Users)
                                       .ToListAsync();
        }

        // GET: api/Games/1/Teams/5
        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<Team>>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<Team>> GetTeam(int GameId, int id)
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
        [ProducesResponseType(201, Type = typeof(Task<ActionResult<List<Team>>>))]
        [ProducesResponseType(409)]
        public async Task<ActionResult<List<Team>>> CreateTeam(int GameId, int numOfTeams)
        {
            var count = await _context.Teams.Where(t => EF.Property<int>(t, "GameId") == GameId)
                                            .CountAsync();
            if (count > 0) return Conflict("Teams are alredy created");

            var game = await _context.Games
                .Include(g => g.Config)
                .Where(g => g.GameId == GameId)
                .SingleOrDefaultAsync();

            List<User> users = await _context.Users.Where(u => EF.Property<int>(u, "GameId") == GameId)
                                                   .Where(u => u.Recognized >= game.Config.MinimumRecognized)
                                                   .ToListAsync();

            if (users.Count() < numOfTeams) return BadRequest("There isn't enough players to create "+ numOfTeams + " teams");

            List<Team> teams = new List<Team>();
            users.Shuffle();
            int nbUserPerTeam = (int)Math.Ceiling((double)users.Count() / numOfTeams);

            for (int i = 0; i<numOfTeams; i++)
            {
                Team team = new Team();
                // pick random team name
                string name;
                do
                {
                    name = Team.RandomName();
                } while (teams.Select(t => t.TeamName).Contains(name));
                team.TeamName = name;
                // pick random team color
                string color = "";
                do
                {
                    Color colorAll;
                    // pick only light color
                    do
                    {
                        colorAll = Team.RandomColor();
                        color = "" + colorAll.R;
                        color += "," + colorAll.G;
                        color += "," + colorAll.B;
                    } while (colorAll.R < 100 || colorAll.G < 100 || colorAll.B < 100);
                    
                } while (teams.Select(t => t.TeamColor).Contains(color));
                team.TeamColor = color;
                teams.Add(team);

                _context.Teams.Add(team);
                _context.Entry(team).Property("GameId").CurrentValue = GameId;

            }

            int nbTeams = teams.Count();
            int j = 0;
            foreach( User u in users)
            {
                teams[j++].Users.Add(u);
                if (j == nbTeams) j = 0;
            }

            await _context.SaveChangesAsync();
            await _hubClients.Clients.All.UpdateTeams();

            return CreatedAtAction("GetTeam", new { GameId}, teams);
        }

        // DELETE: api/Games/1/Teams
        [HttpDelete]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<Team>>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<List<Team>>> DeleteTeams( int GameId)
        {
            var teams = await _context.Teams.Where(t => EF.Property<int>(t, "GameId") == GameId)
                                            .Include(t => t.Users).ToListAsync();
            if (teams.Count() == 0)
            {
                return NotFound();
            }

            _context.Teams.RemoveRange(teams);
            await _context.SaveChangesAsync();
            await _hubClients.Clients.All.UpdateTeams();

            return teams;
        }
    }
}
