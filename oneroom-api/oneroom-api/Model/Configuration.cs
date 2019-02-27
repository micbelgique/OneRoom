using System.ComponentModel.DataAnnotations;

namespace oneroom_api.Model
{
    public class Configuration
    {
        public int Id { get; set; }
        [Required]
        [Url]
        public string FaceEndpoint { get; set; }
        [Required]
        public string FaceKey { get; set; }
        [Required]
        [Url]
        public string VisionEndpoint { get; set; }
        [Required]
        public string VisionKey { get; set; }
    }
}
