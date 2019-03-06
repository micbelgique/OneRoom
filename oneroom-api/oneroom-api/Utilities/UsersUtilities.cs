using oneroom_api.Model;
using System;
using System.Linq;

namespace oneroom_api.Utilities
{
    public class UsersUtilities
    {
        // recalculate user stats based on the 10 last faces
        public static void OptimizeResults(User u)
        {
            if(u.Faces.Count > 0)
            {
                // pick faces
                var faces = u.Faces.OrderByDescending(f => f.CreationDate).ToList();

                // average age
                u.Age = Math.Floor(faces.Average(f => f.Age));

                // pick greater occurence gender
                var male = faces.Count(f => f.IsMale);
                var female = faces.Count() - male;
                u.Gender = male > female ? GenderEnum.MALE : GenderEnum.FEMALE;

                // average beard / moustache / bald level
                u.MoustacheLevel = Math.Round(faces.Average(f => f.MoustacheLevel));
                u.BeardLevel = Math.Round(faces.Average(f => f.BeardLevel));
                u.BaldLevel = Math.Round(faces.Average(f => f.BaldLevel));

                // group by hairlength
                var groupsHairLength = faces.GroupBy(f => f.HairLength);

                int count = 0;

                // pick greater occurence
                foreach(var gHairLength in groupsHairLength)
                {
                    if(gHairLength.Count() > count)
                    {
                        count = gHairLength.Count();
                        u.HairLength = gHairLength.Last().HairLength;
                    }
                }

                // group by haircolor
                var groupsHairColor = faces.GroupBy(f => f.HairColor);

                count = 0;

                // pick greater occurence
                foreach (var gHairColor in groupsHairColor)
                {
                    if (gHairColor.Count() > count)
                    {
                        count = gHairColor.Count();
                        u.HairColor = gHairColor.Last().HairColor;
                    }
                }

                var groupsSkinColor = faces.GroupBy(f => f.SkinColor);

                count = 0;

                // pick greater occurence
                foreach (var gSkinColor in groupsSkinColor)
                {
                    if (gSkinColor.Count() > count)
                    {
                        count = gSkinColor.Count();
                        u.SkinColor = gSkinColor.Last().SkinColor;
                    }
                }

                // last recognized date
                u.RecognizedDate = faces.First().CreationDate;

                //pick last emotion
                u.SmileLevel = faces.First().SmileLevel;
                u.GlassesType = faces.First().GlassesType;
                u.EmotionDominant = faces.First().EmotionDominant;

                // recognized count
                u.Recognized = u.Faces.Count();
            }
        }

        // TODO : generate avatar here and remove code from register and leaderboard
        public static void GenerateAvatar(User u)
        {

        }
    }
}
