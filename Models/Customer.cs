using System;
using System.Collections.Generic;

#nullable disable

namespace BillSystem.Models
{
    public partial class Customer
    {
        public Customer()
        {
            Bills = new HashSet<Bill>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }

        public virtual ICollection<Bill> Bills { get; set; }
    }
}
