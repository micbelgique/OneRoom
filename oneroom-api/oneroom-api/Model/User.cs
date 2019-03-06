using Microsoft.Azure.CognitiveServices.Vision.Face.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace oneroom_api.Model
{
    public class User
    {
        public Guid UserId { get; set; }
        public DateTime CreationDate { get; set; } = DateTime.Now;
        // last time the user was recognized
        public DateTime RecognizedDate { get; set; } = DateTime.Now;
        [Required]
        public string Name { get; set; }
        [Required]
        public string UrlAvatar { get; set; }
        public List<Face> Faces { get; set; } = new List<Face>();

        // recalculated details
        public double Age { get; set; }
        public Gender Gender { get; set; }
        [Range(0, 1)]
        public double MoustacheLevel { get; set; }
        [Range(0, 1)]
        public double BeardLevel { get; set; }
        [Range(0, 1)]
        public double BaldLevel { get; set; }
        [Range(0, 1)]
        public double SmileLevel { get; set; }
        // TODO CHANGE TO HairColorType
        public string HairColor { get; set; }
        public string HairLength { get; set; }
        // TODO CHANGE TO SkinColorEnum
        public string SkinColor { get; set; }
        public GlassesType GlassesType { get; set; }
        // TODO CHANGE TO EmotionEnum
        public string EmotionDominant { get; set; }

        public int Recognized { get; set; }

    }
}
