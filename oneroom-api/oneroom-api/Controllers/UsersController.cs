using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using oneroom_api.Model;
using oneroom_api.Utilities;
using oneroom_api.SignalR;
using oneroom_api.ViewModels;

namespace oneroom_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowSpecificOrigin")]
    public class UsersController : ControllerBase
    {
        private readonly OneRoomContext _context;
        private readonly IHubContext<CoordinatorHub> _hubContext;

        public UsersController(OneRoomContext context, IHubContext<CoordinatorHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }


        // OPTIONS: api/UsersV2
        [HttpOptions]
        [ProducesResponseType(200)]
        public ActionResult OptionsUsers()
        {
            return Ok();
        }

        // GET: api/UsersV2
        [HttpGet]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<IEnumerable<User>>>))]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            var users = await _context.Users.Include(u=>u.Faces).OrderBy(u=>u.CreationDate).ToListAsync();

            for(var i=0; i<users.Count; i++)
            {
                UsersUtilities.OptimizeResults(users[i]);
            }

            return users;
        }

        // GET: api/UsersV2/5
        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<User>>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<User>> GetUser(Guid id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/UsersV2/id
        [HttpPut("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateAvatar(Guid id, Avatar model)
        {
            // todo regex check uri match 
            if (model.Url == null)
            {
                return BadRequest("avatar url is null");
            }

            var user = await _context.Users.FindAsync(id);

            if(user == null)
            {
                return BadRequest("user not found");
            }

            if (user.UrlAvatar == model.Url) return NoContent();
            user.UrlAvatar = model.Url;
            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
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

        // POST: api/UsersV2
        [HttpPost]
        [ProducesResponseType(201, Type = typeof(Task<ActionResult<User>>))]
        [ProducesResponseType(400)]
        [ProducesResponseType(409)]
        public async Task<ActionResult<User>> PostUser(User user)
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

               var u = _context.Users.Find(user.UserId);
               var count = await _context.Users.CountAsync(); 

               if (u != null)
                   return Conflict("user already exists");
               else
                {
                    user.Name = "Player " + (++count);
                    _context.Users.Add(user);
                }

                await _context.SaveChangesAsync();

                //await _hubContext.Clients.All.SendAsync("GetNewUser", user);
                return CreatedAtAction("GetUser", new { id = user.UserId }, user);
            }
            catch (Exception)
            {
                return BadRequest("Une erreur est survenue");
            }

        }

        // DELETE: api/UsersV2/5
        [HttpDelete("{id}")]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<User>>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<User>> DeleteUser(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return user;
        }

        private bool UserExists(Guid id)
        {
            return _context.Users.Any(e => e.UserId.Equals(id));
        }
    }
}
