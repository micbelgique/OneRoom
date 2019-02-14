using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace oneroom_api.Model
{
    public class Person
    {
        public Guid PersonId { get; set; }
        [Required]
        public string Name { get; set; }
        public List<Face> Faces { get; set; } = new List<Face>();

        public Person() { }
       
    }
}
