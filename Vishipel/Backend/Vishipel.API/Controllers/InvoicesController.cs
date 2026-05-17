using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vishipel.Infrastructure.Data;
using Vishipel.Core.Models;

namespace Vishipel.API.Controllers
{
    [Route("api/Invoices")]
    [ApiController]
    [Authorize(Roles = "Admin,Manager,SaleManager,Accounting")]
    public class InvoicesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InvoicesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<HoaDon>>> GetInvoices()
        {
            return await _context.HoaDons
                .Include(h => h.DonDatHang)
                .Include(h => h.HopDong)
                .OrderByDescending(h => h.NgayXuat)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<HoaDon>> PostInvoice(HoaDon hoaDon)
        {
            if (string.IsNullOrEmpty(hoaDon.MaHoaDon))
                hoaDon.MaHoaDon = "INV" + DateTime.Now.ToString("yyyyMMddHHmmss");
            
            hoaDon.Status = "Draft";
            _context.HoaDons.Add(hoaDon);

            // Cập nhật trạng thái đơn hàng
            var order = await _context.DonDatHangs.FindAsync(hoaDon.MaDonHang);
            if (order != null) order.Status = "InvoiceIssued";

            await _context.SaveChangesAsync();
            return Ok(hoaDon);
        }

        [HttpPut("{id}/issue")]
        public async Task<IActionResult> IssueInvoice(string id)
        {
            var invoice = await _context.HoaDons.FindAsync(id);
            if (invoice == null) return NotFound();
            invoice.Status = "Issued";
            invoice.NgayXuat = DateTime.Now;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
