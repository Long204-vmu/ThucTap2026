using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vishipel.Infrastructure.Data;
using Vishipel.Core.Models;
using Microsoft.AspNetCore.Authorization;

namespace Vishipel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoaiThietBiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LoaiThietBiController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/LoaiThietBi
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LoaiThietBi>>> GetLoaiThietBis()
        {
            return await _context.LoaiThietBis.ToListAsync();
        }

        // GET: api/LoaiThietBi/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LoaiThietBi>> GetLoaiThietBi(int id)
        {
            var loaiThietBi = await _context.LoaiThietBis.FindAsync(id);
            if (loaiThietBi == null) return NotFound();
            return loaiThietBi;
        }

        // POST: api/LoaiThietBi
        [HttpPost]
        [Authorize(Roles = "Admin, Manager")]
        public async Task<ActionResult<LoaiThietBi>> PostLoaiThietBi(LoaiThietBi loaiThietBi)
        {
            try 
            {
                _context.LoaiThietBis.Add(loaiThietBi);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetLoaiThietBi", new { id = loaiThietBi.MaLoai }, loaiThietBi);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Lỗi khi thêm loại thiết bị: " + ex.Message });
            }
        }

        // PUT: api/LoaiThietBi/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> PutLoaiThietBi(int id, LoaiThietBi loaiThietBi)
        {
            if (id != loaiThietBi.MaLoai) return BadRequest("ID không khớp.");

            _context.Entry(loaiThietBi).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LoaiThietBiExists(id)) return NotFound();
                else throw;
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Lỗi khi cập nhật: " + ex.Message });
            }
            return Ok(new { message = "Cập nhật thành công" });
        }

        // DELETE: api/LoaiThietBi/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> DeleteLoaiThietBi(int id)
        {
            var loaiThietBi = await _context.LoaiThietBis.FindAsync(id);
            if (loaiThietBi == null) return NotFound();

            // Kiểm tra xem có thiết bị nào đang thuộc loại này không
            var hasProducts = await _context.ThietBis.AnyAsync(t => t.MaLoai == id);
            if (hasProducts)
            {
                return BadRequest(new { message = "Không thể xóa loại thiết bị này vì đang có sản phẩm thuộc danh mục này." });
            }

            _context.LoaiThietBis.Remove(loaiThietBi);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa thành công" });
        }

        private bool LoaiThietBiExists(int id)
        {
            return _context.LoaiThietBis.Any(e => e.MaLoai == id);
        }
    }
}
