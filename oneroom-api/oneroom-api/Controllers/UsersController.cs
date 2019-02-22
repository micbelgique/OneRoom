using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using oneroom_api.Model;
using oneroom_api.ViewModels;

namespace oneroom_api.Controllers
{
    [Route("api/Games/{GameId}/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly OneRoomContext _context;

        public UsersController(OneRoomContext context)
        {
            _context = context;
        }

        // GET: api/Games/1/Users
        [HttpGet]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<IEnumerable<User>>>))]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers( int GameId)
        {
            // return await _context.Users.Where(u => EF.Property<int>(u, "GameId") == GameId)
            //                            .Include(u => u.Faces)
            //                            .OrderBy(u => u.CreationDate)
            //                            .ToListAsync();
            var users = await _context.Users.Where(u => EF.Property<int>(u, "GameId") == GameId)
                                            .Include(u => u.Faces)
                                            .OrderBy(u => u.CreationDate)
                                            .ToListAsync();
            // average and accurate details
            // TODO : replace and update model
            for(var i=0; i<users.Count; i++)
            {
                if(users[i].Faces.Count > 0)
                {
                    var faces = users[i].Faces.OrderBy(u => u.CreationDate).ToList();
                    var face = new Face();
                    face.Age = Math.Floor(faces.Average(f => f.Age));
                    var male = faces.Count(f => f.IsMale);
                    var female = faces.Count() - male;
                    face.IsMale = male > female ? true : false;
                    face.MoustacheLevel = faces.Average(f => f.MoustacheLevel);
                    face.BeardLevel = faces.Average(f => f.BeardLevel);
                    face.BaldLevel = faces.Average(f => f.BaldLevel);
                    face.HairColor = faces.Last().HairColor;
                    face.SkinColor = faces.Last().SkinColor;
                    face.CreationDate = faces.Last().CreationDate;
                    face.SmileLevel = faces.Last().SmileLevel;
                    face.GlassesType = faces.Last().GlassesType;
                    face.FaceId = Guid.Empty;
                    face.EmotionDominant = faces.Last().EmotionDominant;
                    users[i].Faces.Clear();
                    users[i].Faces.Add(face);
                }
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
            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
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
        public async Task<ActionResult<User>> PostUser( int GameId, [FromBody] User user)
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
               
                if (usr != null) return Conflict("user already exists");

                var count = await _context.Users.Where(u => EF.Property<int>(u, "GameId") == GameId)
                                                .CountAsync();

                user.Name = "Player " + (++count);
                _context.Users.Add(user);
                _context.Entry(user).Property("GameId").CurrentValue = GameId;

                await _context.SaveChangesAsync();
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

            return user;
        }

        private bool UserExists( int GameId, Guid id)
        {
            return _context.Users.Any(u => EF.Property<int>(u, "GameId") == GameId && u.UserId == id);
        }
    }
}
