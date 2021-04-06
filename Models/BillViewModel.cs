using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BillSystem.Models
{
    public class BillViewModel
    {

        public int BillId { get; set; }
        public Customer Customer {get;set;}
        public List<Billdetail> Details { get; set; } 
        public int TotalPrice { get; set; }


    }
}
