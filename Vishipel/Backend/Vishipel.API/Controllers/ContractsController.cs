using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vishipel.Infrastructure.Data;
using Vishipel.Core.Models;

namespace Vishipel.API.Controllers
{
    [Route("api/Contracts")]
    [ApiController]
    [Authorize(Roles = "Admin,Manager,SaleManager,Accounting")]
    public class ContractsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ContractsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<HopDong>>> GetContracts()
        {
            return await _context.HopDongs
                .Include(h => h.DonDatHang)
                    .ThenInclude(d => d!.KhachHang)
                .OrderByDescending(h => h.NgayKy)
                .ToListAsync();
        }

        public class ContractCreateDto
        {
            public int OrderId { get; set; }
            public string? PartyAName { get; set; }
            public string? Subject { get; set; }
            public decimal? DiscountPercent { get; set; }
        }

        [HttpPost]
        public async Task<ActionResult<HopDong>> PostContract([FromBody] ContractCreateDto dto)
        {
            var hopDong = new HopDong
            {
                MaHopDong = "HD" + DateTime.Now.ToString("yyyyMMddHHmmss") + new Random().Next(100, 999),
                MaDonHang = dto.OrderId,
                PartyAName = dto.PartyAName,
                NoiDungTomTat = dto.Subject,
                Status = "Draft",
                NgayKy = DateTime.Now
            };

            // Calculate total based on order
            var order = await _context.DonDatHangs.Include(o => o.ChiTietDonHangs).FirstOrDefaultAsync(o => o.MaDonHang == dto.OrderId);
            if (order != null)
            {
                var baseTotal = order.ChiTietDonHangs.Sum(x => x.SoLuong * x.DonGia) + (order.ShippingCost ?? 0);
                hopDong.GiaTriHopDong = baseTotal * (1 - ((dto.DiscountPercent ?? 0) / 100m));
                hopDong.TotalAmount = hopDong.GiaTriHopDong;
                order.Status = "ContractDraft";
            }

            _context.HopDongs.Add(hopDong);
            await _context.SaveChangesAsync();
            return Ok(hopDong);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutContract(string id, [FromBody] ContractCreateDto dto)
        {
            var hopDong = await _context.HopDongs.FindAsync(id);
            if (hopDong == null) return NotFound();

            hopDong.PartyAName = dto.PartyAName;
            hopDong.NoiDungTomTat = dto.Subject;

            var order = await _context.DonDatHangs.Include(o => o.ChiTietDonHangs).FirstOrDefaultAsync(o => o.MaDonHang == dto.OrderId);
            if (order != null)
            {
                var baseTotal = order.ChiTietDonHangs.Sum(x => x.SoLuong * x.DonGia) + (order.ShippingCost ?? 0);
                hopDong.GiaTriHopDong = baseTotal * (1 - ((dto.DiscountPercent ?? 0) / 100m));
                hopDong.TotalAmount = hopDong.GiaTriHopDong;
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("{id}/submit")]
        public async Task<IActionResult> SubmitContract(string id)
        {
            var hopDong = await _context.HopDongs.FindAsync(id);
            if (hopDong == null) return NotFound();
            hopDong.Status = "PendingApproval";
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("{id}/approve")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> ApproveContract(string id)
        {
            var hopDong = await _context.HopDongs.FindAsync(id);
            if (hopDong == null) return NotFound();
            hopDong.Status = "Approved";
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("{id}/sign")]
        public async Task<IActionResult> SignContract(string id)
        {
            var hopDong = await _context.HopDongs.FindAsync(id);
            if (hopDong == null) return NotFound();
            hopDong.Status = "Signed";

            // Cập nhật trạng thái đơn hàng
            var order = await _context.DonDatHangs.FindAsync(hopDong.MaDonHang);
            if (order != null) order.Status = "ContractSigned";

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
