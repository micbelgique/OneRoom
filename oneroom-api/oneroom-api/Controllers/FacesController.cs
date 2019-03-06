using System;
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
    public class FacesController : ControllerBase
    {
        private readonly OneRoomContext _context;
        private readonly IHubContext<OneHub, IActionClient> _hubClients;

        public FacesController(OneRoomContext context, IHubContext<OneHub, IActionClient> hubClients)
        {
            _context = context;
            _hubClients = hubClients;
        }

        // POST: api/Facesv2/2
        [HttpPost("~/api/Games/{GameId}/Users/{UserId}/Faces")]
        [ProducesResponseType(201, Type = typeof(Task<ActionResult<Face>>))]
        [ProducesResponseType(404)]
        [ProducesResponseType(409)]
        public async Task<ActionResult<Face>> PostFace( int GameId, Guid UserId, [FromBody] Face face)
        {
            var usr = await _context.Users.Where(u => EF.Property<int>(u, "GameId") == GameId && u.UserId == UserId)
                                            .Include(u => u.Faces)
                                            .OrderByDescending(u => u.RecognizedDate)
                                            .SingleOrDefaultAsync();

            if (usr != null)
                {

                    if (usr.Faces.Select(f => f.FaceId).Contains(face.FaceId))
                    {
                        return Conflict("face already exists"+ face.FaceId);
                    }
                    usr.Faces.Add(face);
                    _context.Entry(usr).State = EntityState.Modified;

                try
                {
                    UsersUtilities.OptimizeResults(usr);
                    UsersUtilities.GenerateAvatar(usr);

                    await _context.SaveChangesAsync();

                    // update users dashboard and leaderboard
                    await _hubClients.Clients.All.UpdateUsers();

                } catch(DbUpdateException)
                {
                    return Conflict("face already exists : "+ face.FaceId);
                }

                    return CreatedAtAction("GetUser", "Users", new { GameId, id = UserId }, face);
                }
                else
                    return NotFound("user not found");
            
        }

        // DELETE: api/Facesv2/5 
        [HttpDelete("~/api/Games/{GameId}/Users/{UserId}/Faces/{id}")]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<Face>>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<Face>> DeleteFace(Guid id)
        {
            var face = await _context.Faces.FindAsync(id);

            if (face == null)
                return NotFound();

            _context.Faces.Remove(face);
            await _context.SaveChangesAsync();

            return Ok(face);
        }

        private bool FaceExists(Guid id)
        {
            return _context.Faces.Any(e => e.FaceId.Equals(id));
        }
    }
}