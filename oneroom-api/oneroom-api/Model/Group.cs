using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace oneroom_api.Model
{
    public class Group
    {
        public Guid GroupId { get; set; }
        public string Name { get; set; }
        public DateTime CreationDate { get; } = new DateTime();
        public List<User> Users { get; set; } = new List<User>();

    }
}
