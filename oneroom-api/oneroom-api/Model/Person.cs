using System;
using System.Collections.Generic;

namespace oneroom_api.Model
{
    public class Person
    {
        public Guid PersonId { get; set; }
        public string Name { get; set; }
        public List<Face> Faces { get; set; } = new List<Face>();

        public Person() { }

        public Person(Person p)
        {
            this.Faces = p.Faces;
            this.Name = p.Name;
            this.PersonId = p.PersonId;
        }

        
    }
}
