using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vishipel.Infrastructure.Data;
using Vishipel.Core.Models;
using Microsoft.AspNetCore.Authorization;

namespace Vishipel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NhaCungCapController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NhaCungCapController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/NhaCungCap
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NhaCungCap>>> GetNhaCungCaps()
        {
            return await _context.NhaCungCaps.ToListAsync();
        }

        // GET: api/NhaCungCap/5
        [HttpGet("{id}")]
        public async Task<ActionResult<NhaCungCap>> GetNhaCungCap(int id)
        {
            var nhaCungCap = await _context.NhaCungCaps.FindAsync(id);
            if (nhaCungCap == null) return NotFound();
            return nhaCungCap;
        }

        // POST: api/NhaCungCap
        [HttpPost]
        [Authorize(Roles = "Admin, Manager")]
        public async Task<ActionResult<NhaCungCap>> PostNhaCungCap(NhaCungCap nhaCungCap)
        {
            try 
            {
                _context.NhaCungCaps.Add(nhaCungCap);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetNhaCungCap", new { id = nhaCungCap.MaNCC }, nhaCungCap);
            }
            catch (Exception ex)
            {
                var errorMsg = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return BadRequest(new { message = "Lỗi khi thêm nhà cung cấp: " + errorMsg });
            }
        }

        // PUT: api/NhaCungCap/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> PutNhaCungCap(int id, NhaCungCap nhaCungCap)
        {
            if (id != nhaCungCap.MaNCC) return BadRequest("ID không khớp.");

            _context.Entry(nhaCungCap).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NhaCungCapExists(id)) return NotFound();
                else throw;
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Lỗi khi cập nhật: " + ex.Message });
            }
            return Ok(new { message = "Cập nhật thành công" });
        }

        // DELETE: api/NhaCungCap/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> DeleteNhaCungCap(int id)
        {
            var nhaCungCap = await _context.NhaCungCaps.FindAsync(id);
            if (nhaCungCap == null) return NotFound();

            // Kiểm tra xem có phiếu nhập kho nào đang thuộc nhà cung cấp này không
            var hasImports = await _context.PhieuNhapKhos.AnyAsync(p => p.MaNCC == id);
            if (hasImports)
            {
                return BadRequest(new { message = "Không thể xóa nhà cung cấp này vì đang có dữ liệu nhập kho liên quan." });
            }

            _context.NhaCungCaps.Remove(nhaCungCap);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa thành công" });
        }

        private bool NhaCungCapExists(int id)
        {
            return _context.NhaCungCaps.Any(e => e.MaNCC == id);
        }
    }
}
