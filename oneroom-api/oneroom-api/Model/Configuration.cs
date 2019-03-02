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
        // in millisec
        public double RefreshRate { get; set; }
    }
}
