using System.ComponentModel.DataAnnotations;

namespace oneroom_api.Model
{
    public class Configuration
    {
        public int Id { get; set; }
        [Url]
        public string FaceEndpoint { get; set; }
        public string FaceKey { get; set; }
        [Url]
        public string VisionEndpoint { get; set; }
        public string VisionKey { get; set; }
        // skincolor
        [Url]
        public string VisionEndpointSkinColor { get; set; }
        public string VisionKeySkinColor { get; set; }
        // in millisec
        public double RefreshRate { get; set; }
        // value to confirm a player
        public int MinimumRecognized { get; set; } = 3;
    }
}
