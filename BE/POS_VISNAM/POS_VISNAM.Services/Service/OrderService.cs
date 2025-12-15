using POS_VISNAM.Data;
using POS_VISNAM.Repositories.Entities;
using POS_VISNAM.Services.IService;
using POS_VISNAM.Services.Models.Requsets;
using POS_VISNAM.Services.Models.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace POS_VISNAM.Services.Service
{
    public class OrderService : IOrderService
    {
        public List<OrderResponse> getAll()
        {
            var orders = InMemoryData.Orders.Select(o => new OrderResponse
            {
                OrderCode = o.OrderCode,
                TotalAmount = o.TotalAmount,
                CreatedAt = o.CreatedAt
            }).ToList();
            return orders;
        }

        public Order CreateOrder(OrderRequest request)
        {
            if(request.Items == null || !request.Items.Any())
            {
                throw new ArgumentException("Order must contain at least one item.");
            }

            var order = new Order
            {
                Id = InMemoryData.NextProductId,
                OrderCode = InMemoryData.GenerateOrderCode(),
                CreatedAt = DateTime.Now
            };

            decimal totalAmount = 0;

            foreach (var item in request.Items)
            {
                var product = InMemoryData.Products
                    .FirstOrDefault(p => p.Id == item.ProductId);

                if (product == null) continue;

                var subtotal = product.Price * item.Quantity;

                order.OrderItems.Add(new OrderItem
                {
                    Id = InMemoryData.NextOrderId,
                    OrderId = order.Id,
                    ProductId = product.Id,
                    Quantity = item.Quantity,
                    Subtotal = subtotal
                });

                totalAmount += subtotal;
            }

            order.TotalAmount = totalAmount;
            InMemoryData.Orders.Add(order);

            return order;
        }
    }
}
