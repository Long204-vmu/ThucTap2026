using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vishipel.Infrastructure.Data;
using Vishipel.Core.Models;
using Microsoft.AspNetCore.Authorization;

namespace Vishipel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThietBiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ThietBiController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/ThietBi
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ThietBi>>> GetThietBis()
        {
            return await _context.ThietBis
                .Include(p => p.LoaiThietBi)
                .Include(p => p.DonViTinh)
                .ToListAsync();
        }

        // GET: api/ThietBi/search
        [HttpGet("search")]
        public async Task<ActionResult<PagedResult<ThietBi>>> SearchThietBis(
            [FromQuery] string? keyword,
            [FromQuery] int? maLoai,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] string? sortBy,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            if (page <= 0) page = 1;
            if (pageSize <= 0) pageSize = 20;

            var query = _context.ThietBis
                .Include(p => p.LoaiThietBi)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var kw = keyword.Trim().ToLower();
                query = query.Where(p =>
                    p.TenThietBi.ToLower().Contains(kw) ||
                    (p.Model != null && p.Model.ToLower().Contains(kw)) ||
                    (p.HangSanXuat != null && p.HangSanXuat.ToLower().Contains(kw)) ||
                    (p.MoTaNgan != null && p.MoTaNgan.ToLower().Contains(kw)));
            }

            if (maLoai.HasValue)
            {
                query = query.Where(p => p.MaLoai == maLoai.Value);
            }

            if (minPrice.HasValue)
            {
                query = query.Where(p => p.GiaBan >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(p => p.GiaBan <= maxPrice.Value);
            }

            query = sortBy?.ToLower() switch
            {
                "price_asc" => query.OrderBy(p => p.GiaBan),
                "price_desc" => query.OrderByDescending(p => p.GiaBan),
                "name_asc" => query.OrderBy(p => p.TenThietBi),
                "name_desc" => query.OrderByDescending(p => p.TenThietBi),
                "newest" => query.OrderByDescending(p => p.MaThietBi),
                _ => query.OrderBy(p => p.MaThietBi)
            };

            var totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var result = new PagedResult<ThietBi>
            {
                Items = items,
                TotalItems = totalItems,
                Page = page,
                PageSize = pageSize,
                TotalPages = totalPages
            };

            return Ok(result);
        }

        // GET: api/ThietBi/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ThietBi>> GetThietBi(int id)
        {
            var thietBi = await _context.ThietBis
                .Include(p => p.LoaiThietBi)
                .Include(p => p.DonViTinh)
                .FirstOrDefaultAsync(p => p.MaThietBi == id);

            if (thietBi == null)
            {
                return NotFound();
            }

            return thietBi;
        }

        [HttpGet("newest")]
        public async Task<ActionResult<IEnumerable<ThietBi>>> GetNewestThietBis()
        {
            return await _context.ThietBis
                .Include(p => p.LoaiThietBi)
                .OrderByDescending(p => p.MaThietBi)
                .Take(4)
                .ToListAsync();
        }

        // POST: api/ThietBi
        [HttpPost]
        [Authorize(Roles = "Admin, Manager")]
        public async Task<ActionResult<ThietBi>> PostThietBi(ThietBi thietBi)
        {
            thietBi.NgayTao = DateTime.Now;
            thietBi.NgayCapNhat = DateTime.Now;
            _context.ThietBis.Add(thietBi);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetThietBi", new { id = thietBi.MaThietBi }, thietBi);
        }

        // DELETE: api/ThietBi/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> DeleteThietBi(int id)
        {
            var thietBi = await _context.ThietBis.FindAsync(id);
            if (thietBi == null) return NotFound();

            if (!string.IsNullOrEmpty(thietBi.HinhAnhJson) && thietBi.HinhAnhJson != "[]")
            {
                try
                {
                    var imageList = System.Text.Json.JsonSerializer.Deserialize<List<string>>(thietBi.HinhAnhJson) ?? new List<string>();
                    foreach (var imgPath in imageList)
                    {
                        var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", imgPath.TrimStart('/'));
                        if (System.IO.File.Exists(fullPath))
                        {
                            System.IO.File.Delete(fullPath);
                        }
                    }
                }
                catch { }
            }

            _context.ThietBis.Remove(thietBi);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/ThietBi/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> PutThietBi(int id, ThietBi thietBi)
        {
            if (id != thietBi.MaThietBi)
            {
                return BadRequest("ID khÃƒÂ´ng khÃ¡Â»â€ºp.");
            }

            thietBi.NgayCapNhat = DateTime.Now;
            _context.Entry(thietBi).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ThietBiExists(id))
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

        private bool ThietBiExists(int id)
        {
            return _context.ThietBis.Any(e => e.MaThietBi == id);
        }
    }
}
