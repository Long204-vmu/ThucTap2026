using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vishipel.Infrastructure.Data;
using Vishipel.Core.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Vishipel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DeliveryOrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DeliveryOrdersController(AppDbContext context)
        {
            _context = context;
        }

        // ── DTOs ──
        public class CreateDeliveryDto
        {
            public int OrderId { get; set; }
            public string? DeliveryAddress { get; set; }
            public string? ReceiverName { get; set; }
            public string? ReceiverPhone { get; set; }
            public string? Note { get; set; }
        }

        // Sinh mã phiếu xuất kho
        private async Task<string> GenerateDeliveryCode()
        {
            var year = DateTime.UtcNow.Year;
            var count = await _context.DeliveryOrders.CountAsync(d => d.CreatedAt.Year == year);
            return $"PXK-{year}-{(count + 1):D5}";
        }

        // 1. TẠO PHIẾU XUẤT KHO (chỉ khi Contract đã Signed)
        [HttpPost]
        [Authorize(Roles = "Admin, Manager, Warehouse")]
        public async Task<ActionResult<DeliveryOrder>> CreateDeliveryOrder(CreateDeliveryDto dto)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdString, out int userId)) return Unauthorized();

            var order = await _context.Orders
                .Include(o => o.Contract)
                .FirstOrDefaultAsync(o => o.Id == dto.OrderId);

            if (order == null) return NotFound(new { message = "Không tìm thấy đơn hàng." });
            if (order.Contract == null || order.Contract.Status != "Signed")
                return BadRequest(new { message = "Hợp đồng chưa được ký kết." });

            var existing = await _context.DeliveryOrders.AnyAsync(d => d.OrderId == dto.OrderId);
            if (existing) return BadRequest(new { message = "Đã có phiếu xuất kho cho đơn hàng này." });

            var delivery = new DeliveryOrder
            {
                DeliveryCode = await GenerateDeliveryCode(),
                OrderId = dto.OrderId,
                WarehouseStaffId = userId,
                Status = "Pending",
                DeliveryAddress = dto.DeliveryAddress,
                ReceiverName = dto.ReceiverName,
                ReceiverPhone = dto.ReceiverPhone,
                Note = dto.Note,
                CreatedAt = DateTime.UtcNow
            };

            _context.DeliveryOrders.Add(delivery);

            order.Status = "Delivering";
            order.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(delivery);
        }

        // 2. BẮT ĐẦU GIAO HÀNG
        [HttpPut("{id}/deliver")]
        [Authorize(Roles = "Admin, Manager, Warehouse")]
        public async Task<IActionResult> StartDelivery(int id)
        {
            var delivery = await _context.DeliveryOrders.FindAsync(id);
            if (delivery == null) return NotFound();
            if (delivery.Status != "Pending") return BadRequest(new { message = "Phiếu xuất kho không ở trạng thái chờ." });

            delivery.Status = "Delivering";
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã bắt đầu giao hàng.", delivery });
        }

        // 3. XÁC NHẬN ĐÃ GIAO HÀNG
        [HttpPut("{id}/confirm")]
        [Authorize(Roles = "Admin, Manager, Warehouse")]
        public async Task<IActionResult> ConfirmDelivery(int id)
        {
            var delivery = await _context.DeliveryOrders
                .Include(d => d.Order)
                    .ThenInclude(o => o!.Items)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (delivery == null) return NotFound();
            if (delivery.Status == "Delivered") return BadRequest(new { message = "Đã xác nhận giao hàng rồi." });

            delivery.Status = "Delivered";
            delivery.DeliveredAt = DateTime.UtcNow;

            // Cập nhật trạng thái đơn hàng
            if (delivery.Order != null)
            {
                delivery.Order.Status = "Delivered";
                delivery.Order.UpdatedAt = DateTime.UtcNow;

                // Tự động tạo WarrantyRecord cho từng item có serial
                if (delivery.Order.Items != null)
                {
                    foreach (var item in delivery.Order.Items)
                    {
                        if (!string.IsNullOrEmpty(item.SerialNumbersJson))
                        {
                            var serials = System.Text.Json.JsonSerializer.Deserialize<List<string>>(item.SerialNumbersJson);
                            if (serials != null)
                            {
                                foreach (var serial in serials)
                                {
                                    _context.WarrantyRecords.Add(new WarrantyRecord
                                    {
                                        OrderItemId = item.Id,
                                        ProductId = item.ProductId,
                                        SerialNumber = serial,
                                        InstallLocation = item.InstallLocation,
                                        WarrantyStartDate = DateTime.UtcNow,
                                        WarrantyEndDate = DateTime.UtcNow.AddMonths(12), // Mặc định 12 tháng
                                        CreatedAt = DateTime.UtcNow
                                    });
                                }
                            }
                        }
                    }
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Xác nhận giao hàng thành công! Đã lưu thông tin bảo hành.", delivery });
        }

        // 4. LẤY TẤT CẢ PHIẾU XUẤT KHO
        [HttpGet]
        [Authorize(Roles = "Admin, Manager, Warehouse")]
        public async Task<ActionResult<IEnumerable<DeliveryOrder>>> GetAll()
        {
            var deliveries = await _context.DeliveryOrders
                .Include(d => d.Order)
                    .ThenInclude(o => o!.Customer)
                .Include(d => d.WarehouseStaff)
                .OrderByDescending(d => d.CreatedAt)
                .ToListAsync();

            return Ok(deliveries);
        }
    }
}
