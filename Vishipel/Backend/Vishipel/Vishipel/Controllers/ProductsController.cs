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
            // Lấy tất cả sản phẩm, nhớ kèm theo (Include) thông tin Danh mục
            return await _context.Products
                .Include(p => p.Category)
                .ToListAsync();
        }

        // HÀM 2: Lấy MỘT sản phẩm theo ID (Dùng cho trang Chi tiết)
        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                return NotFound();
            }

            return product;
        }
    }
}