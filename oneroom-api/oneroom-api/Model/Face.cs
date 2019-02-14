using Microsoft.Azure.CognitiveServices.Vision.Face.Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.Drawing;

namespace oneroom_api.Model
{
    public class Face
    {
        public Guid FaceId { get; set; }
        public double Age { get; set; }
        public bool IsMale { get; set; }
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
    }
}