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
        public int Id { get; }
        public Guid GroupId { get; set; }
        public List<User> Users = new List<User>();
        public DateTime CreationDate { get; } = new DateTime();

    }
}
