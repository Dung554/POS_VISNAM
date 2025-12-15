using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace POS_VISNAM.Services.Models.Responses
{
    public class ProductResponse
    {
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }
}
