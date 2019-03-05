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
                var faces = u.Faces.OrderByDescending(f => f.CreationDate).Take(10).ToList();

                u.Age = Math.Floor(faces.Average(f => f.Age));
                var male = faces.Count(f => f.IsMale);
                var female = faces.Count() - male;
                u.Gender = male > female ? GenderEnum.MALE : GenderEnum.FEMALE;
                u.MoustacheLevel = Math.Round(faces.Average(f => f.MoustacheLevel));
                u.BeardLevel = Math.Round(faces.Average(f => f.BeardLevel));
                u.BaldLevel = Math.Round(faces.Average(f => f.BaldLevel));
                u.HairLength = faces.First().HairLength;
                u.HairColor = faces.First().HairColor;
                u.SkinColor = faces.First().SkinColor;
                u.RecognizedDate = faces.First().CreationDate;
                u.SmileLevel = faces.First().SmileLevel;
                u.GlassesType = faces.First().GlassesType;
                u.EmotionDominant = faces.First().EmotionDominant;

                u.Recognized = u.Faces.Count();
            }
        }
    }
}
