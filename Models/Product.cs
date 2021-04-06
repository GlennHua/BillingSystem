using System;
using System.Collections.Generic;

#nullable disable

namespace BillSystem.Models
{
    public partial class Product
    {
        public Product()
        {
            Billdetails = new HashSet<Billdetail>();
        }

        public int Id { get; set; }
        public int Price { get; set; }
        public string Name { get; set; }

        public virtual ICollection<Billdetail> Billdetails { get; set; }
    }
}
