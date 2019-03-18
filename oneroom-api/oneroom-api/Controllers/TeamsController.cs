﻿using System.Collections.Generic;
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
            var team = await _context.Teams.Where(t => t.GameId == gameId && t.TeamId == id)
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
        public async Task<ActionResult<List<Team>>> CreateTeam(int gameId, int numOfTeams)
        {
            var count = await _context.Teams.Where(t => t.GameId == gameId)
                                            .CountAsync();
            if (count > 0) return Conflict("Teams are alredy created");

            var game = await _context.Games
                .Include(g => g.Config)
                .Where(g => g.GameId == gameId)
                .SingleOrDefaultAsync();

            List<User> users = await _context.Users.Where(u => u.GameId == gameId)
                                                   .Where(u => u.Recognized >= game.Config.MinimumRecognized)
                                                   .ToListAsync();

            if (users.Count() < numOfTeams) return BadRequest("There isn't enough players to create "+ numOfTeams + " teams");

            List<Team> teams = new List<Team>();
            users.Shuffle();

            for (var i = 0; i<numOfTeams; i++)
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
                teams.Add(team);

                _context.Teams.Add(team);
            }

            int nbTeams = teams.Count();
            int j = 0;
            foreach( User u in users)
            {
                teams[j++].Users.Add(u);
                if (j == nbTeams) j = 0;
            }

            await _context.SaveChangesAsync();
            await _hubClients.Clients.Group(game.GroupName).UpdateTeams(teams);

            return CreatedAtAction("GetTeam", new { GameId = gameId}, teams);
        }

        // DELETE: api/Games/1/Teams
        [HttpDelete]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<Team>>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<List<Team>>> DeleteTeams( int gameId)
        {
            var teams = await _context.Teams.Where(t => t.GameId == gameId)
                                            .Include(t => t.Users).ToListAsync();
            if (teams.Count() == 0)
            {
                return NotFound();
            }
            _context.Teams.RemoveRange(teams);
            await _context.SaveChangesAsync();
            var game = await (from e in _context.Games where e.GameId == gameId select e).FirstOrDefaultAsync();
            await _hubClients.Clients.Group(game.GroupName).DeleteTeams(gameId);
            return teams;
        }
    }
}
