using Microsoft.EntityFrameworkCore;
using oneroom_api.Model;

namespace oneroom_api.Model
{
    public class OneRoomContext : DbContext
    {
        public DbSet<Face> Faces { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Game> Games { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<Challenge> Challenges { get; set; }

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
            modelBuilder.Entity<Game>()
                .HasIndex(g => g.GroupName)
                .IsUnique();
            modelBuilder.Entity<User>()
                .HasIndex(u => u.UserId)
                .IsUnique();

            // OnDelete = Cascade
            modelBuilder.Entity<Team>()
                .HasOne<Game>()
                .WithMany(g => g.Teams)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<User>()
                .HasOne<Team>()
                .WithMany(t => t.Users)
                .OnDelete(DeleteBehavior.ClientSetNull);
            modelBuilder.Entity<User>()
                .HasOne<Game>()
                .WithMany(g => g.Users)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Face>()
                .HasOne<User>()
                .WithMany(u => u.Faces)
                .OnDelete(DeleteBehavior.Cascade);
        }

    }
}
