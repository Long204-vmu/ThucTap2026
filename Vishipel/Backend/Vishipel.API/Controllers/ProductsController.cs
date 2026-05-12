using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vishipel.Infrastructure.Data;
using Vishipel.Core.Models;
using Microsoft.AspNetCore.Authorization;

namespace Vishipel.API.Controllers
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
        // Lấy toàn bộ sản phẩm (không phân trang) - giữ cho tương thích cũ
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products
                .Include(p => p.Category)
                .ToListAsync();
        }

        // GET: api/products/search
        // Tìm kiếm + lọc + sắp xếp + phân trang sản phẩm
        [HttpGet("search")]
        public async Task<ActionResult<PagedResult<Product>>> SearchProducts(
            [FromQuery] string? keyword,
            [FromQuery] int? categoryId,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] string? sortBy,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            if (page <= 0) page = 1;
            if (pageSize <= 0) pageSize = 20;

            var query = _context.Products
                .Include(p => p.Category)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var kw = keyword.Trim().ToLower();
                query = query.Where(p =>
                    p.Name.ToLower().Contains(kw) ||
                    (p.Model != null && p.Model.ToLower().Contains(kw)) ||
                    (p.Brand != null && p.Brand.ToLower().Contains(kw)) ||
                    (p.ShortDescription != null && p.ShortDescription.ToLower().Contains(kw)));
            }

            if (categoryId.HasValue)
            {
                query = query.Where(p => p.CategoryId == categoryId.Value);
            }

            if (minPrice.HasValue)
            {
                query = query.Where(p => p.Price >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= maxPrice.Value);
            }

            // Sắp xếp đơn giản theo một số tiêu chí phổ biến
            query = sortBy?.ToLower() switch
            {
                "price_asc" => query.OrderBy(p => p.Price),
                "price_desc" => query.OrderByDescending(p => p.Price),
                "name_asc" => query.OrderBy(p => p.Name),
                "name_desc" => query.OrderByDescending(p => p.Name),
                "newest" => query.OrderByDescending(p => p.Id),
                _ => query.OrderBy(p => p.Id) // mặc định
            };

            var totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var result = new PagedResult<Product>
            {
                Items = items,
                TotalItems = totalItems,
                Page = page,
                PageSize = pageSize,
                TotalPages = totalPages
            };

            return Ok(result);
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
            ApplyInventoryRules(product);
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

            ApplyInventoryRules(product);

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

        private static void ApplyInventoryRules(Product product)
        {
            if (product.StockQuantity < 0) product.StockQuantity = 0;
            if (product.LowStockThreshold < 0) product.LowStockThreshold = 0;

            if (product.IsDiscontinued)
            {
                product.Status = "Ngừng kinh doanh";
                return;
            }

            if (product.StockQuantity == 0)
            {
                product.Status = "Hết hàng";
            }
            else if (product.StockQuantity <= product.LowStockThreshold)
            {
                product.Status = "Sắp hết hàng";
            }
            else
            {
                product.Status = "Còn hàng";
            }
        }
    }
}
