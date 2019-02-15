using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace oneroom_api.Model
{
    public class User
    {
        [Key]
        int Id;
        public Guid UserId { get; set; }
        public DateTime CreationDate { get; } = new DateTime();
        [Required]
        public string Name { get; set; }
        [Required]
        [Url]
        public string UrlAvatar { get; set; }
        public List<Face> Faces { get; set; } = new List<Face>();
    }
}
