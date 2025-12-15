using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace POS_VISNAM.Services.Models.Requsets
{
    public class OrderRequest
    {
        public List<OrderItemRequest> Items { get; set; } = new();
    }
    public class OrderItemRequest
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
