using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using oneroom_api.Hubs;
using oneroom_api.Model;
using oneroom_api.Utilities;

namespace oneroom_api.Controllers
{
    [Route("api/Games/{GameId}/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly OneRoomContext _context;
        private readonly IHubContext<OneHub, IActionClient> _hubClients;

        public UsersController(OneRoomContext context, IHubContext<OneHub, IActionClient> hubClients)
        {
            _context = context;
            _hubClients = hubClients;
        }

        // GET: api/Games/1/Users
        [HttpGet]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<IEnumerable<User>>>))]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers(int gameId)
        {
            var users = await _context.Users.Where(u => u.GameId == gameId)
                                            .OrderByDescending(u => u.RecognizedDate)
                                            .ToListAsync();
            return users;
        }

        // GET: api/Games/1/Users/5
        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<User>>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<User>> GetUser( int gameId, Guid id)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.GameId == gameId && u.UserId == id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/Games/1/Users/id
        [HttpPut("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<User>> UpdateUser(int gameId, Guid id, User usr)
        {
            if (usr == null)
            {
                return BadRequest("user is null");
            }

            if (id != usr.UserId)
            {
                return BadRequest();
            }

            _context.Entry(usr).State = EntityState.Modified;

            usr.GenerateAvatar();

            try
            {
                await _context.SaveChangesAsync();
                await _hubClients.Clients.Group(gameId.ToString()).UpdateUser(usr);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists( gameId, usr.UserId))
                {
                    return NotFound();
                }

                throw;
            }

            return usr;
        }

        [Route("updateNameUser")]
        [HttpPost]
        [ProducesResponseType(200,Type=typeof(Task<ActionResult<User>>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<User>> UpdateNameUser(User user)
        {
            try
            {
                if (user == null) throw new Exception("the parameter user not found");
                var u = await (from e in _context.Users where e.UserId == user.UserId select e).FirstOrDefaultAsync();
                if (u == null) throw new Exception("user not found");
                if (u.IsFirstConnected) return u;
                u.Name = user.Name;
                u.IsFirstConnected = true;
                _context.Entry(u).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                await _hubClients.Clients.All.UpdateUser(u);
                return u;
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        // POST: api/Games/1/Users/Optimize
        [HttpPost("~/api/Games/{GameId}/Users/Optimize")]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<IEnumerable<User>>>))]
        [ProducesResponseType(400)]
        [ProducesResponseType(409)]
        public async Task<ActionResult<IEnumerable<User>>> Optimize(int gameId)
        {
            var users = await _context.Users.Where(u => u.GameId == gameId)
                                            .Include(u => u.Faces)
                                            .OrderByDescending(u => u.RecognizedDate)
                                            .ToListAsync();
            foreach( var u in users)
            {
                u.OptimizeResults();
                u.GenerateAvatar();
            }

            try
            {
                await _context.SaveChangesAsync();

                // update users dashboard and leaderboard
                await _hubClients.Clients.Group(gameId.ToString()).UpdateUsers(users);

            }
            catch (Exception)
            {
                // ignored
            }

            return users;
        }

        // POST: api/Games/1/Users
        [HttpPost]
        [ProducesResponseType(201, Type = typeof(Task<ActionResult<User>>))]
        [ProducesResponseType(400)]
        [ProducesResponseType(409)]
        public async Task<ActionResult<User>> PostUser( int gameId, User user)
        {
            try
            {
                if (user == null)
                {
                    return BadRequest("user is empty");
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest("Invalid user");
                }

                var usr = await _context.Users.SingleOrDefaultAsync(u => u.GameId == gameId && u.UserId == user.UserId);

                if (usr != null)
                {

                    // warn dashboard user is in front of the camera
                    await _hubClients.Clients.Group(gameId.ToString()).HighlightUser(user.UserId);
                    return Conflict("user already exists");
                }

                var count = await _context.Users.Where(u => u.GameId == gameId)
                                                .CountAsync();

                user.Name = "Person " + (++count);
                // Link user to game
                user.GameId = gameId;
                _context.Users.Add(user);

                user.OptimizeResults();
                user.GenerateAvatar();

                await _context.SaveChangesAsync();               

                // update users dashboard and leaderboard
                await _hubClients.Clients.Group(gameId.ToString()).CreateUser(user);

                // warn dashboard user is in front of the camera
                await _hubClients.Clients.Group(gameId.ToString()).HighlightUser(user.UserId);

                return CreatedAtAction("GetUser", new { GameId = gameId, id = user.UserId }, user);
            }
            catch (Exception)
            {
                return Conflict("user already exists");
            }

        }

        // DELETE: api/Games/1/Users/5
        [HttpDelete("{id}")]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<User>>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<User>> DeleteUser( int gameId, Guid id)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.GameId == gameId && u.UserId == id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);

            var game = await _context.Games.Include(g => g.Users)
                                           .Include(g => g.Teams)
                                           .SingleOrDefaultAsync(g => g.GameId.Equals(gameId));

            TeamsController.SpreadPlayers(game);

            await _context.SaveChangesAsync();
            await _hubClients.Clients.Group(gameId.ToString()).DeleteUser(user);
            await _hubClients.Clients.Group(gameId.ToString()).UpdateTeams(game.Teams);

            return user;
        }

        [HttpPut("MergeUser")]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<User>>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<User>> MergeUser(int gameId, Guid userId1, Guid userId2)
        {
            var user1 = await _context.Users.SingleOrDefaultAsync(u => u.GameId == gameId && u.UserId == userId1);
            var user2 = await _context.Users.SingleOrDefaultAsync(u => u.GameId == gameId && u.UserId == userId2);
            if (user1 == null || user2 == null) return NotFound("One or both users not found");
            var finalUser = new User
            {
                Age = (user1.Age + user2.Age) / 2,
                GameId = gameId,
                BaldLevel = (user1.BaldLevel + user2.BaldLevel) / 2,
                BeardLevel = (user1.BeardLevel + user2.BeardLevel) / 2,
                MoustacheLevel = (user1.MoustacheLevel + user2.MoustacheLevel) / 2,
                SmileLevel = (user1.SmileLevel + user2.SmileLevel) / 2,
                Recognized = (user1.Recognized + user2.Recognized) /2,
                UserId = user2.UserId
                
            };
            if (user1.IsFirstConnected)
            {
                finalUser.Name = user1.Name;
                finalUser.IsFirstConnected = true;
                finalUser.EmotionDominant = user1.EmotionDominant;
                finalUser.HairColor = user1.HairColor;
                finalUser.Gender = user1.Gender;
                finalUser.GlassesType = user1.GlassesType;
                finalUser.HairLength = user1.HairLength;
                finalUser.SkinColor = user1.SkinColor;
                finalUser.RecognizedDate = user1.RecognizedDate;
            }
            else
            {
                finalUser.Name = user2.Name;
                finalUser.IsFirstConnected = true;
                finalUser.EmotionDominant = user2.EmotionDominant;
                finalUser.HairColor = user2.HairColor;
                finalUser.Gender = user2.Gender;
                finalUser.GlassesType = user2.GlassesType;
                finalUser.HairLength = user2.HairLength;
                finalUser.SkinColor = user2.SkinColor;
                finalUser.RecognizedDate = user2.RecognizedDate;
            }
            finalUser.GenerateAvatar();
            _context.Users.Remove(user1);
            _context.Users.Remove(user2);
            _context.Users.Add(finalUser);
            await _context.SaveChangesAsync();
            return finalUser;
        }
        private bool UserExists( int gameId, Guid id)
        {
            return _context.Users.Any(u => u.GameId == gameId && u.UserId == id);
        }
    }
}
