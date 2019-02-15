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
        int Id;
        Guid GroupId;
        List<User> Users = new List<User>();
        DateTime CreationDate;

    }
}
