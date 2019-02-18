﻿using System;
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
    public class GroupsController : ControllerBase
    {
        private readonly OneRoomContext _context;

        public GroupsController(OneRoomContext context)
        {
            _context = context;
        }

        // OPTIONS: api/Groups
        [HttpOptions]
        [ProducesResponseType(200)]
        public ActionResult OptionsGroups()
        {
            return Ok();
        }

        // GET: api/Groups
        [HttpGet]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<IEnumerable<Group>>>))]
        public async Task<ActionResult<IEnumerable<Group>>> GetGroups()
        {
            return await _context.Group.ToListAsync();
        }

        // GET: api/Groups/5
        [HttpGet("{id}")]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<Group>>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<Group>> GetGroup(Guid id)
        {
            var group = await _context.Group.FindAsync(id);

            if (group == null)
            {
                return NotFound();
            }

            return group;
        }

        // PUT: api/Groups/5
        [HttpPut("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> PutGroup(Guid id, Group group)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest("Group invalid");
            }

            _context.Entry(group).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GroupExists(id))
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

        // POST: api/Groups
        [HttpPost]
        [ProducesResponseType(201, Type = typeof(Task<ActionResult<Group>>))]
        [ProducesResponseType(400)]
        public async Task<ActionResult<Group>> PostGroup(Group group)
        {
            if(group == null)
            {
                return BadRequest();
            }

            if(!ModelState.IsValid)
            {
                return BadRequest();
            }

            _context.Group.Add(group);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetGroup", new { id = group.GroupId }, group);
        }

        // DELETE: api/Groups/5
        [HttpDelete("{id}")]
        [ProducesResponseType(200, Type = typeof(Task<ActionResult<Group>>))]
        [ProducesResponseType(404)]
        public async Task<ActionResult<Group>> DeleteGroup(Guid id)
        {
            var group = await _context.Group.FindAsync(id);
            if (group == null)
            {
                return NotFound();
            }

            _context.Group.Remove(group);
            await _context.SaveChangesAsync();

            return group;
        }

        private bool GroupExists(Guid id)
        {
            return _context.Group.Any(e => e.GroupId.Equals(id));
        }
    }
}