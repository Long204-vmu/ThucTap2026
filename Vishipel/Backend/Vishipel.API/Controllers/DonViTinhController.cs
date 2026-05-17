using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vishipel.Core.Models;
using Vishipel.Infrastructure.Data;

namespace Vishipel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DonViTinhController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DonViTinhController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/DonViTinh
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetDonViTinhs()
        {
            var items = await _context.DonViTinhs.ToListAsync();
            return Ok(items.Select(i => new { maLoai = i.MaDVT, tenLoai = i.TenDVT }));
        }

        // GET: api/DonViTinh/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetDonViTinh(byte id)
        {
            var item = await _context.DonViTinhs.FindAsync(id);

            if (item == null)
            {
                return NotFound();
            }

            return Ok(new { maLoai = item.MaDVT, tenLoai = item.TenDVT });
        }

        // PUT: api/DonViTinh/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDonViTinh(byte id, [FromBody] DonViTinhUpdateDto dto)
        {
            var item = await _context.DonViTinhs.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            item.TenDVT = dto.TenLoai;
            _context.Entry(item).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DonViTinhExists(id))
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

        // POST: api/DonViTinh
        [HttpPost]
        public async Task<ActionResult<object>> PostDonViTinh([FromBody] DonViTinhUpdateDto dto)
        {
            byte newId = 1;
            if (await _context.DonViTinhs.AnyAsync())
            {
                newId = (byte)(await _context.DonViTinhs.MaxAsync(x => x.MaDVT) + 1);
            }

            var item = new DonViTinh
            {
                MaDVT = newId,
                TenDVT = dto.TenLoai
            };

            _context.DonViTinhs.Add(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDonViTinh", new { id = item.MaDVT }, new { maLoai = item.MaDVT, tenLoai = item.TenDVT });
        }

        // DELETE: api/DonViTinh/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDonViTinh(byte id)
        {
            var item = await _context.DonViTinhs.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            _context.DonViTinhs.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DonViTinhExists(byte id)
        {
            return _context.DonViTinhs.Any(e => e.MaDVT == id);
        }
    }

    public class DonViTinhUpdateDto
    {
        public string TenLoai { get; set; } = null!;
        public string? MoTa { get; set; }
    }
}
