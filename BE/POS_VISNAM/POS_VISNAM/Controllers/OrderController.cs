using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using POS_VISNAM.Hubs;
using POS_VISNAM.Repositories.Entities;
using POS_VISNAM.Services.IService;
using POS_VISNAM.Services.Models.Requsets;
using POS_VISNAM.Services.Models.Responses;

namespace POS_VISNAM.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService orderService;
        private readonly IHubContext<OrderHub> hubContext;

        public OrderController(IOrderService orderService, IHubContext<OrderHub> hubContext)
        {
            this.orderService = orderService;
            this.hubContext = hubContext;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var orders = orderService.getAll();
            var response = new BaseResponse<List<OrderResponse>>
            {
                Code = 200,
                Success = true,
                Message = "Orders retrieved successfully",
                Data = orders
            };
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderRequest request)
        {
            try
            {
                var order = orderService.CreateOrder(request);

                // Tạo response cho order mới
                var orderResponse = new OrderResponse
                {
                    OrderCode = order.OrderCode,
                    TotalAmount = order.TotalAmount,
                    CreatedAt = order.CreatedAt
                };

                // Gửi thông báo realtime qua SignalR
                await hubContext.Clients.All.SendAsync("ReceiveOrderUpdate", orderResponse);

                var response = new BaseResponse<Order>
                {
                    Code = 201,
                    Success = true,
                    Message = "Order created successfully",
                    Data = order
                };
                return Ok(response);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new BaseResponse<Object>
                {
                    Code = 400,
                    Success = false,
                    Message = ex.Message
                });
            }
        }
    }
}