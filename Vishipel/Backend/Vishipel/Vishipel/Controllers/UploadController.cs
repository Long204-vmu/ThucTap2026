using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

namespace Vishipel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private const long MaxFileSizeBytes = 5 * 1024 * 1024; // 5MB
        private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
        {
            ".jpg", ".jpeg", ".png", ".webp"
        };
        private static readonly HashSet<string> AllowedContentTypes = new(StringComparer.OrdinalIgnoreCase)
        {
            "image/jpeg", "image/png", "image/webp"
        };

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
                return BadRequest(new { message = "Không tìm thấy file hợp lệ." });

            if (file.Length > MaxFileSizeBytes)
                return BadRequest(new { message = "Kích thước file vượt quá 5MB." });

            var extension = Path.GetExtension(file.FileName);
            if (string.IsNullOrWhiteSpace(extension) || !AllowedExtensions.Contains(extension))
                return BadRequest(new { message = "Chỉ chấp nhận file ảnh: .jpg, .jpeg, .png, .webp." });

            if (!AllowedContentTypes.Contains(file.ContentType))
                return BadRequest(new { message = "Định dạng MIME không hợp lệ." });

            // 1. Chỉ định thư mục lưu ảnh (wwwroot/image)
            string uploadsFolder = Path.Combine(_environment.WebRootPath, "image");

            // Nếu thư mục image chưa có, hệ thống sẽ tự tạo
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            // 2. Tạo tên file mới độc nhất và an toàn
            var originalName = Path.GetFileNameWithoutExtension(file.FileName);
            var safeName = Regex.Replace(originalName, @"[^a-zA-Z0-9_-]", string.Empty);
            if (string.IsNullOrWhiteSpace(safeName))
            {
                safeName = "image";
            }

            string uniqueFileName = $"{Guid.NewGuid()}_{safeName}{extension.ToLowerInvariant()}";
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
    }
}