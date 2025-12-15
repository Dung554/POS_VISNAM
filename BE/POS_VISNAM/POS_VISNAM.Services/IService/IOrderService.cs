using POS_VISNAM.Repositories.Entities;
using POS_VISNAM.Services.Models.Requsets;
using POS_VISNAM.Services.Models.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace POS_VISNAM.Services.IService
{
    public interface IOrderService
    {
        List<OrderResponse> getAll();
        Order CreateOrder(OrderRequest request);
    }
}
