using Microsoft.Azure.CognitiveServices.Vision.Face.Models;
using System;
using System.ComponentModel.DataAnnotations;

namespace oneroom_api.Model
{
    public class Face
    {
        public Guid FaceId { get; set; }
        public DateTime CreationDate { get; set; } = DateTime.Now;
        [Range(0, 150)]
        public double Age { get; set; }
        public bool IsMale { get; set; }
        [Required]
        public string EmotionDominant { get; set; }
        [Range(0, 1)]
        public double SmileLevel { get; set; }
        [Range(0, 1)]
        public double MoustacheLevel { get; set; }
        [Range(0, 1)]
        public double BeardLevel { get; set; }
        public GlassesType GlassesType { get; set; }
        [Range(0, 1)]
        public double BaldLevel { get; set; }
        [Required]
        public string HairColor { get; set; }
        public string HairLength { get; set; }
        public string SkinColor { get; set; }

    }

    public class SkinColorEnum
    {
        public static string Black = "black";
        public static string Caucasian = "caucasian";
        public static string Azian = "azian";
    }

    public class HairColorEnum
    {
        public static string Other = "other";
        public static string Unknown = "unknown";
        public static string Blond = "blond";
        public static string Red = "red";
        public static string White = "white";
    }

    public class GlassesTypeEnum
    {
        public static int NoGlasses = 0;
        public static int ReadingGlasses = 1;
        public static int Sunglasses = 2;
        public static int SwimmingGoggles = 3;
    }

    public class EmotionEnum
    {
        public static string Anger = "anger";
        public static string Contempt = "contempt";
        public static string Disgust = "disgust";
        public static string Fear = "fear";
        public static string Happinness = "happinness";
        public static string Neutral = "neutral";
        public static string Sadness = "sadness";
        public static string Surprise = "surprise";
    }

}