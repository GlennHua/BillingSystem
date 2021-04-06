using System;
using System.Collections.Generic;

#nullable disable

namespace BillSystem.Models
{
    public partial class Billdetail
    {
        public int Id { get; set; }
        public int BillId { get; set; }
        public int ProdId { get; set; }
        public int Quantity { get; set; }
        public int UnitPrice { get; set; }

        public virtual Bill Bill { get; set; }
        public virtual Product Prod { get; set; }
    }
}
