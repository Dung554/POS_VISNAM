using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
        public OrderController(IOrderService orderService)
        {
            this.orderService = orderService;
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
        public IActionResult CreateOrder([FromBody] OrderRequest request)
        {
            try
            {
                var order = orderService.CreateOrder(request);
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
