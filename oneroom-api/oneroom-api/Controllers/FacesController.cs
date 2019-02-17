using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using oneroom_api.Model;

namespace oneroom_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FacesController : ControllerBase
    {
        private readonly OneRoomContext _context;

        public FacesController(OneRoomContext context)
        {
            _context = context;
        }

        // OPTIONS: api/Faces
        [HttpOptions]
        public ActionResult OptionsFaces()
        {
            return Ok();
        }

        // POST: api/Facesv2/2
        [HttpPost("{id}")]
        public async Task<ActionResult<bool>> PostFace(Guid id, Face face)
        {

                var u = (from usr in _context.Users where usr.UserId.Equals(id) select usr)
                    .Include(us=>us.Faces).FirstOrDefault();

                if (u != null)
                {

                    if (!u.Faces.Select(f => f.FaceId).Contains(face.FaceId))
                    {
                        return Conflict("face already exists");
                    }

                    u.Faces.Add(face);
                    _context.Entry(u).State = EntityState.Modified;
                    
                    try
                    {
                        await _context.SaveChangesAsync();
                    } catch(Exception)
                    {
                        return StatusCode(500,false);
                    }

                    return Ok(true);
                }
                else
                    return NotFound("user not found");
            
        }

        // DELETE: api/Facesv2/5 
        [HttpDelete("{id}")]
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
