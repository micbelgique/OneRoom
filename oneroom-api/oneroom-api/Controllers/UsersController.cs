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
        public async Task<ActionResult<User>> GetUser( int GameId, Guid id)
        {
            var user = await _context.Users.Where(u => u.GameId == GameId && u.UserId == id)
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
        public async Task<ActionResult<User>> UpdateUser(int GameId, Guid id, User usr)
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

            UsersUtilities.GenerateAvatar(usr);

            try
            {
                await _context.SaveChangesAsync();
                await _hubClients.Clients.All.UpdateUser(usr);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists( GameId, usr.UserId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
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
                if (user != null)
                {
                    var u = await (from e in _context.Users where e.UserId == user.UserId select e).FirstOrDefaultAsync();
                    if (u != null)
                    {
                        if(!u.IsFirstConnected)
                        {
                            u.Name = user.Name;
                            u.IsFirstConnected = true;
                            _context.Entry(u).State = EntityState.Modified;
                            await _context.SaveChangesAsync();
                            await _hubClients.Clients.All.UpdateUser(u);
                        }
                        return u;
                    }
                    else
                        throw new Exception("user not found");
                }
                else
                    throw new Exception("the parameter user not found");
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
        public async Task<ActionResult<IEnumerable<User>>> Optimize(int GameId)
        {
            var users = await _context.Users.Where(u => u.GameId == GameId)
                                            .Include(u => u.Faces)
                                            .OrderByDescending(u => u.RecognizedDate)
                                            .ToListAsync();
            foreach( User u in users)
            {
                u.Name = u.Name.Replace("Player", "Person");
                UsersUtilities.OptimizeResults(u);
                UsersUtilities.GenerateAvatar(u);
            }

            try
            {
                await _context.SaveChangesAsync();

                // update users dashboard and leaderboard
                await _hubClients.Clients.All.UpdateUsers(users);

            }
            catch (Exception) { }

            return users;
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

                var usr = await _context.Users.Where(u => u.GameId == GameId && u.UserId == user.UserId)
                                        .SingleOrDefaultAsync(); ;

                if (usr != null)
                {

                    // warn dashboard user is in front of the camera
                    await _hubClients.Clients.All.HighlightUser(user.UserId);
                    return Conflict("user already exists");
                }

                var count = await _context.Users.Where(u => u.GameId == GameId)
                                                .CountAsync();

                user.Name = "Person " + (++count);
                // Link user to game
                user.GameId = GameId;
                _context.Users.Add(user);

                UsersUtilities.OptimizeResults(user);
                UsersUtilities.GenerateAvatar(user);

                await _context.SaveChangesAsync();               

                // update users dashboard and leaderboard
                await _hubClients.Clients.All.CreateUser(user);

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
            var user = await _context.Users.Where(u => u.GameId == GameId && u.UserId == id)
                                           .SingleOrDefaultAsync();
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            await _hubClients.Clients.All.DeleteUser(user);

            return user;
        }

        private bool UserExists( int GameId, Guid id)
        {
            return _context.Users.Any(u => u.GameId == GameId && u.UserId == id);
        }
    }
}
