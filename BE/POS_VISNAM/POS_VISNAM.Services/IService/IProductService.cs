using POS_VISNAM.Services.Models.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace POS_VISNAM.Services.IService
{
    public interface IProductService
    {
        List<ProductResponse> getAll();
    }
}
