using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using oneroom_api.Hubs;
using oneroom_api.Model;
using oneroom_api.Utilities;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;

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
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<IEnumerable<TeamDTO>>>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<IEnumerable<TeamDTO>>> GetTeam(int gameId)
        {
            return await _context.Teams.Where(t => t.GameId == gameId)
                                       .Include(t => t.Users)
                                       .Include(t => t.TeamChallenges)
                                            .ThenInclude(tc => tc.Challenge)
                                       .Select(t => t.ToDTO())
                                       .ToListAsync();
        }

        // GET: api/Games/1/Teams/5
        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<TeamDTO>>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<TeamDTO>> GetTeam(int gameId, int id)
        {
            Team team = await _context.Teams.Include(t => t.Users)
                                            .Include(t => t.TeamChallenges)
                                                .ThenInclude(tc => tc.Challenge)
                                            .SingleOrDefaultAsync(t => t.GameId == gameId && t.TeamId == id);

            if (team == null)
            {
                return NotFound();
            }

            return team.ToDTO();
        }

        // POST: api/Games/1/Teams/2
        [HttpPost("{numOfTeams}")]
        [ProducesResponseType(201, Type = typeof(Task<ActionResult<List<TeamDTO>>>))]
        [ProducesResponseType(409)]
        public async Task<ActionResult<List<TeamDTO>>> CreateTeam(int gameId, int numOfTeams)
        {
            Game game = await _context.Games.Include(g => g.Config)
                                            .Include(g => g.Scenario.ScenarioChallenges)
                                                .ThenInclude(sc => sc.Challenge)
                                            .Include(g => g.Teams)
                                            .Include(g => g.Users)
                                            .SingleOrDefaultAsync(g => g.GameId == gameId);

            if (game.Teams.Count > 0) return Conflict("Teams are already created");

            if (game == null) return BadRequest("The game with id : " + gameId + " doesn't exist");

            if (game.Scenario == null) return BadRequest("The game doesn't contains any Scenario");

            if (game.Scenario.ScenarioChallenges.Count > 0) return BadRequest("The Scenario doesn't contains any Challenges");

            if (game.Users.Count(u => u.Recognized >= game.Config.MinimumRecognized) < numOfTeams) return BadRequest("There isn't enough players to create " + numOfTeams + " teams");

            List<Team> teams = new List<Team>();

            for (int i = 0; i < numOfTeams; i++)
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
                // TODO Personalize Answers By Team
                team.TeamChallenges = game.Scenario.ScenarioChallenges.ConvertAll<TeamChallenge>(sc => new TeamChallenge { Team = team, Challenge = sc.Challenge, Completed = false });
                teams.Add(team);

                _context.Teams.Add(team);
            }

            game.Users.Shuffle();
            SpreadPlayers(game);

            await _context.SaveChangesAsync();
            await _hubClients.Clients.Group(gameId.ToString()).UpdateTeams(teams.ConvertAll<TeamDTO>(t => t.ToDTO()));

            return CreatedAtAction("GetTeam", new { GameId = gameId }, teams.ConvertAll<TeamDTO>(t => t.ToDTO()));
        }

        // DELETE: api/Games/1/Teams
        [HttpDelete]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<Team>>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<List<Team>>> DeleteTeams(int gameId)
        {
            List<Team> teams = await _context.Teams.Where(t => t.GameId == gameId)
                                                   .Include(t => t.Users)
                                                   .ToListAsync();
            if (!teams.Any())
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
            Team teamDb = await _context.Teams.Where(g => g.TeamId == team.TeamId && g.GameId == gameId).FirstOrDefaultAsync();
            if (teamDb == null) return NotFound();
            if (teamDb.CreationDate.AddMinutes(5) <= DateTime.Now) return teamDb;
            teamDb.TeamName = team.TeamName;
            teamDb.TeamColor = team.TeamColor;
            _context.Entry(teamDb).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            await _hubClients.Clients.Group(gameId.ToString()).UpdateTeams(_context.Teams.ToList().ConvertAll<TeamDTO>(t => t.ToDTO()));
            return teamDb;
        }

        public static void SpreadPlayers(Game game)
        {
            int nbTeams = game.Teams.Count();
            if (nbTeams <= 0) return;
            int j = 0;
            for (int i = 0; i < nbTeams; i++)
            {
                game.Teams[i].Users.Clear();
            }
            foreach (User u in game.Users.Where(u => u.Recognized >= game.Config.MinimumRecognized))
            {
                game.Teams[j++].Users.Add(u);
                if (j == nbTeams) j = 0;
            }
        }
    }
}
