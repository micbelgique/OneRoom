using oneroom_api.Utilities;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace oneroom_api.Model
{
    public class User : Person
    {
        public int UserId { get; set; }
        [Required]
        [Url]
        public string UrlAvatar { get; set; }

        public User() { }
    }
}
