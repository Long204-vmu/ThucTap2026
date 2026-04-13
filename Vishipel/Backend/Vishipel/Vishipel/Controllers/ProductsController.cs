using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vishipel.Data;
using Vishipel.Models;
using Microsoft.AspNetCore.Authorization;

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
        [HttpGet("newest")]
        public async Task<ActionResult<IEnumerable<Product>>> GetNewestProducts()
        {
            return await _context.Products
                .Include(p => p.Category)
                .OrderByDescending(p => p.Id) // SQL sẽ tự sắp xếp
                .Take(4) // SQL sẽ chỉ gửi đúng 4 cái về Frontend
                .ToListAsync();
        }

        // HÀM THÊM SẢN PHẨM MỚI (CHỈ ADMIN VÀ MANAGER MỚI ĐƯỢC VÀO)
        [HttpPost]
        [Authorize(Roles = "Admin, Manager")]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetProduct", new { id = product.Id }, product);
        }
        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            // --- BƯỚC MỚI: XÓA ẢNH VẬT LÝ TRONG THƯ MỤC wwwroot/image ---
            if (!string.IsNullOrEmpty(product.ImagesJson) && product.ImagesJson != "[]")
            {
                try
                {
                    // Lấy IWebHostEnvironment từ DI (nhớ tiêm IWebHostEnvironment vào constructor của ProductsController nhé)
                    // Hoặc lấy trực tiếp đường dẫn gốc nếu bạn biết rõ
                    var imageList = System.Text.Json.JsonSerializer.Deserialize<List<string>>(product.ImagesJson) ?? new List<string>();
                    foreach (var imgPath in imageList)
                    {
                        // imgPath đang có dạng "/image/ten-file.jpg"
                        var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", imgPath.TrimStart('/'));
                        if (System.IO.File.Exists(fullPath))
                        {
                            System.IO.File.Delete(fullPath);
                        }
                    }
                }
                catch { /* Bỏ qua lỗi xóa ảnh nếu file đã bị ai đó xóa tay trước đó */ }
            }
            // -------------------------------------------------------------

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        // PUT: api/Products/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> PutProduct(int id, Product product)
        {
            // Quan trọng: Kiểm tra ID ở URL và ID trong dữ liệu gửi lên phải khớp nhau
            if (id != product.Id)
            {
                return BadRequest("ID không khớp.");
            }

            // Đánh dấu thực thể này là đã bị thay đổi để Entity Framework cập nhật vào SQL
            _context.Entry(product).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.Id == id);
        }
    }
}