using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using POS_VISNAM.Services.IService;
using POS_VISNAM.Services.Models.Responses;

namespace POS_VISNAM.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService productService;
        public ProductController(IProductService productService)
        {
            this.productService = productService;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var products = productService.getAll();
            var response = new BaseResponse<List<ProductResponse>>
            {
                Code = 200,
                Success = true,
                Message = "Products retrieved successfully",
                Data = products
            };
            return Ok(response);
        }
    }
}
