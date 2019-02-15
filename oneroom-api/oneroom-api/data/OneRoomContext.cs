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
            // Unique <Type>Id
            modelBuilder.Entity<Face>()
                .HasIndex(f => f.FaceId)
                .IsUnique();
            modelBuilder.Entity<Group>()
                .HasIndex(g => g.GroupId)
                .IsUnique();
            modelBuilder.Entity<User>()
                .HasIndex(u => u.UserId)
                .IsUnique();

            // OnDelete = Cascade
            modelBuilder.Entity<Face>()
                .HasOne<User>()
                .WithMany(u => u.Faces)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<User>()
                .HasOne<Group>()
                .WithMany(g => g.Users)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
