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
        public ActionResult OptionsUsers()
        {
            return Ok();
        }

        // GET: api/UsersV2
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/UsersV2/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/UsersV2/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAvatar(int id, string urlAvatar)
        {

            if (urlAvatar == null || urlAvatar.Equals(""))
            {
                return BadRequest("Bad uri for avatar");
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
        public async Task<ActionResult<bool>> PostUser(User[] users)
        {
            try
            {
                if (users == null)
                {
                    return BadRequest();
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest("Invalid user");
                }
                var listUser = _context.Users;
                for (int i = 0; i < users.Length; i++)
                {
                    var user = (from e in listUser where e.Id == users[i].Id select e).FirstOrDefault();
                    if (user != null)
                        _context.Entry(user).State = EntityState.Modified;
                    else
                        _context.Users.Add(user);
                }
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }

        }

        // DELETE: api/UsersV2/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<User>> DeleteUser(int id)
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

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
