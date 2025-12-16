using POS_VISNAM.Data;
using POS_VISNAM.Services.IService;
using POS_VISNAM.Services.Models.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace POS_VISNAM.Services.Service
{
    public class ProductService : IProductService
    {
        public List<ProductResponse> getAll()
        {
            var products = InMemoryData.Products.Where(p => p.IsActive).Select(p => new ProductResponse
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price
            }).ToList();

            return products;
        }
    }
}
