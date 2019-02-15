using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace oneroom_api.Model
{
    public class Group
    {
        [Key]
        public int Id { get; set; }
        public Guid GroupId { get; set; }
        public DateTime CreationDate { get; set; }
        public List<User> Users { get; set; } = new List<User>();

    }
}
