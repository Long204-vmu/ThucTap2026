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
    [Authorize] // Bắt buộc đăng nhập cho mọi thao tác
    public class QuoteRequestsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public QuoteRequestsController(AppDbContext context)
        {
            _context = context;
        }

        // DTOs
        public class CreateQuoteRequestDto
        {
            public string? Note { get; set; }
            public List<CartItemDto> Items { get; set; } = new();
        }

        public class CartItemDto
        {
            public int ProductId { get; set; }
            public string ProductName { get; set; } = "";
            public int Quantity { get; set; } = 1;
            public decimal? ReferencePrice { get; set; }
        }

        public class AdminReplyDto
        {
            public string AdminReply { get; set; } = "";
            public decimal? TotalQuotedPrice { get; set; }
        }

        // 1. TẠO MỚI YÊU CẦU BÁO GIÁ (Cho Customer)
        [HttpPost]
        public async Task<ActionResult<QuoteRequest>> CreateRequest(CreateQuoteRequestDto dto)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
            {
                return Unauthorized(new { message = "Không xác định được danh tính người dùng." });
            }

            var request = new QuoteRequest
            {
                UserId = userId,
                Note = dto.Note,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow,
                Items = dto.Items.Select(i => new QuoteRequestItem
                {
                    ProductId = i.ProductId,
                    ProductName = i.ProductName,
                    Quantity = i.Quantity,
                    ReferencePrice = i.ReferencePrice
                }).ToList()
            };

            _context.QuoteRequests.Add(request);
            await _context.SaveChangesAsync();

            return Ok(request);
        }

        // 2. LẤY DANH SÁCH YÊU CẦU CỦA MÌNH (Cho Customer)
        [HttpGet("my-requests")]
        public async Task<ActionResult<IEnumerable<QuoteRequest>>> GetMyRequests()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
            {
                return Unauthorized();
            }

            var requests = await _context.QuoteRequests
                .Include(r => r.Items)
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return Ok(requests);
        }

        // 3. LẤY TOÀN BỘ YÊU CẦU (Cho Admin/SaleManager)
        [HttpGet]
        [Authorize(Roles = "Admin, SaleManager, Manager")]
        public async Task<ActionResult<IEnumerable<QuoteRequest>>> GetAllRequests()
        {
            var requests = await _context.QuoteRequests
                .Include(r => r.User)
                .Include(r => r.Items)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return Ok(requests);
        }

        // 4. PHẢN HỒI YÊU CẦU (Cho Admin/SaleManager)
        [HttpPut("{id}/reply")]
        [Authorize(Roles = "Admin, SaleManager, Manager")]
        public async Task<IActionResult> ReplyToRequest(int id, AdminReplyDto dto)
        {
            var request = await _context.QuoteRequests.FindAsync(id);
            if (request == null) return NotFound(new { message = "Không tìm thấy yêu cầu này." });

            request.AdminReply = dto.AdminReply;
            request.TotalQuotedPrice = dto.TotalQuotedPrice;
            request.Status = "Quoted";
            request.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(request);
        }

        // 5. KHÁCH HÀNG XÁC NHẬN BÁO GIÁ
        [HttpPut("{id}/accept")]
        public async Task<IActionResult> AcceptQuote(int id)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
                return Unauthorized();

            var request = await _context.QuoteRequests.FindAsync(id);
            if (request == null) return NotFound(new { message = "Không tìm thấy yêu cầu này." });
            if (request.UserId != userId) return Forbid();
            if (request.Status != "Quoted") return BadRequest(new { message = "Chỉ có thể xác nhận báo giá ở trạng thái 'Đã báo giá'." });

            request.Status = "Accepted";
            request.AcceptedAt = DateTime.UtcNow;
            request.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Bạn đã xác nhận báo giá thành công!", request });
        }

        // 6. KHÁCH HÀNG TỪ CHỐI BÁO GIÁ
        public class RejectQuoteDto
        {
            public string? Reason { get; set; }
        }

        [HttpPut("{id}/reject")]
        public async Task<IActionResult> RejectQuote(int id, RejectQuoteDto dto)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
                return Unauthorized();

            var request = await _context.QuoteRequests.FindAsync(id);
            if (request == null) return NotFound(new { message = "Không tìm thấy yêu cầu này." });
            if (request.UserId != userId) return Forbid();
            if (request.Status != "Quoted") return BadRequest(new { message = "Chỉ có thể từ chối báo giá ở trạng thái 'Đã báo giá'." });

            request.Status = "Rejected";
            request.RejectedAt = DateTime.UtcNow;
            request.RejectionReason = dto.Reason;
            request.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Bạn đã từ chối báo giá.", request });
        }
    }
}
