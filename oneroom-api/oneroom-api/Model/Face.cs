using Microsoft.Azure.CognitiveServices.Vision.Face.Models;
using System;
using System.Drawing;

namespace oneroom_api.Model
{
    public class Face
    {
        public Guid FaceId { get; set; }
        public double Age { get; set; }
        public bool IsMale { get; set; }
        public double SmileLevel { get; set; }
        public double MoustacheLevel { get; set; }
        public double BeardLevel { get; set; }
        public GlassesType GlassesType { get; set; }
        public double BaldLevel { get; set; }
        public string HairColor { get; set; }
        public Rectangle Rectangle { get; set; }
    }
}