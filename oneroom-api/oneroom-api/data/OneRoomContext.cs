using Microsoft.EntityFrameworkCore;

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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Face>()
                .HasIndex(f => f.FaceId);
            modelBuilder.Entity<Group>()
                .HasIndex(g => g.GroupId);
            modelBuilder.Entity<User>()
                .HasIndex(u => u.UserId);
        }
    }
}
