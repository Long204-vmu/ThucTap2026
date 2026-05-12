using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vishipel.Infrastructure.Data;
using Vishipel.Core.Models;
using Microsoft.AspNetCore.Authorization;

namespace Vishipel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PaymentSchedulesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PaymentSchedulesController(AppDbContext context)
        {
            _context = context;
        }

        // 1. LỊCH THANH TOÁN THEO ĐƠN HÀNG
        [HttpGet("order/{orderId}")]
        [Authorize(Roles = "Admin, Manager, SaleManager, Accounting")]
        public async Task<ActionResult<IEnumerable<PaymentSchedule>>> GetByOrder(int orderId)
        {
            var schedules = await _context.PaymentSchedules
                .Where(ps => ps.OrderId == orderId)
                .OrderBy(ps => ps.PhaseOrder)
                .ToListAsync();

            return Ok(schedules);
        }

        // 2. ĐÁNH DẤU ĐÃ THANH TOÁN
        [HttpPut("{id}/pay")]
        [Authorize(Roles = "Admin, Manager, Accounting")]
        public async Task<IActionResult> MarkAsPaid(int id)
        {
            var schedule = await _context.PaymentSchedules.FindAsync(id);
            if (schedule == null) return NotFound();
            if (schedule.Status == "Paid") return BadRequest(new { message = "Đợt này đã được thanh toán." });

            schedule.Status = "Paid";
            schedule.PaidAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Kiểm tra nếu tất cả đợt đã thanh toán → cập nhật Order = Completed
            var allPaid = await _context.PaymentSchedules
                .Where(ps => ps.OrderId == schedule.OrderId)
                .AllAsync(ps => ps.Status == "Paid");

            if (allPaid)
            {
                var order = await _context.Orders.FindAsync(schedule.OrderId);
                if (order != null && order.Status == "InvoiceIssued")
                {
                    order.Status = "Completed";
                    order.UpdatedAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                }
            }

            return Ok(new { message = "Đã xác nhận thanh toán.", schedule });
        }

        // 3. LẤY TẤT CẢ LỊCH THANH TOÁN (cho dashboard)
        [HttpGet]
        [Authorize(Roles = "Admin, Manager, Accounting")]
        public async Task<ActionResult<IEnumerable<PaymentSchedule>>> GetAll()
        {
            var schedules = await _context.PaymentSchedules
                .Include(ps => ps.Order)
                    .ThenInclude(o => o!.Customer)
                .OrderBy(ps => ps.DueDate)
                .ToListAsync();

            return Ok(schedules);
        }
    }
}
