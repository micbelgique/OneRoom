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
                var faces = u.Faces.OrderBy(f => f.CreationDate).Take(10).ToList();

                u.Age = Math.Floor(faces.Average(f => f.Age));
                var male = faces.Count(f => f.IsMale);
                var female = faces.Count() - male;
                u.Gender = male > female ? GenderEnum.MALE : GenderEnum.FEMALE;
                u.MoustacheLevel = Math.Round(faces.Average(f => f.MoustacheLevel));
                u.BeardLevel = Math.Round(faces.Average(f => f.BeardLevel));
                u.BaldLevel = Math.Round(faces.Average(f => f.BaldLevel));
                u.HairColor = faces.Last().HairColor;
                u.SkinColor = faces.Last().SkinColor;
                u.CreationDate = faces.Last().CreationDate;
                u.SmileLevel = faces.Last().SmileLevel;
                u.GlassesType = faces.Last().GlassesType;
                u.EmotionDominant = faces.Last().EmotionDominant;
            }
        }
    }
}
