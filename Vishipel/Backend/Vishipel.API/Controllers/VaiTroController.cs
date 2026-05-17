using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vishipel.Infrastructure.Data;
using Vishipel.Core.Models;

namespace Vishipel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class VaiTroController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VaiTroController(AppDbContext context)
        {
            _context = context;
        }

        // 1. Láº¥y danh sÃ¡ch vai trÃ²
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VaiTro>>> GetVaiTros()
        {
            return await _context.VaiTros.ToListAsync();
        }

        // 2. Láº¥y chi tiáº¿t má»™t vai trÃ²
        [HttpGet("{id}")]
        public async Task<ActionResult<VaiTro>> GetVaiTro(byte id)
        {
            var vaiTro = await _context.VaiTros.FindAsync(id);

            if (vaiTro == null)
            {
                return NotFound("KhÃ´ng tÃ¬m tháº¥y vai trÃ².");
            }

            return vaiTro;
        }

        // 3. ThÃªm vai trÃ² má»›i
        [HttpPost]
        public async Task<ActionResult<VaiTro>> PostVaiTro(VaiTro vaiTro)
        {
            // Kiá»ƒm tra tÃªn vai trÃ² Ä‘Ã£ tá»“n táº¡i chÆ°a
            if (await _context.VaiTros.AnyAsync(v => v.TenVaiTro == vaiTro.TenVaiTro))
            {
                return BadRequest(new { message = "TÃªn vai trÃ² nÃ y Ä‘Ã£ tá»“n táº¡i." });
            }

            _context.VaiTros.Add(vaiTro);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetVaiTro", new { id = vaiTro.MaVaiTro }, vaiTro);
        }

        // 4. Cáº­p nháº­t vai trÃ²
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVaiTro(byte id, VaiTro vaiTro)
        {
            if (id != vaiTro.MaVaiTro)
            {
                return BadRequest("ID khÃ´ng khá»›p.");
            }

            // KhÃ´ng cho phÃ©p sá»­a tÃªn vai trÃ² "Admin" Ä‘á»ƒ trÃ¡nh lá»—i há»‡ thá»‘ng
            var existingRole = await _context.VaiTros.FindAsync(id);
            if (existingRole == null) return NotFound();
            
            if (existingRole.TenVaiTro == "Admin" && vaiTro.TenVaiTro != "Admin")
            {
                return BadRequest(new { message = "KhÃ´ng thá»ƒ thay Ä‘á»•i tÃªn vai trÃ² Admin há»‡ thá»‘ng." });
            }

            _context.Entry(existingRole).CurrentValues.SetValues(vaiTro);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VaiTroExists(id)) return NotFound();
                else throw;
            }

            return Ok(new { message = "Cáº­p nháº­t vai trÃ² thÃ nh cÃ´ng." });
        }

        // 5. XÃ³a vai trÃ²
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVaiTro(byte id)
        {
            var vaiTro = await _context.VaiTros.FindAsync(id);
            if (vaiTro == null)
            {
                return NotFound("KhÃ´ng tÃ¬m tháº¥y vai trÃ².");
            }

            // KhÃ´ng cho phÃ©p xÃ³a vai trÃ² Admin hoáº·c User máº·c Ä‘á»‹nh
            if (vaiTro.TenVaiTro == "Admin" || vaiTro.TenVaiTro == "User")
            {
                return BadRequest(new { message = "KhÃ´ng thá»ƒ xÃ³a vai trÃ² máº·c Ä‘á»‹nh cá»§a há»‡ thá»‘ng." });
            }

            // Kiá»ƒm tra xem cÃ³ tÃ i khoáº£n nÃ o Ä‘ang sá»­ dá»¥ng vai trÃ² nÃ y khÃ´ng
            var hasUsers = await _context.TaiKhoans.AnyAsync(t => t.MaVaiTro == id);
            if (hasUsers)
            {
                return BadRequest(new { message = "KhÃ´ng thá»ƒ xÃ³a vai trÃ² nÃ y vÃ¬ Ä‘ang cÃ³ ngÆ°á»i dÃ¹ng sá»­ dá»¥ng." });
            }

            _context.VaiTros.Remove(vaiTro);
            await _context.SaveChangesAsync();

            return Ok(new { message = "ÄÃ£ xÃ³a vai trÃ² thÃ nh cÃ´ng." });
        }

        private bool VaiTroExists(byte id)
        {
            return _context.VaiTros.Any(e => e.MaVaiTro == id);
        }
    }
}
