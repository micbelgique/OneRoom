using System;
using System.Collections.Generic;

namespace oneroom_api.Model
{
    public class Team
    {
        public int TeamId { get; set;}
        public DateTime CreationDate { get; set; } = DateTime.Now;
        public List<User> Users { get; set; } = new List<User>();
    }
}
