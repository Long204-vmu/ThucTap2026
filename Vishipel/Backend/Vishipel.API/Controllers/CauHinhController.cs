using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vishipel.Infrastructure.Data;
using Vishipel.Core.Models;

namespace Vishipel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CauHinhController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CauHinhController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/CauHinh
        [HttpGet]
        public async Task<ActionResult<CauHinhHeThong>> GetCauHinh()
        {
            var cauHinh = await _context.CauHinhHeThongs.FirstOrDefaultAsync();
            if (cauHinh == null)
            {
                // Nếu chưa có thì trả về object mặc định (không lưu ngay để tránh lỗi ID)
                return new CauHinhHeThong 
                { 
                    TenWebsite = "Vishipel EMS",
                    BanQuyen = "© 2026 Vishipel. All rights reserved."
                };
            }
            return cauHinh;
        }

        // PUT: api/CauHinh
        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PutCauHinh(CauHinhHeThong request)
        {
            var existing = await _context.CauHinhHeThongs.FirstOrDefaultAsync();
            if (existing == null)
            {
                // Nếu chưa có thì chèn mới
                var newConfig = new CauHinhHeThong
                {
                    TenWebsite = request.TenWebsite,
                    Slogan = request.Slogan,
                    LogoUrl = request.LogoUrl,
                    Hotline = request.Hotline,
                    EmailLienHe = request.EmailLienHe,
                    DiaChi = request.DiaChi,
                    BanQuyen = request.BanQuyen,
                    NgayCapNhat = DateTime.Now
                };
                _context.CauHinhHeThongs.Add(newConfig);
            }
            else
            {
                // Nếu có rồi thì cập nhật
                existing.TenWebsite = request.TenWebsite;
                existing.Slogan = request.Slogan;
                existing.LogoUrl = request.LogoUrl;
                existing.Hotline = request.Hotline;
                existing.EmailLienHe = request.EmailLienHe;
                existing.DiaChi = request.DiaChi;
                existing.BanQuyen = request.BanQuyen;
                existing.NgayCapNhat = DateTime.Now;
                
                _context.Entry(existing).State = EntityState.Modified;
            }

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Cập nhật cấu hình website thành công!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Lỗi khi lưu cấu hình: " + ex.Message });
            }
        }
    }
}
