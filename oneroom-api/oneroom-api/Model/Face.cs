using Microsoft.Azure.CognitiveServices.Vision.Face.Models;
using System;
using System.ComponentModel.DataAnnotations;

namespace oneroom_api.Model
{
    public class Face
    {
        public Guid FaceId { get; set; }
        public DateTime CreationDate { get; set; } = DateTime.Now;
        [Range(0,150)]
        public double Age { get; set; }
        public bool IsMale { get; set; }
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
        public string HairColor { get; set; }
    }
}