﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using oneroom_api.data;

namespace oneroom_api.Migrations
{
    [DbContext(typeof(OneRoomContext))]
    [Migration("20190419074311_data")]
    partial class data
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.4-servicing-10062")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("oneroom_api.Model.Challenge", b =>
                {
                    b.Property<int>("ChallengeId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Answers");

                    b.Property<string>("AppName");

                    b.Property<string>("Config");

                    b.Property<string>("Data");

                    b.Property<string>("Description");

                    b.Property<string>("Hints");

                    b.Property<int>("Order");

                    b.Property<int>("TimeBox");

                    b.Property<string>("Title");

                    b.HasKey("ChallengeId");

                    b.ToTable("Challenges");
                });

            modelBuilder.Entity("oneroom_api.Model.Configuration", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("FaceEndpoint");

                    b.Property<string>("FaceKey");

                    b.Property<int>("MinimumRecognized");

                    b.Property<double>("RefreshRate");

                    b.Property<string>("VisionEndpoint");

                    b.Property<string>("VisionEndpointSkinColor");

                    b.Property<string>("VisionKey");

                    b.Property<string>("VisionKeySkinColor");

                    b.HasKey("Id");

                    b.ToTable("Configuration");
                });

            modelBuilder.Entity("oneroom_api.Model.Face", b =>
                {
                    b.Property<Guid>("FaceId")
                        .ValueGeneratedOnAdd();

                    b.Property<double>("Age");

                    b.Property<double>("BaldLevel");

                    b.Property<double>("BeardLevel");

                    b.Property<DateTime>("CreationDate");

                    b.Property<string>("EmotionDominant");

                    b.Property<int>("GlassesType");

                    b.Property<string>("HairColor");

                    b.Property<string>("HairLength");

                    b.Property<bool>("IsMale");

                    b.Property<double>("MoustacheLevel");

                    b.Property<string>("SkinColor");

                    b.Property<double>("SmileLevel");

                    b.Property<Guid?>("UserId");

                    b.HasKey("FaceId");

                    b.HasIndex("FaceId")
                        .IsUnique();

                    b.HasIndex("UserId");

                    b.ToTable("Faces");
                });

            modelBuilder.Entity("oneroom_api.Model.Game", b =>
                {
                    b.Property<int>("GameId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("ConfigId");

                    b.Property<DateTime>("CreationDate");

                    b.Property<string>("GroupName")
                        .IsRequired();

                    b.Property<int?>("ScenarioId");

                    b.Property<int>("State");

                    b.HasKey("GameId");

                    b.HasIndex("ConfigId");

                    b.HasIndex("GroupName")
                        .IsUnique();

                    b.HasIndex("ScenarioId");

                    b.ToTable("Games");
                });

            modelBuilder.Entity("oneroom_api.Model.Scenario", b =>
                {
                    b.Property<int>("ScenarioId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Description");

                    b.Property<string>("Title");

                    b.HasKey("ScenarioId");

                    b.ToTable("Scenarios");
                });

            modelBuilder.Entity("oneroom_api.Model.ScenarioChallenge", b =>
                {
                    b.Property<int>("ScenarioId");

                    b.Property<int>("ChallengeId");

                    b.HasKey("ScenarioId", "ChallengeId");

                    b.HasIndex("ChallengeId");

                    b.ToTable("ScenarioChallenge");
                });

            modelBuilder.Entity("oneroom_api.Model.Team", b =>
                {
                    b.Property<int>("TeamId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("CreationDate");

                    b.Property<int>("GameId");

                    b.Property<string>("TeamColor");

                    b.Property<string>("TeamName");

                    b.HasKey("TeamId");

                    b.HasIndex("GameId");

                    b.ToTable("Teams");
                });

            modelBuilder.Entity("oneroom_api.Model.TeamChallenge", b =>
                {
                    b.Property<int>("TeamId");

                    b.Property<int>("ChallengeId");

                    b.Property<bool>("Completed");

                    b.HasKey("TeamId", "ChallengeId");

                    b.HasIndex("ChallengeId");

                    b.ToTable("TeamChallenge");
                });

            modelBuilder.Entity("oneroom_api.Model.User", b =>
                {
                    b.Property<Guid>("UserId")
                        .ValueGeneratedOnAdd();

                    b.Property<double>("Age");

                    b.Property<double>("BaldLevel");

                    b.Property<double>("BeardLevel");

                    b.Property<DateTime>("CreationDate");

                    b.Property<string>("EmotionDominant");

                    b.Property<int>("GameId");

                    b.Property<int>("Gender");

                    b.Property<int>("GlassesType");

                    b.Property<string>("HairColor");

                    b.Property<string>("HairLength");

                    b.Property<bool>("IsFirstConnected");

                    b.Property<double>("MoustacheLevel");

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<int>("Recognized");

                    b.Property<DateTime>("RecognizedDate");

                    b.Property<string>("SkinColor");

                    b.Property<double>("SmileLevel");

                    b.Property<int?>("TeamId");

                    b.Property<string>("UrlAvatar");

                    b.HasKey("UserId");

                    b.HasIndex("GameId");

                    b.HasIndex("TeamId");

                    b.HasIndex("UserId")
                        .IsUnique();

                    b.ToTable("Users");
                });

            modelBuilder.Entity("oneroom_api.Model.Face", b =>
                {
                    b.HasOne("oneroom_api.Model.User")
                        .WithMany("Faces")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("oneroom_api.Model.Game", b =>
                {
                    b.HasOne("oneroom_api.Model.Configuration", "Config")
                        .WithMany()
                        .HasForeignKey("ConfigId");

                    b.HasOne("oneroom_api.Model.Scenario", "Scenario")
                        .WithMany("Games")
                        .HasForeignKey("ScenarioId");
                });

            modelBuilder.Entity("oneroom_api.Model.ScenarioChallenge", b =>
                {
                    b.HasOne("oneroom_api.Model.Challenge", "Challenge")
                        .WithMany("ScenarioChallenges")
                        .HasForeignKey("ChallengeId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("oneroom_api.Model.Scenario", "Scenario")
                        .WithMany("ScenarioChallenges")
                        .HasForeignKey("ScenarioId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("oneroom_api.Model.Team", b =>
                {
                    b.HasOne("oneroom_api.Model.Game")
                        .WithMany("Teams")
                        .HasForeignKey("GameId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("oneroom_api.Model.TeamChallenge", b =>
                {
                    b.HasOne("oneroom_api.Model.Challenge", "Challenge")
                        .WithMany("TeamChallenges")
                        .HasForeignKey("ChallengeId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("oneroom_api.Model.Team", "Team")
                        .WithMany("TeamChallenges")
                        .HasForeignKey("TeamId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("oneroom_api.Model.User", b =>
                {
                    b.HasOne("oneroom_api.Model.Game")
                        .WithMany("Users")
                        .HasForeignKey("GameId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("oneroom_api.Model.Team")
                        .WithMany("Users")
                        .HasForeignKey("TeamId");
                });
#pragma warning restore 612, 618
        }
    }
}
