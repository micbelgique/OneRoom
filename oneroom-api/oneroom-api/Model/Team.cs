using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace oneroom_api.Model
{
    public class Team
    {
        public int TeamId { get; set;}
        public DateTime CreationDate { get; set; } = DateTime.Now;
        public List<User> Users { get; set; } = new List<User>();
    }
}
