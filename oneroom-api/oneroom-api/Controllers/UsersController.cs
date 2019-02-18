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
    public class UsersController : ControllerBase
    {
        private readonly OneRoomContext _context;

        public UsersController(OneRoomContext context)
        {
            _context = context;
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
            return await _context.Users.Include(u=>u.Faces).OrderBy(u=>u.CreationDate).ToListAsync();
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
        [HttpPut]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateAvatar(Guid id, string urlAvatar)
        {

            // todo regex check uri match 
            if (urlAvatar == null)
            {
                return BadRequest("avatar url is null");
            }

            var user = await _context.Users.FindAsync(id);

            if(user == null)
            {
                return BadRequest("user not found");
            }

            user.UrlAvatar = urlAvatar;
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
               var count = _context.Users.Count(); 

               if (u != null)
                   return Conflict("user already exists");
               else
                {
                    user.Name = "Player " + (count + 1);
                    _context.Users.Add(user);
                }
                  

                await _context.SaveChangesAsync();
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
