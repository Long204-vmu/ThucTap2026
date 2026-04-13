using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vishipel.Data;
using Vishipel.Models;
using Microsoft.AspNetCore.Authorization;

namespace Vishipel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServicesController : ControllerBase
    {
        private readonly AppDbContext _context;

        // Constructor: Yêu cầu ASP.NET "bơm" AppDbContext vào đây
        public ServicesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Services
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Service>>> GetServices()
        {
            // Lấy tất cả sản phẩm, nhớ kèm theo (Include) thông tin Danh mục
            return await _context.Services
                .Include(p => p.Category)
                .ToListAsync();
        }

        // HÀM 2: Lấy MỘT sản phẩm theo ID (Dùng cho trang Chi tiết)
        // GET: api/Services/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Service>> GetService(int id)
        {
            var Service = await _context.Services
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (Service == null)
            {
                return NotFound();
            }

            return Service;
        }
        [HttpGet("newest")]
        public async Task<ActionResult<IEnumerable<Service>>> GetNewestServices()
        {
            return await _context.Services
                .Include(p => p.Category)
                .OrderByDescending(p => p.Id) // SQL sẽ tự sắp xếp
                .Take(4) // SQL sẽ chỉ gửi đúng 4 cái về Frontend
                .ToListAsync();
        }

        // HÀM THÊM SẢN PHẨM MỚI (CHỈ ADMIN VÀ MANAGER MỚI ĐƯỢC VÀO)
        [HttpPost]
        [Authorize(Roles = "Admin, Manager")]
        public async Task<ActionResult<Service>> PostService(Service Service)
        {
            _context.Services.Add(Service);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetService", new { id = Service.Id }, Service);
        }
        // DELETE: api/Services/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteService(int id)
        {
            var Service = await _context.Services.FindAsync(id);
            if (Service == null) return NotFound();

            // --- BƯỚC MỚI: XÓA ẢNH VẬT LÝ TRONG THƯ MỤC wwwroot/image ---
            if (!string.IsNullOrEmpty(Service.ImagesJson) && Service.ImagesJson != "[]")
            {
                try
                {
                    // Lấy IWebHostEnvironment từ DI (nhớ tiêm IWebHostEnvironment vào constructor của ServicesController nhé)
                    // Hoặc lấy trực tiếp đường dẫn gốc nếu bạn biết rõ
                    var imageList = System.Text.Json.JsonSerializer.Deserialize<List<string>>(Service.ImagesJson);
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

            _context.Services.Remove(Service);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        // PUT: api/Services/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutService(int id, Service Service)
        {
            // Quan trọng: Kiểm tra ID ở URL và ID trong dữ liệu gửi lên phải khớp nhau
            if (id != Service.Id)
            {
                return BadRequest("ID không khớp.");
            }

            // Đánh dấu thực thể này là đã bị thay đổi để Entity Framework cập nhật vào SQL
            _context.Entry(Service).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ServiceExists(id))
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

        private bool ServiceExists(int id)
        {
            return _context.Services.Any(e => e.Id == id);
        }
    }
}