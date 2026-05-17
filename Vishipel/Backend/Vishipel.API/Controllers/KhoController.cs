using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vishipel.Core.Models;
using Vishipel.Infrastructure.Data;

namespace Vishipel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KhoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public KhoController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Kho
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetKhos()
        {
            var khos = await _context.Khos.ToListAsync();
            return Ok(khos.Select(k => new { maLoai = k.MaKho, tenLoai = k.TenKho }));
        }

        // GET: api/Kho/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetKho(byte id)
        {
            var kho = await _context.Khos.FindAsync(id);

            if (kho == null)
            {
                return NotFound();
            }

            return Ok(new { maLoai = kho.MaKho, tenLoai = kho.TenKho });
        }

        // PUT: api/Kho/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutKho(byte id, [FromBody] KhoUpdateDto dto)
        {
            var kho = await _context.Khos.FindAsync(id);
            if (kho == null)
            {
                return NotFound();
            }

            kho.TenKho = dto.TenLoai;
            _context.Entry(kho).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!KhoExists(id))
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

        // POST: api/Kho
        [HttpPost]
        public async Task<ActionResult<object>> PostKho([FromBody] KhoUpdateDto dto)
        {
            byte newId = 1;
            if (await _context.Khos.AnyAsync())
            {
                newId = (byte)(await _context.Khos.MaxAsync(x => x.MaKho) + 1);
            }

            var kho = new Kho
            {
                MaKho = newId,
                TenKho = dto.TenLoai
            };

            _context.Khos.Add(kho);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetKho", new { id = kho.MaKho }, new { maLoai = kho.MaKho, tenLoai = kho.TenKho });
        }

        // DELETE: api/Kho/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKho(byte id)
        {
            var kho = await _context.Khos.FindAsync(id);
            if (kho == null)
            {
                return NotFound();
            }

            _context.Khos.Remove(kho);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool KhoExists(byte id)
        {
            return _context.Khos.Any(e => e.MaKho == id);
        }
    }

    public class KhoUpdateDto
    {
        public string TenLoai { get; set; } = null!;
        public string? MoTa { get; set; }
    }
}
