using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Vishipel.Core.Models;
using Vishipel.Infrastructure.Data;

namespace Vishipel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuoteRequestsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public QuoteRequestsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/QuoteRequests
        [HttpGet]
        [Authorize(Roles = "Admin,Manager,SaleManager")]
        public async Task<ActionResult<IEnumerable<QuoteRequest>>> GetQuoteRequests()
        {
            return await _context.QuoteRequests
                .Include(q => q.User)
                .Include(q => q.Items)
                .OrderByDescending(q => q.CreatedAt)
                .ToListAsync();
        }

        // GET: api/QuoteRequests/my-requests
        [HttpGet("my-requests")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<QuoteRequest>>> GetMyQuoteRequests()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdStr, out int userId)) return Unauthorized();

            return await _context.QuoteRequests
                .Where(q => q.UserId == userId)
                .Include(q => q.Items)
                .OrderByDescending(q => q.CreatedAt)
                .ToListAsync();
        }

        // GET: api/QuoteRequests/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Manager,SaleManager")]
        public async Task<ActionResult<QuoteRequest>> GetQuoteRequest(int id)
        {
            var quoteRequest = await _context.QuoteRequests
                .Include(q => q.User)
                .Include(q => q.Items)
                .FirstOrDefaultAsync(q => q.Id == id);

            if (quoteRequest == null) return NotFound();
            return quoteRequest;
        }

        // POST: api/QuoteRequests
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<QuoteRequest>> PostQuoteRequest(QuoteRequest quoteRequest)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdStr, out int userId)) return Unauthorized();

            quoteRequest.UserId = userId;
            quoteRequest.CreatedAt = DateTime.Now;
            quoteRequest.Status = "Pending";

            _context.QuoteRequests.Add(quoteRequest);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetQuoteRequests", new { id = quoteRequest.Id }, quoteRequest);
        }

        // PUT: api/QuoteRequests/5/reply
        [HttpPut("{id}/reply")]
        [Authorize(Roles = "Admin,Manager,SaleManager")]
        public async Task<IActionResult> ReplyToQuoteRequest(int id, QuoteRequest replyData)
        {
            var quoteRequest = await _context.QuoteRequests
                .Include(q => q.Items)
                .FirstOrDefaultAsync(q => q.Id == id);
            
            if (quoteRequest == null) return NotFound();

            quoteRequest.AdminReply = replyData.AdminReply;
            quoteRequest.TotalQuotedPrice = replyData.TotalQuotedPrice;
            quoteRequest.Status = "Quoted";

            // Cập nhật giá từng sản phẩm nếu có truyền lên
            if (replyData.Items != null)
            {
                foreach (var itemData in replyData.Items)
                {
                    // Tìm item theo ID duy nhất của bản ghi item trong báo giá
                    var existingItem = quoteRequest.Items.FirstOrDefault(i => i.Id == itemData.Id);
                    if (existingItem != null)
                    {
                        existingItem.ReferencePrice = itemData.ReferencePrice;
                    }
                }
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/QuoteRequests/5/accept
        [HttpPut("{id}/accept")]
        [Authorize]
        public async Task<IActionResult> AcceptQuoteRequest(int id, [FromBody] AcceptQuoteDto dto)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdStr, out int userId)) return Unauthorized();

            var quoteRequest = await _context.QuoteRequests
                .Include(q => q.Items)
                .Include(q => q.User) // Include user to get Email/Phone
                .FirstOrDefaultAsync(q => q.Id == id);
            
            if (quoteRequest == null) return NotFound();
            if (quoteRequest.UserId != userId) return Forbid(); // Đảm bảo đúng người dùng
            if (quoteRequest.Status != "Quoted") return BadRequest(new { message = "Chỉ có thể xác nhận các yêu cầu đã có báo giá." });

            quoteRequest.Status = "Accepted";

            // TỰ ĐỘNG THU THẬP THÔNG TIN KHÁCH HÀNG (CRM)
            // Tìm khách hàng dựa trên SĐT của người nhận hoặc Email của tài khoản
            var sdt = dto.ReceiverPhone ?? quoteRequest.User?.SoDienThoai;
            var email = quoteRequest.User?.Email;
            var tenKH = dto.ReceiverName ?? quoteRequest.User?.HoTen ?? "Khách hàng từ báo giá";

            var khachHang = await _context.KhachHangs.FirstOrDefaultAsync(k => 
                (!string.IsNullOrEmpty(sdt) && k.SoDienThoai == sdt) || 
                (!string.IsNullOrEmpty(email) && k.Email == email)
            );

            if (khachHang == null)
            {
                // Chưa có thì tạo mới hồ sơ CRM
                khachHang = new KhachHang
                {
                    TenKH = tenKH,
                    SoDienThoai = sdt,
                    Email = email,
                    DiaChi = dto.ShippingAddress,
                    LoaiKhachHang = "Cá nhân"
                };
                _context.KhachHangs.Add(khachHang);
                await _context.SaveChangesAsync(); // Lưu để sinh ra MaKH
            }
            else
            {
                // Nếu đã có nhưng đang thiếu thông tin thì cập nhật thêm
                bool isUpdated = false;
                if (string.IsNullOrEmpty(khachHang.DiaChi) && !string.IsNullOrEmpty(dto.ShippingAddress)) { khachHang.DiaChi = dto.ShippingAddress; isUpdated = true; }
                if (string.IsNullOrEmpty(khachHang.SoDienThoai) && !string.IsNullOrEmpty(sdt)) { khachHang.SoDienThoai = sdt; isUpdated = true; }
                
                if (isUpdated) await _context.SaveChangesAsync();
            }

            // TỰ ĐỘNG TẠO ĐƠN ĐẶT HÀNG (Step 4.3) kèm thông tin giao hàng
            var order = new DonDatHang
            {
                OrderCode = "DH" + DateTime.Now.ToString("yyyyMMdd") + new Random().Next(1000, 9999),
                MaTaiKhoan = quoteRequest.UserId,
                MaKH = khachHang.MaKH, // Đã tự động gán khách hàng!
                NgayDat = DateTime.Now,
                TongGiaTri = quoteRequest.TotalQuotedPrice ?? 0,
                Status = "Confirmed", // Trạng thái đã chốt thông tin
                Note = dto.Note ?? $"Đơn hàng tự động từ Báo giá #{quoteRequest.Id}",
                ShippingAddress = dto.ShippingAddress ?? khachHang.DiaChi,
                ReceiverName = dto.ReceiverName ?? khachHang.TenKH,
                ReceiverPhone = dto.ReceiverPhone ?? khachHang.SoDienThoai,
                ChiTietDonHangs = quoteRequest.Items.Select(item => new ChiTietDonHang
                {
                    MaThietBi = item.ProductId,
                    SoLuong = item.Quantity,
                    DonGia = item.ReferencePrice ?? 0
                }).ToList()
            };

            _context.DonDatHangs.Add(order);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xác nhận báo giá, tạo hồ sơ khách hàng tự động và sinh đơn đặt hàng thành công.", orderId = order.MaDonHang });
        }

        public class AcceptQuoteDto
        {
            public string? ShippingAddress { get; set; }
            public string? ReceiverName { get; set; }
            public string? ReceiverPhone { get; set; }
            public string? Note { get; set; }
        }

        // PUT: api/QuoteRequests/5/reject
        [HttpPut("{id}/reject")]
        [Authorize]
        public async Task<IActionResult> RejectQuoteRequest(int id, [FromBody] RejectDto rejectData)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdStr, out int userId)) return Unauthorized();

            var quoteRequest = await _context.QuoteRequests.FindAsync(id);
            if (quoteRequest == null) return NotFound();
            if (quoteRequest.UserId != userId) return Forbid();

            quoteRequest.Status = "Rejected";
            quoteRequest.AdminReply = (quoteRequest.AdminReply ?? "") + $"\n[Khách từ chối]: {rejectData.Reason}";
            
            await _context.SaveChangesAsync();

            return NoContent();
        }

        public class RejectDto { public string? Reason { get; set; } }
    }
}
