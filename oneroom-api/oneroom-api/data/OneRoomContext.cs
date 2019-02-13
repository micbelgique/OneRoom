using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace oneroom_api.Model
{
    public class OneRoomContext : DbContext
    {
        public DbSet<User> Users { get; set; }

        public OneRoomContext(DbContextOptions<OneRoomContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Face>()
                .Ignore(f => f.Rectangle);
        }

        public DbSet<Face> Face { get; set; }
    }
}
