using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

namespace Vishipel.API.Controllers
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

        // IWebHostEnvironment giÃƒÆ’Ã‚Âºp Backend biÃƒÂ¡Ã‚ÂºÃ‚Â¿t thÃƒâ€ Ã‚Â° mÃƒÂ¡Ã‚Â»Ã‚Â¥c wwwroot Ãƒâ€žÃ¢â‚¬Ëœang nÃƒÂ¡Ã‚ÂºÃ‚Â±m ÃƒÂ¡Ã‚Â»Ã…Â¸ Ãƒâ€žÃ¢â‚¬ËœÃƒÆ’Ã‚Â¢u
        public UploadController(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        [HttpPost("image")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "KhÃƒÆ’Ã‚Â´ng tÃƒÆ’Ã‚Â¬m thÃƒÂ¡Ã‚ÂºÃ‚Â¥y file hÃƒÂ¡Ã‚Â»Ã‚Â£p lÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡." });

            if (file.Length > MaxFileSizeBytes)
                return BadRequest(new { message = "KÃƒÆ’Ã‚Â­ch thÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºc file vÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã‚Â£t quÃƒÆ’Ã‚Â¡ 5MB." });

            var extension = Path.GetExtension(file.FileName);
            if (string.IsNullOrWhiteSpace(extension) || !AllowedExtensions.Contains(extension))
                return BadRequest(new { message = "ChÃƒÂ¡Ã‚Â»Ã¢â‚¬Â° chÃƒÂ¡Ã‚ÂºÃ‚Â¥p nhÃƒÂ¡Ã‚ÂºÃ‚Â­n file ÃƒÂ¡Ã‚ÂºÃ‚Â£nh: .jpg, .jpeg, .png, .webp." });

            if (!AllowedContentTypes.Contains(file.ContentType))
                return BadRequest(new { message = "Ãƒâ€žÃ‚ÂÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¹nh dÃƒÂ¡Ã‚ÂºÃ‚Â¡ng MIME khÃƒÆ’Ã‚Â´ng hÃƒÂ¡Ã‚Â»Ã‚Â£p lÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¡." });

            // 1. ChÃƒÂ¡Ã‚Â»Ã¢â‚¬Â° Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¹nh thÃƒâ€ Ã‚Â° mÃƒÂ¡Ã‚Â»Ã‚Â¥c lÃƒâ€ Ã‚Â°u ÃƒÂ¡Ã‚ÂºÃ‚Â£nh (wwwroot/image)
            string webRootPath = _environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            string uploadsFolder = Path.Combine(webRootPath, "image");

            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            // 2. TÃƒÂ¡Ã‚ÂºÃ‚Â¡o tÃƒÆ’Ã‚Âªn file mÃƒÂ¡Ã‚Â»Ã¢â‚¬Âºi Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã¢â€žÂ¢c nhÃƒÂ¡Ã‚ÂºÃ‚Â¥t vÃƒÆ’Ã‚Â  an toÃƒÆ’Ã‚Â n
            var originalName = Path.GetFileNameWithoutExtension(file.FileName);
            var safeName = Regex.Replace(originalName, @"[^a-zA-Z0-9_-]", string.Empty);
            if (string.IsNullOrWhiteSpace(safeName))
            {
                safeName = "image";
            }

            string uniqueFileName = $"{Guid.NewGuid()}_{safeName}{extension.ToLowerInvariant()}";
            string filePath = Path.Combine(uploadsFolder, uniqueFileName);

            // 3. Copy file tÃƒÂ¡Ã‚Â»Ã‚Â« luÃƒÂ¡Ã‚Â»Ã¢â‚¬Å“ng mÃƒÂ¡Ã‚ÂºÃ‚Â¡ng vÃƒÆ’Ã‚Â o ÃƒÂ¡Ã‚Â»Ã¢â‚¬Â¢ cÃƒÂ¡Ã‚Â»Ã‚Â©ng vÃƒÂ¡Ã‚ÂºÃ‚Â­t lÃƒÆ’Ã‚Â½
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            // 4. TrÃƒÂ¡Ã‚ÂºÃ‚Â£ vÃƒÂ¡Ã‚Â»Ã‚Â Ãƒâ€žÃ¢â‚¬ËœÃƒâ€ Ã‚Â°ÃƒÂ¡Ã‚Â»Ã‚Âng dÃƒÂ¡Ã‚ÂºÃ‚Â«n chuÃƒÂ¡Ã‚ÂºÃ‚Â©n Ãƒâ€žÃ¢â‚¬ËœÃƒÂ¡Ã‚Â»Ã†â€™ Frontend lÃƒâ€ Ã‚Â°u vÃƒÆ’Ã‚Â o SQL
            string imageUrl = $"/image/{uniqueFileName}";
            return Ok(new { url = imageUrl });
        }
    }
}
