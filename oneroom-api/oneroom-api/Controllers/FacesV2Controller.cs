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
    public class Facesv2Controller : ControllerBase
    {
        private readonly OneRoomContext _context;

        public Facesv2Controller(OneRoomContext context)
        {
            _context = context;
        }

        // POST: api/Facesv2 
        [HttpPost]
        public async Task<ActionResult<Face>> PostFace(Face face,Guid user)
        {
            if (face.FaceId != Guid.Empty)
            {
                var u = (from e in _context.Users where e.UserId == user select e).Include(us=>us.Faces).FirstOrDefault();
                if (u != null)
                {
                    u.Faces.Add(face);
                    _context.Entry(u).State = EntityState.Modified;
                    await _context.SaveChangesAsync();

                    return CreatedAtAction("GetFace", new { id = face.Id }, face);
                }
                else
                    return NotFound("user not found");
            }
            else
                return NotFound("face not found");
        }

        // DELETE: api/Facesv2/5 
        [HttpDelete("{id}")]
        public async Task<ActionResult<Face>> DeleteFace(int id)
        {
            var face = await _context.Faces.FindAsync(id);
            if (face == null)
                return NotFound();

            _context.Faces.Remove(face);
            await _context.SaveChangesAsync();

            return face;
        }

        private bool FaceExists(int id)
        {
            return _context.Faces.Any(e => e.Id == id);
        }
    }
}
