using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using oneroom_api.data;
using oneroom_api.Hubs;
using oneroom_api.Model;
using oneroom_api.Utilities;

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
        public async Task<ActionResult<IEnumerable<Team>>> GetTeam(int gameId)
        {
            return await _context.Teams.Where(t => t.GameId == gameId)
                                       .Include(t => t.Users)
                                       .ToListAsync();
        }

        // GET: api/Games/1/Teams/5
        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<Team>>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<Team>> GetTeam(int gameId, int id)
        {
            var team = await _context.Teams.SingleOrDefaultAsync(t => t.GameId == gameId && t.TeamId == id);

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
        public async Task<ActionResult<List<Team>>> CreateTeam(int gameId, int numOfTeams)
        {
            var count = await _context.Teams.Where(t => t.GameId == gameId)
                                            .CountAsync();
            if (count > 0) return Conflict("Teams are alredy created");

            var game = await _context.Games.Include(g => g.Config)
                                           .SingleOrDefaultAsync(g => g.GameId == gameId);

            List<User> users = await _context.Users.Where(u => u.GameId == gameId)
                                                   .Where(u => u.Recognized >= game.Config.MinimumRecognized)
                                                   .ToListAsync();

            if (users.Count() < numOfTeams) return BadRequest("There isn't enough players to create "+ numOfTeams + " teams");

            var teams = new List<Team>();

            for (var i = 0; i<numOfTeams; i++)
            {
                var team = new Team();
                // pick random team name
                string name;
                do
                {
                    name = Team.RandomName();
                } while (teams.Select(t => t.TeamName).Contains(name));
                team.TeamName = name;
                // pick random team color
                string color;
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
                team.GameId = gameId;
                teams.Add(team);

                _context.Teams.Add(team);
            }

            users.Shuffle();
            SpreadPlayers(game);

            await _context.SaveChangesAsync();
            await _hubClients.Clients.Group(gameId.ToString()).UpdateTeams(teams);

            return CreatedAtAction("GetTeam", new { GameId = gameId}, teams);
        }

        // DELETE: api/Games/1/Teams
        [HttpDelete]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<Team>>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<List<Team>>> DeleteTeams( int gameId)
        {
            var teams = await _context.Teams.Where(t => t.GameId == gameId)
                                            .Include(t => t.Users)
                                            .ToListAsync();
            if (teams.Count() == 0)
            {
                return NotFound();
            }
            _context.Teams.RemoveRange(teams);
            await _context.SaveChangesAsync();
            await _hubClients.Clients.Group(gameId.ToString()).DeleteTeams(gameId);
            return teams;
        }

        [HttpPut]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<Team>>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<Team>> EditGame([FromBody] Team team, int gameId)
        {
            var teamDb = await _context.Teams.Where(g => g.TeamId == team.TeamId && g.GameId == gameId).FirstOrDefaultAsync();
            if (teamDb == null) return NotFound();
            if (teamDb.CreationDate.AddMinutes(5) <= DateTime.Now) return teamDb;
            teamDb.TeamName = team.TeamName;
            teamDb.TeamColor = team.TeamColor;
            _context.Entry(teamDb).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            await _hubClients.Clients.Group(gameId.ToString()).UpdateTeams(_context.Teams.ToList());
            return teamDb;
        }

        public static void SpreadPlayers(Game game)
        {
            int nbTeams = game.Teams.Count();
            if(nbTeams > 0)
            {
                int j = 0;
                for (int i = 0; i < nbTeams; i++)
                {
                    game.Teams[i].Users.Clear();
                }
                foreach (User u in game.Users)
                {
                    game.Teams[j++].Users.Add(u);
                    if (j == nbTeams) j = 0;
                }
            }
        }
    }
}
