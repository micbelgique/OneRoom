using Microsoft.Azure.CognitiveServices.Vision.Face.Models;
using oneroom_api.Model;
using System;
using System.Linq;
using System.Text;

namespace oneroom_api.Utilities
{
    public static class UsersUtilities
    {
        // recalculate user stats based on the 10 last faces
        public static void OptimizeResults(this User u)
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
                u.Gender = male > female ? Gender.Male : Gender.Female;

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

        public static void GenerateAvatar(this User u)
        {
            const string avataaarsEndPoint = "https://avataaars.io/?avatarStyle=Transparent";

            // Construct a stirng builder with a base url for a male avatar or a female one
            StringBuilder urlAvatar = new StringBuilder(avataaarsEndPoint);

            // Set Skin Color
            switch (u.SkinColor)
            {
                case "caucasian":
                    urlAvatar.Append("&skinColor=Pale");
                    break;
                case "black":
                    urlAvatar.Append("&skinColor=DarkBrown");
                    break;
                case "azian":
                    urlAvatar.Append("&skinColor=Yellow");
                    break;
                default:
                    urlAvatar.Append("&skinColor=Light");
                    break;
            }

            // Add glasses (or not)
            switch (u.GlassesType)
            {
                case GlassesType.ReadingGlasses:
                    urlAvatar.Append("&accessoriesType=Prescription02");
                    break;
                case GlassesType.Sunglasses:
                    urlAvatar.Append("&accessoriesType=Sunglasses");
                    break;
                default:
                    urlAvatar.Append("&accessoriesType=Blank");
                    break;
            }

            if (u.Faces.Count() == 1)
            {
                // Add Random Clothes
                double randClothes = ThreadSafeRandom.ThisThreadsRandom.NextDouble();
                switch (randClothes)
                {
                    case double i when i < (double)1 / 7:
                        urlAvatar.Append("&clotheType=GraphicShirt");
                        break;
                    case double i when i < (double)2 / 7:
                        urlAvatar.Append("&clotheType=CollarSweater");
                        break;
                    case double i when i < (double)3 / 7:
                        urlAvatar.Append("&clotheType=Hoodie");
                        break;
                    case double i when i < (double)4 / 7:
                        urlAvatar.Append("&clotheType=ShirtVNeck");
                        break;
                    case double i when i < (double)5 / 7:
                        urlAvatar.Append(u.Gender == Gender.Male ? "&clotheType=ShirtCrewNeck" : "&clotheType=ShirtScoopNeck");
                        break;
                    case double i when i < (double)6 / 7:
                        urlAvatar.Append("&clotheType=BlazerSweater");
                        break;
                    case double i when i < (double)7 / 7:
                        urlAvatar.Append("&clotheType=BlazerShirt");
                        break;
                }

                // Set a Random clothe color
                double randClothesColor = ThreadSafeRandom.ThisThreadsRandom.NextDouble();
                if (randClothes < (double)5 / 7)
                {
                    switch (randClothesColor) // All colors are include exept PastelYellow and PastelOrange due to skin color interference
                    {
                        case double i when i < (double)1 / 13:
                            urlAvatar.Append("&clotheColor=Black");
                            break;
                        case double i when i < (double)2 / 13:
                            urlAvatar.Append("&clotheColor=Blue01");
                            break;
                        case double i when i < (double)3 / 13:
                            urlAvatar.Append("&clotheColor=Blue02");
                            break;
                        case double i when i < (double)4 / 13:
                            urlAvatar.Append("&clotheColor=Blue03");
                            break;
                        case double i when i < (double)5 / 13:
                            urlAvatar.Append("&clotheColor=Gray01");
                            break;
                        case double i when i < (double)6 / 13:
                            urlAvatar.Append("&clotheColor=Gray02");
                            break;
                        case double i when i < (double)7 / 13:
                            urlAvatar.Append("&clotheColor=Heater");
                            break;
                        case double i when i < (double)8 / 13:
                            urlAvatar.Append("&clotheColor=PastelBlue");
                            break;
                        case double i when i < (double)9 / 13:
                            urlAvatar.Append("&clotheColor=PastelGreen");
                            break;
                        case double i when i < (double)10 / 13:
                            urlAvatar.Append("&clotheColor=PastelRed");
                            break;
                        case double i when i < (double)11 / 13:
                            urlAvatar.Append("&clotheColor=Pink");
                            break;
                        case double i when i < (double)12 / 13:
                            urlAvatar.Append("&clotheColor=Red");
                            break;
                        case double i when i < (double)13 / 13:
                            urlAvatar.Append("&clotheColor=White");
                            break;
                    }
                }

                // Set a Random graphic on clothe
                double randGraphicClothes = ThreadSafeRandom.ThisThreadsRandom.NextDouble();
                if (randClothes < (double)1 / 7)
                {
                    switch (randGraphicClothes)
                    {
                        case double i when i < (double)1 / 11:
                            urlAvatar.Append("&graphicType=Bat");
                            break;
                        case double i when i < (double)2 / 11:
                            urlAvatar.Append("&graphicType=Cumbia");
                            break;
                        case double i when i < (double)3 / 11:
                            urlAvatar.Append("&graphicType=Deer");
                            break;
                        case double i when i < (double)4 / 11:
                            urlAvatar.Append("&graphicType=Diamond");
                            break;
                        case double i when i < (double)5 / 11:
                            urlAvatar.Append("&graphicType=Hola");
                            break;
                        case double i when i < (double)6 / 11:
                            urlAvatar.Append("&graphicType=Pizza");
                            break;
                        case double i when i < (double)7 / 11:
                            urlAvatar.Append("&graphicType=Resist");
                            break;
                        case double i when i < (double)8 / 11:
                            urlAvatar.Append("&graphicType=Selena");
                            break;
                        case double i when i < (double)9 / 11:
                            urlAvatar.Append("&graphicType=Bear");
                            break;
                        case double i when i < (double)10 / 11:
                            urlAvatar.Append("&graphicType=SkullOutline");
                            break;
                        case double i when i < (double)11 / 11:
                            urlAvatar.Append("&graphicType=Skull");
                            break;
                    }
                }
            }

            // Set Facial Hair And Facial Hair Color
            if (u.Gender == Gender.Male)
            {
                switch(u.BeardLevel)
                {
                    case double d when d > 0.75:
                        urlAvatar.Append("&facialHairType=BeardMajestic");
                        break;
                    case double d when d > 0.50:
                        urlAvatar.Append("&facialHairType=BeardMedium");
                        break;
                    case double d when d > 0.25:
                        urlAvatar.Append("&facialHairType=BeardLight");
                        break;
                    default:
                        switch(u.MoustacheLevel)
                        {
                            case double d when d > 0.5:
                                urlAvatar.Append("&facialHairType=MoustacheMagnum");
                                break;
                            case double d when d > 0.25:
                                urlAvatar.Append("&facialHairType=MoustacheFancy");
                                break;
                            default:
                                urlAvatar.Append("&facialHairType=Blank");
                                break;
                        }
                        break;
                }
 
                switch (u.HairColor)
                {
                    case "other":
                    case "unknown":
                        urlAvatar.Append("&facialHairColor=Black");
                        break;
                    case "blond":
                        urlAvatar.Append("&facialHairColor=BlondeGolden");
                        break;
                    case "red":
                        urlAvatar.Append("&facialHairColor=Auburn");
                        break;
                    case "white":
                        urlAvatar.Append("&facialHairColor=SilverGray");
                        break;
                    default:
                        urlAvatar.Append("&facialHairColor="+ u.HairColor.UppercaseFirst());
                        break;
                }
            }
            else
            {
                urlAvatar.Append("&facialHairType=Blank");
            }

            // Hair and Hair Color
            if (u.BaldLevel <= 0.65)
            {
                if (u.Gender == Gender.Male)
                {
                    switch (u.HairLength)
                    {
                        case "short":
                            urlAvatar.Append("&topType=ShortHairShortFlat");
                            break;
                        case "mid":
                            urlAvatar.Append("&topType=LongHairBob");
                            break;
                        case "long":
                            urlAvatar.Append("&topType=LongHairStraightStrand");
                            break;
                    }
                }
                else
                {
                    switch (u.HairLength)
                    {
                        case "short":
                            urlAvatar.Append("&topType=ShortHairShaggyMullet");
                            break;
                        case "mid":
                            urlAvatar.Append("&topType=LongHairNotTooLong");
                            break;
                        case "long":
                            urlAvatar.Append("&topType=LongHairStraight2");
                            break;
                    }
                }

                // hair color
                switch (u.HairColor)
                {
                    case "other":
                    case "unknown":
                        urlAvatar.Append("&hairColor=Black");
                        break;
                    case "blond":
                        urlAvatar.Append("&hairColor=BlondeGolden");
                        break;
                    case "red":
                        urlAvatar.Append("&hairColor=Auburn");
                        break;
                    case "white":
                        urlAvatar.Append("&hairColor=SilverGray");
                        break;
                    default:
                        urlAvatar.Append("&hairColor=" + u.HairColor.UppercaseFirst());
                        break;
                }
            }
            else
            {
                urlAvatar.Append("&topType=NoHair");
            }

            // Change facial expression to match emotion
            switch (u.EmotionDominant)
            {
                case "anger":
                    {
                        urlAvatar.Append("&eyeType=Squint&eyebrowType=AngryNatural&mouthType=Concerned");
                        break;
                    }
                case "contempt":
                    {
                        urlAvatar.Append("&eyeType=Squint&eyebrowType=UpDownNatural&mouthType=Disbelief");
                        break;
                    }
                case "disgust":
                    {
                        urlAvatar.Append("&eyeType=Dizzy&eyebrowType=DefaultNatural&mouthType=Vomit");
                        break;
                    }
                case "fear":
                    {
                        urlAvatar.Append("&eyeType=Squint&eyebrowType=RaisedExcitedNatural&mouthType=ScreamOpen");
                        break;
                    }
                case "happiness":
                    {
                        urlAvatar.Append("&eyeType=Squint&eyebrowType=Default");
                        switch (u.SmileLevel)
                        {
                            case 1:
                                urlAvatar.Append("&mouthType=Grimace");
                                break;
                            case double d when d > 0.6:
                                urlAvatar.Append("&mouthType=Smile");
                                break;
                            default:
                                urlAvatar.Append("&mouthType=Twinkle");
                                break;
                        }
                        break;
                    }
                case "neutral":
                    {
                        urlAvatar.Append("&eyeType=Default&eyebrowType=Default");
                        switch (u.SmileLevel)
                        {
                            case double d when d > 0.6:
                                urlAvatar.Append("&mouthType=Smile");
                                break;
                            case double d when d > 0.3:
                                urlAvatar.Append("&mouthType=Twinkle");
                                break;
                            default:
                                urlAvatar.Append("&mouthType=Serious");
                                break;
                        }
                        break;
                    }
                case "sadness":
                    {
                        urlAvatar.Append("&eyeType=Squint&eyebrowType=Sad&mouthType=Sad");
                        break;
                    }
                case "surprise":
                    {
                        urlAvatar.Append("&eyeType=Surprised&eyebrowType=RaisedExcitedNatural&mouthType=Disbelief");
                        break;
                    }
            }

            // Assign the new UrlAvatar to the user
            u.UrlAvatar = urlAvatar.ToString();
        }
    }
}
