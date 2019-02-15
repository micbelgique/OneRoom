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
    public class FacesController : ControllerBase
    {
        private readonly OneRoomContext _context;

        public FacesController(OneRoomContext context)
        {
            _context = context;
        }

        // GET: api/Faces
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Face>>> GetFace()
        {
            return await _context.Faces.ToListAsync();
        }

        // GET: api/Faces/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Face>> GetFace(int id)
        {
            var face = await _context.Faces.FindAsync(id);

            if (face == null)
            {
                return NotFound();
            }

            return face;
        }

        // PUT: api/Faces/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFace(int id, Face face)
        {
            if (id != face.Id)
            {
                return BadRequest();
            }

            _context.Entry(face).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FaceExists(id))
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

        // POST: api/Faces
        [HttpPost]
        public async Task<ActionResult<Face>> PostFace(Face face)
        {
            _context.Faces.Add(face);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if ( FaceExists(face.Id))
                {
                    return Conflict(new { message = $"An existing record for the face with the id `{face.FaceId}` was already found." });
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetFace", new { id = face.FaceId }, face);
        }

        // DELETE: api/Faces/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Face>> DeleteFace(int id)
        {
            var face = await _context.Faces.FindAsync(id);
            if (face == null)
            {
                return NotFound();
            }

            _context.Faces.Remove(face);
            await _context.SaveChangesAsync();

            return face;
        }

        private bool FaceExists(int id)
        {
            return _context.Faces.Any(f => f.Id == id);
        }
    }
}
