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
using oneroom_api.ViewModels;

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
        public async Task<ActionResult<IEnumerable<User>>> GetUsers(int GameId)
        {
            var users = await _context.Users.Where(u => EF.Property<int>(u, "GameId") == GameId)
                                            .Include(u => u.Faces)
                                            .OrderBy(u => u.RecognizedDate)
                                            .ToListAsync();
            // average and accurate details
            for(var i=0; i<users.Count; i++)
            {
                UsersUtilities.OptimizeResults(users[i]);
            }

            return users;
        }

        // GET: api/Games/1/Users/5
        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<User>>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<User>> GetUser( int GameId, Guid id)
        {
            var user = await _context.Users.Where(u => EF.Property<int>(u, "GameId") == GameId && u.UserId == id)
                                           .SingleOrDefaultAsync();

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
        public async Task<IActionResult> UpdateAvatar( int GameId, Guid id, Avatar model)
        {
            // todo regex check uri match 
            if (model.Url == null)
            {
                return BadRequest("avatar url is null");
            }

            var user = await _context.Users.Where(u => EF.Property<int>(u, "GameId") == GameId && u.UserId == id)
                                           .SingleOrDefaultAsync();

            if (user == null)
            {
                return BadRequest("user not found");
            }

            if (user.UrlAvatar == model.Url) return NoContent();
            user.UrlAvatar = model.Url;
 
            user.RecognizedDate = DateTime.Now;
            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                await _hubClients.Clients.All.UpdateUsers();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists( GameId, id))
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

        // POST: api/Games/1/Users
        [HttpPost]
        [ProducesResponseType(201, Type = typeof(Task<ActionResult<User>>))]
        [ProducesResponseType(400)]
        [ProducesResponseType(409)]
        public async Task<ActionResult<User>> PostUser( int GameId, User user)
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

                var usr = await _context.Users.Where(u => EF.Property<int>(u, "GameId") == GameId && u.UserId == user.UserId)
                                        .SingleOrDefaultAsync(); ;

                if (usr != null)
                {

                    // warn dashboard user is in front of the camera
                    await _hubClients.Clients.All.HighlightUser(user.UserId);
                    return Conflict("user already exists");
                }

                var count = await _context.Users.Where(u => EF.Property<int>(u, "GameId") == GameId)
                                                .CountAsync();

                user.Name = "Player " + (++count);
                _context.Users.Add(user);
                _context.Entry(user).Property("GameId").CurrentValue = GameId;

                //retrieve game and add user to it
                var game = _context.Games.Find(GameId);
                game.Users.Add(user);

                await _context.SaveChangesAsync();

                // update users dashboard and leaderboard
                await _hubClients.Clients.All.UpdateUsers();

                // warn dashboard user is in front of the camera
                await _hubClients.Clients.All.HighlightUser(user.UserId);

                return CreatedAtAction("GetUser", new { GameId, id = user.UserId }, user);
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
        public async Task<ActionResult<User>> DeleteUser( int GameId, Guid id)
        {
            var user = await _context.Users.Where(u => EF.Property<int>(u, "GameId") == GameId && u.UserId == id)
                                           .SingleOrDefaultAsync();
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            await _hubClients.Clients.All.UpdateUsers();

            return user;
        }

        private bool UserExists( int GameId, Guid id)
        {
            return _context.Users.Any(u => EF.Property<int>(u, "GameId") == GameId && u.UserId == id);
        }
    }
}
