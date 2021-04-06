using System;
using System.Collections.Generic;

#nullable disable

namespace BillSystem.Models
{
    public partial class Bill
    {
        public Bill()
        {
            Billdetails = new HashSet<Billdetail>();
        }

        public int Id { get; set; }
        public int? CustId { get; set; }

        public virtual Customer Cust { get; set; }
        public virtual ICollection<Billdetail> Billdetails { get; set; }
    }
}
