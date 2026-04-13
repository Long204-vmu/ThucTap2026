using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Vishipel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;

        // IWebHostEnvironment giúp Backend biết thư mục wwwroot đang nằm ở đâu
        public UploadController(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        [HttpPost("image")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Không tìm thấy file hợp lệ.");

            try
            {
                // 1. Chỉ định thư mục lưu ảnh (wwwroot/image)
                string uploadsFolder = Path.Combine(_environment.WebRootPath, "image");
                
                // Nếu thư mục image chưa có, hệ thống sẽ tự tạo
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                // 2. Tạo tên file mới độc nhất (Chống trùng lặp tên)
                string uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                // 3. Copy file từ luồng mạng vào ổ cứng vật lý
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }

                // 4. Trả về đường dẫn chuẩn để Frontend lưu vào SQL
                string imageUrl = $"/image/{uniqueFileName}";
                return Ok(new { url = imageUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi máy chủ: {ex.Message}");
            }
        }
    }
}