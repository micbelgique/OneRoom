﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using oneroom_api.Model;

namespace oneroom_api.Migrations
{
    [DbContext(typeof(OneRoomContext))]
    [Migration("20190218085939_DateTimeAdd2")]
    partial class DateTimeAdd2
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.2-servicing-10034")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

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

                    b.Property<bool>("IsMale");

                    b.Property<double>("MoustacheLevel");

                    b.Property<double>("SmileLevel");

                    b.Property<Guid?>("UserId");

                    b.HasKey("FaceId");

                    b.HasIndex("FaceId")
                        .IsUnique();

                    b.HasIndex("UserId");

                    b.ToTable("Faces");
                });

            modelBuilder.Entity("oneroom_api.Model.Group", b =>
                {
                    b.Property<Guid>("GroupId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreationDate");

                    b.Property<string>("Name");

                    b.HasKey("GroupId");

                    b.HasIndex("GroupId")
                        .IsUnique();

                    b.ToTable("Group");
                });

            modelBuilder.Entity("oneroom_api.Model.User", b =>
                {
                    b.Property<Guid>("UserId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreationDate");

                    b.Property<Guid?>("GroupId");

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<string>("UrlAvatar")
                        .IsRequired();

                    b.HasKey("UserId");

                    b.HasIndex("GroupId");

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

            modelBuilder.Entity("oneroom_api.Model.User", b =>
                {
                    b.HasOne("oneroom_api.Model.Group")
                        .WithMany("Users")
                        .HasForeignKey("GroupId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
