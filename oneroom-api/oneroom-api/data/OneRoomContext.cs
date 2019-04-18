using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using oneroom_api.Model;

namespace oneroom_api.data
{
    public class OneRoomContext : DbContext
    {
        public DbSet<Face> Faces { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Game> Games { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<Challenge> Challenges { get; set; }
        public DbSet<Scenario> Scenarios { get; set; }

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

            // Many to many manual handle
            modelBuilder.Entity<ScenarioChallenge>()
                .HasKey(sc => new { sc.ScenarioId, sc.ChallengeId });

            modelBuilder.Entity<ScenarioChallenge>()
                .HasOne(sc => sc.Scenario)
                .WithMany(s => s.ScenarioChallenges)
                .HasForeignKey(sc => sc.ScenarioId);

            modelBuilder.Entity<ScenarioChallenge>()
                .HasOne(sc => sc.Challenge)
                .WithMany(c => c.ScenarioChallenges)
                .HasForeignKey(sc => sc.ChallengeId);

            modelBuilder.Entity<TeamChallenge>()
                .HasKey(tc => new { tc.TeamId, tc.ChallengeId });

            modelBuilder.Entity<TeamChallenge>()
                .HasOne(tc => tc.Team)
                .WithMany(t => t.TeamChallenges)
                .HasForeignKey(tc => tc.TeamId);

            modelBuilder.Entity<TeamChallenge>()
                .HasOne(tc => tc.Challenge)
                .WithMany(c => c.TeamChallenges)
                .HasForeignKey(tc => tc.ChallengeId);

            // Json convert List and dictionnary
            /*
             * https://www.jerriepelser.com/blog/store-dictionary-as-json-using-ef-core-21/
             * when updating the entity and changing items in the dictionary, 
             * the EF change tracking does not pick up on the fact that the dictionary was updated, 
             * so you will need to explicitly call the Update method on the DbSet<> to set the entity 
             * to modified in the change tracker.
             */
            modelBuilder.Entity<Challenge>()
                .Property(c => c.Hints)
                .HasConversion(
                    h => JsonConvert.SerializeObject(h),
                    h => JsonConvert.DeserializeObject<List<string>>(h));
            modelBuilder.Entity<Challenge>()
                .Property(c => c.Answers)
                .HasConversion(
                    a => JsonConvert.SerializeObject(a),
                    a => JsonConvert.DeserializeObject<List<string>>(a));
            modelBuilder.Entity<Challenge>()
                .Property(ch => ch.Config)
                .HasConversion(
                    co => JsonConvert.SerializeObject(co),
                    co => JsonConvert.DeserializeObject<Dictionary<string, string>>(co));
        }

    }
}
