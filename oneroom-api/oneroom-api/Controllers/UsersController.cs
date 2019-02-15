using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users
                                 .Include(u => u.Faces)
                                 .ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users
                                     .Include(u => u.Faces)
                                     .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/Users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

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

        //// POST: api/Users
        //[HttpPost]
        //public async Task<ActionResult<User>> PostUser(User user)
        //{
        //    _context.Users.Add(user);

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateException)
        //    {
        //        if ( UserExists(user.UserId))
        //        {
        //            return Conflict(new { message = $"An existing record with for the user the id '{user.UserId}' was already found."});
        //        }
        //        else
        //        {
        //            Face face = null;
        //            user.Faces.ForEach(f => {
        //                if (FaceExists(f.FaceId))
        //                {
        //                    face = f;
        //                    return;
        //                }
        //            });
        //            if (face != null) return Conflict(new { message = $"An existing record for the face with the id '{face.FaceId}' was already found." });
        //            throw;
        //        }
        //    }

        //    return CreatedAtAction("GetUser", new { id = user.UserId }, user);
        //}

        // POST: api/Users
        [HttpPost]
        public async Task<ActionResult<List<User>>> PostUser(List<User> users)
        {
            List<User> usersRemoved = new List<User>();
            users.ForEach(u =>
            {
                if (UserExists(u.Id))
                {
                    usersRemoved.Add(u);
                    return;
                }
                u.Faces.ForEach(f =>
                {
                    if (FaceExists(f.Id))
                    {
                        usersRemoved.Add(u);
                        return;
                    }
                });
            });

            usersRemoved.ForEach(u => users.Remove(u));
            _context.Users.AddRange(users);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                //User user = null;
                //users.ForEach(u => {
                //    if (UserExists(u.UserId))
                //    {
                //        user = u;
                //        return;
                //    }
                //});
                //if (user != null)
                //{
                //    return Conflict(new { message = $"An existing record with for the user the id '{user.UserId}' was already found." });
                //}
                //else
                //{
                //    Face face = null;
                //    users.ForEach(u => u.Faces.ForEach(f => {
                //        if (FaceExists(f.FaceId))
                //        {
                //            face = f;
                //            return;
                //        }
                //    }));
                //    if (face != null) return Conflict(new { message = $"An existing record for the face with the id '{face.FaceId}' was already found." });
                //    throw;
                //}
                return Conflict(new { message = $"An existing record with for one of the element of the list was already found." });
            }

            return CreatedAtAction("GetUsers", users);
        }

        // DELETE: api/Users/5
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
            return _context.Users.Any(u => u.Id == id);
        }

        private bool FaceExists(int id)
        {
            return _context.Faces.Any(f => f.Id == id);
        }
    }
}
