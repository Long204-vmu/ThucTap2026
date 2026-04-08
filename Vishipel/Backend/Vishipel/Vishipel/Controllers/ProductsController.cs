using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vishipel.Data;
using Vishipel.Models;

namespace Vishipel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        // Constructor: Yêu cầu ASP.NET "bơm" AppDbContext vào đây
        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            // Lấy toàn bộ sản phẩm từ Database
            // Có thể dùng .Include(p => p.Category) nếu muốn lấy kèm thông tin Category
            var products = await _context.Products.ToListAsync();

            if (products == null || !products.Any())
            {
                return NotFound("Chưa có sản phẩm nào trong kho.");
            }

            return Ok(products);
        }
    }
}