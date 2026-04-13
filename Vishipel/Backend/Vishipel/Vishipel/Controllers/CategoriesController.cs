using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vishipel.Data;
using Vishipel.Models;
using Microsoft.AspNetCore.Authorization;

namespace Vishipel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriesController(AppDbContext context)
        {
            _context = context;
        }

        // 1. LẤY DANH SÁCH DANH MỤC (GET)
        // GET: api/Categories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories([FromQuery] string? type)
        {
            // Lấy toàn bộ danh mục làm gốc
            var query = _context.Categories.AsQueryable();

            // Nếu Frontend có gửi kèm loại (Product hoặc Service) thì lọc ra
            if (!string.IsNullOrEmpty(type))
            {
                query = query.Where(c => c.CategoryType == type);
            }

            return await query.ToListAsync();
        }

        // 2. LẤY 1 DANH MỤC THEO ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound();
            return category;
        }

        // 3. THÊM DANH MỤC MỚI (POST) - Thêm Authorize nếu bạn muốn chỉ Admin mới được tạo
        [HttpPost]
        [Authorize(Roles = "Admin, Manager")]
        public async Task<ActionResult<Category>> PostCategory(Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetCategory", new { id = category.Id }, category);
        }

        // 4. SỬA DANH MỤC (PUT)
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> PutCategory(int id, Category category)
        {
            if (id != category.Id) return BadRequest("ID không khớp.");

            _context.Entry(category).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoryExists(id)) return NotFound();
                else throw;
            }
            return NoContent();
        }

        // 5. XÓA DANH MỤC (DELETE)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound();

            // Lưu ý: SQL Server thường sẽ báo lỗi nếu bạn cố xóa 1 danh mục đang có sản phẩm/dịch vụ nằm bên trong (Lỗi khóa ngoại)
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CategoryExists(int id)
        {
            return _context.Categories.Any(e => e.Id == id);
        }
    }
}