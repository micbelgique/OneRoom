using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;

namespace oneroom_api.Model
{
    public static class SeedData
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            return;
            using (var context = new OneRoomContext(
                serviceProvider.GetRequiredService<
                    DbContextOptions<OneRoomContext>>()))
            {
                // Look for any Users.
                if (context.Users.Any())
                {
                    return;   // DB has been seeded
                }

                // Look for any Faces.
                if (context.Faces.Any())
                {
                    return;   // DB has been seeded
                }

                Face face = new Face
                {
                    FaceId = new Guid(),
                    Age = 24,
                    IsMale = true,
                    SmileLevel = 0,
                    MoustacheLevel = 0.1,
                    BeardLevel = 0.1,
                    GlassesType = Microsoft.Azure.CognitiveServices.Vision.Face.Models.GlassesType.ReadingGlasses,
                    BaldLevel = 0.15,
                    HairColor = "brown"
                };

                List<Face> faces = new List<Face>();
                faces.Add(face);

                context.Faces.AddRange(
                    face
                );

                context.Users.AddRange(
                    new User
                    {
                        UserId = new Guid(),
                        UrlAvatar = "https://avatars.dicebear.com/v2/avataaars/OneRoomMale.svg?options[facialHairChance]=100&options[clothes][]=blazer&options[eyes][]=defaultValue&options[eyebrow][]=defaultValue&options[mouth][]=serious&options[skin][]=light&options[topChance]=100&options[accessories][]=round&options[accessoriesChance]=100&options[facialHair][]=magestic&options[hairColor][]=brown&options[facialHairColor][]=brown",
                        Name = "Joueur 1",
                        Faces = faces
                    }
                );
                context.SaveChanges();
            }
        }
    }
}