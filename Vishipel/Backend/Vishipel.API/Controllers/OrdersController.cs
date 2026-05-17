using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vishipel.Infrastructure.Data;
using Vishipel.Core.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Vishipel.API.Controllers
{
    [Route("api/Orders")]
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        // 1. LẤY TẤT CẢ ĐƠN HÀNG (Admin)
        [HttpGet]
        [Authorize(Roles = "Admin,Manager,SaleManager,Warehouse,Accounting")]
        public async Task<ActionResult<IEnumerable<DonDatHang>>> GetOrders()
        {
            return await _context.DonDatHangs
                .Include(o => o.KhachHang)
                .Include(o => o.TaiKhoan)
                .Include(o => o.QuoteRequest)
                .Include(o => o.ChiTietDonHangs)
                    .ThenInclude(d => d.ThietBi)
                .Include(o => o.Contract)
                    .ThenInclude(c => c.PhieuThus)
                .Include(o => o.Invoice)
                .OrderByDescending(o => o.NgayDat)
                .ToListAsync();
        }

        // 2. TẠO ĐƠN HÀNG MỚI (Admin)
        [HttpPost]
        [Authorize(Roles = "Admin,Manager,SaleManager")]
        public async Task<ActionResult<DonDatHang>> PostOrder(OrderCreateDto dto)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdStr, out int userId)) return Unauthorized();

            // Lấy thông tin báo giá để lấy MaKH nếu có
            var quote = await _context.QuoteRequests.FindAsync(dto.QuoteRequestId);
            
            var order = new DonDatHang
            {
                OrderCode = "DH" + DateTime.Now.ToString("yyyyMMdd") + new Random().Next(1000, 9999),
                NgayDat = DateTime.Now,
                QuoteRequestId = dto.QuoteRequestId,
                MaTaiKhoan = userId,
                MaKH = dto.MaKH,
                Note = dto.Note,
                PaymentMethod = dto.PaymentMethod,
                Status = "AwaitingConfirmation",
                
                // Logistics
                ShippingAddress = dto.ShippingAddress,
                ShippingMethod = dto.ShippingMethod,
                ShippingCost = dto.ShippingCost,
                ExpectedDeliveryDate = dto.ExpectedDeliveryDate,
                ReceiverName = dto.ReceiverName,
                ReceiverPhone = dto.ReceiverPhone,

                // Billing
                BillingInfo = dto.BillingInfo,
                IsDepositPaid = dto.IsDepositPaid,

                // Operations
                AssigneeId = dto.AssigneeId,
                WarehouseId = dto.WarehouseId,
                Deadline = dto.Deadline,

                // Technical
                WarrantyTerms = dto.WarrantyTerms,
                TechnicalNotes = dto.TechnicalNotes,

                ChiTietDonHangs = dto.Items.Select(i => new ChiTietDonHang
                {
                    MaThietBi = i.ProductId,
                    SoLuong = i.SoLuong,
                    DonGia = i.UnitPrice
                }).ToList(),
                PaymentSchedules = dto.PaymentSchedules.Select(ps => new KeHoachCongNo
                {
                    PhaseName = ps.PhaseName,
                    PhaseOrder = ps.PhaseOrder,
                    Percentage = ps.Percentage,
                    GhiChu = ps.Note,
                    Status = "Pending"
                }).ToList()
            };

            order.TongGiaTri = order.ChiTietDonHangs.Sum(i => i.SoLuong * i.DonGia) + (dto.ShippingCost ?? 0);
            
            // Cập nhật trạng thái báo giá
            if (quote != null) quote.Status = "Accepted";

            _context.DonDatHangs.Add(order);
            await _context.SaveChangesAsync();

            return Ok(order);
        }

        // 3. DANH SÁCH ĐƠN HÀNG CỦA TÔI (Khách hàng)
        [HttpGet("my-orders")]
        public async Task<ActionResult<IEnumerable<DonDatHang>>> GetMyOrders()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdStr, out int userId)) return Unauthorized();

            return await _context.DonDatHangs
                .Include(o => o.KhachHang)
                .Include(o => o.ChiTietDonHangs)
                    .ThenInclude(ct => ct.ThietBi)
                .Include(o => o.Contract)
                .Include(o => o.PhieuThus)
                .Include(o => o.BienBanNghiemThus)
                .Include(o => o.Invoice)
                .Include(o => o.PaymentSchedules)
                .Where(o => o.MaTaiKhoan == userId)
                .OrderByDescending(o => o.NgayDat)
                .ToListAsync();
        }

        // 4. CHI TIẾT ĐƠN HÀNG
        [HttpGet("{id}")]
        public async Task<ActionResult<DonDatHang>> GetOrder(int id)
        {
            var order = await _context.DonDatHangs
                .Include(o => o.KhachHang)
                .Include(o => o.TaiKhoan)
                .Include(o => o.Assignee)
                .Include(o => o.Warehouse)
                .Include(o => o.ChiTietDonHangs)
                    .ThenInclude(d => d.ThietBi)
                .Include(o => o.PaymentSchedules)
                .Include(o => o.Contract)
                    .ThenInclude(c => c.PhieuThus)
                .Include(o => o.Invoice)
                .FirstOrDefaultAsync(o => o.MaDonHang == id);

            if (order == null) return NotFound();
            return Ok(order);
        }

        public class OrderCreateDto
        {
            public int? MaKH { get; set; }
            public int QuoteRequestId { get; set; }
            public string? Note { get; set; }
            public string? PaymentMethod { get; set; }
            
            // Logistics
            public string? ShippingAddress { get; set; }
            public string? ShippingMethod { get; set; }
            public decimal? ShippingCost { get; set; }
            public DateTime? ExpectedDeliveryDate { get; set; }
            public string? ReceiverName { get; set; }
            public string? ReceiverPhone { get; set; }

            // Billing
            public string? BillingInfo { get; set; }
            public bool IsDepositPaid { get; set; }

            // Operations
            public int? AssigneeId { get; set; }
            public byte? WarehouseId { get; set; }
            public DateTime? Deadline { get; set; }

            // Technical
            public string? WarrantyTerms { get; set; }
            public string? TechnicalNotes { get; set; }

            public List<OrderItemDto> Items { get; set; } = new();
            public List<PaymentScheduleDto> PaymentSchedules { get; set; } = new();
        }

        public class OrderItemDto
        {
            public int ProductId { get; set; }
            public int SoLuong { get; set; }
            public decimal UnitPrice { get; set; }
        }

        public class PaymentScheduleDto
        {
            public string? PhaseName { get; set; }
            public int PhaseOrder { get; set; }
            public int Percentage { get; set; }
            public string? Note { get; set; }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Manager,SaleManager")]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] OrderCreateDto dto)
        {
            var order = await _context.DonDatHangs
                .Include(o => o.ChiTietDonHangs)
                .Include(o => o.PaymentSchedules)
                .FirstOrDefaultAsync(o => o.MaDonHang == id);

            if (order == null) return NotFound("Đơn hàng không tồn tại.");

            // Update simple fields
            order.MaKH = dto.MaKH;
            order.Note = dto.Note;
            order.PaymentMethod = dto.PaymentMethod;
            order.ShippingAddress = dto.ShippingAddress;
            order.ShippingMethod = dto.ShippingMethod;
            order.ShippingCost = dto.ShippingCost;
            order.ExpectedDeliveryDate = dto.ExpectedDeliveryDate;
            order.ReceiverName = dto.ReceiverName;
            order.ReceiverPhone = dto.ReceiverPhone;
            order.BillingInfo = dto.BillingInfo;
            order.IsDepositPaid = dto.IsDepositPaid;
            order.AssigneeId = dto.AssigneeId;
            order.WarehouseId = dto.WarehouseId;
            order.Deadline = dto.Deadline;
            order.WarrantyTerms = dto.WarrantyTerms;
            order.TechnicalNotes = dto.TechnicalNotes;

            // Update items
            _context.ChiTietDonHangs.RemoveRange(order.ChiTietDonHangs);
            order.ChiTietDonHangs = dto.Items.Select(i => new ChiTietDonHang
            {
                MaThietBi = i.ProductId,
                SoLuong = i.SoLuong,
                DonGia = i.UnitPrice
            }).ToList();

            // Update payment schedules
            _context.KeHoachCongNos.RemoveRange(order.PaymentSchedules);
            order.PaymentSchedules = dto.PaymentSchedules.Select(p => new KeHoachCongNo
            {
                PhaseName = p.PhaseName,
                PhaseOrder = p.PhaseOrder,
                Percentage = p.Percentage,
                GhiChu = p.Note
            }).ToList();

            order.TongGiaTri = order.ChiTietDonHangs.Sum(x => x.SoLuong * x.DonGia) + (order.ShippingCost ?? 0);

            await _context.SaveChangesAsync();
            return Ok();
        }

        // 5. CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (Admin/Manager)
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin,Manager,SaleManager,Warehouse,Accounting")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] OrderStatusUpdateDto dto)
        {
            var order = await _context.DonDatHangs.FindAsync(id);
            if (order == null) return NotFound("Đơn hàng không tồn tại.");

            // Các trạng thái có thể có: 
            // - Confirmed: Đã xác nhận/có hợp đồng
            // - Processing: Chuyển sang Kho xuất hàng / Kỹ thuật lắp đặt
            // - Delivered_Accepted: Đã lắp đặt & nghiệm thu xong
            // - Completed: Đã thu tiền / Hoàn thành
            // - Cancelled: Đã hủy

            order.Status = dto.Status;
            
            if (!string.IsNullOrEmpty(dto.Note))
            {
                order.Note = (order.Note ?? "") + $"\n[{DateTime.Now:dd/MM/yyyy}] Cập nhật trạng thái: {dto.Note}";
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = $"Đã cập nhật trạng thái đơn hàng thành {dto.Status}." });
        }

        [HttpPut("{id}/deliver")]
        [Authorize(Roles = "Admin,Manager,SaleManager,Warehouse")]
        public async Task<IActionResult> DeliverOrder(int id, [FromBody] OrderDeliveryDto dto)
        {
            var order = await _context.DonDatHangs.FindAsync(id);
            if (order == null) return NotFound("Đơn hàng không tồn tại.");

            order.Status = "Delivering";
            order.ReceiverName = dto.ReceiverName;
            order.ReceiverPhone = dto.ReceiverPhone;
            order.ShippingAddress = dto.ShippingAddress;
            if (!string.IsNullOrEmpty(dto.Note))
            {
                order.Note = (order.Note ?? "") + $"\n[{DateTime.Now:dd/MM/yyyy}] Bắt đầu giao hàng cho {dto.ReceiverName} ({dto.ReceiverPhone}) tại {dto.ShippingAddress}. Ghi chú: {dto.Note}";
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã lập thông tin giao hàng và chuyển trạng thái sang Đang giao hàng." });
        }

        public class OrderDeliveryDto
        {
            public string ReceiverName { get; set; } = string.Empty;
            public string ReceiverPhone { get; set; } = string.Empty;
            public string ShippingAddress { get; set; } = string.Empty;
            public string? Note { get; set; }
        }

        // Khách hàng tiến hành thanh toán đơn hàng
        [HttpPut("{id}/pay")]
        [Authorize]
        public async Task<IActionResult> PayOrder(int id)
        {
            var order = await _context.DonDatHangs
                .Include(o => o.KhachHang)
                .FirstOrDefaultAsync(o => o.MaDonHang == id);
                
            if (order == null) return NotFound(new { message = "Không tìm thấy đơn hàng." });

            var phieuThu = await _context.PhieuThus.FirstOrDefaultAsync(p => p.MaDonHang == id);
            if (phieuThu != null)
            {
                phieuThu.IsPaid = true;
                phieuThu.NgayThu = DateTime.Now;
            }

            // Cập nhật trạng thái
            order.Status = "Completed"; // Hoặc InvoiceIssued

            // Tự động xuất hóa đơn nếu chưa có
            var existingHoaDon = await _context.HoaDons.FirstOrDefaultAsync(h => h.MaDonHang == id);
            if (existingHoaDon == null)
            {
                var hoaDon = new HoaDon
                {
                    MaHoaDon = $"INV-{DateTime.Now:yyyyMMdd}-{id}",
                    MaDonHang = id,
                    NgayXuat = DateTime.Now,
                    TotalAmount = order.TongGiaTri,
                    Status = "Issued",
                    BuyerName = order.KhachHang?.TenKH ?? "Khách hàng",
                    TaxCode = order.KhachHang?.MST ?? ""
                };
                _context.HoaDons.Add(hoaDon);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Thanh toán thành công. Hệ thống đã tự động xuất hóa đơn và phiếu bảo hành." });
        }

        // Khách hàng xác nhận biên bản nghiệm thu
        [HttpPut("acceptance/{bienBanId}/confirm")]
        [Authorize]
        public async Task<IActionResult> CustomerConfirmAcceptance(int bienBanId)
        {
            var bienBan = await _context.BienBanNghiemThus
                .Include(b => b.DonDatHang)
                .FirstOrDefaultAsync(b => b.MaBienBan == bienBanId);

            if (bienBan == null) return NotFound("Không tìm thấy biên bản");

            bienBan.CustomerConfirmed = true;
            bienBan.NgayXacNhan = DateTime.Now;

            // Chuyển trạng thái đơn hàng sang Đã nghiệm thu (Chờ thanh toán)
            if (bienBan.DonDatHang != null)
            {
                bienBan.DonDatHang.Status = "Delivered_Accepted";
                
                // Tự động lập phiếu thu cho khách hàng thanh toán
                var existingPhieuThu = await _context.PhieuThus.FirstOrDefaultAsync(p => p.MaDonHang == bienBan.MaDonHang);
                if (existingPhieuThu == null)
                {
                    var phieuThu = new PhieuThu
                    {
                        SoPhieu = $"PT-{DateTime.Now:yyyyMMdd}-{bienBan.MaDonHang}",
                        MaDonHang = bienBan.MaDonHang,
                        MaKH = bienBan.DonDatHang.MaKH,
                        SoTien = bienBan.DonDatHang.TongGiaTri,
                        HinhThucThanhToan = bienBan.DonDatHang.PaymentMethod ?? "Chuyển khoản",
                        IsPaid = false,
                        NgayThu = DateTime.Now
                    };
                    _context.PhieuThus.Add(phieuThu);
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Khách hàng đã xác nhận nghiệm thu điện tử thành công." });
        }

        public class OrderStatusUpdateDto
        {
            public string Status { get; set; } = string.Empty;
            public string? Note { get; set; }
        }
    }
}
