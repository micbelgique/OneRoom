using Microsoft.EntityFrameworkCore;
using oneroom_api.Model;

namespace oneroom_api.Model
{
    public class OneRoomContext : DbContext
    {
        public DbSet<Face> Faces { get; set; }
        public DbSet<User> Users { get; set; }

        public OneRoomContext(DbContextOptions<OneRoomContext> options)
            : base(options)
        {
        }

        public DbSet<oneroom_api.Model.Group> Group { get; set; }
    }
}
