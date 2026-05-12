using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vishipel.Core.Models;
using Vishipel.Infrastructure.Data;

namespace Vishipel.API.Controllers
{
    [Route("api/products/{productId:int}/reviews")]
    [ApiController]
    public class ProductReviewsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductReviewsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetByProduct(int productId)
        {
            var productExists = await _context.Products.AnyAsync(p => p.Id == productId);
            if (!productExists) return NotFound("Sản phẩm không tồn tại.");

            var reviews = await _context.ProductReviews
                .Where(r => r.ProductId == productId)
                .Include(r => r.User)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new
                {
                    r.Id,
                    r.Rating,
                    r.Comment,
                    r.CreatedAt,
                    User = new
                    {
                        r.UserId,
                        FullName = r.User != null ? r.User.FullName : string.Empty,
                        Username = r.User != null ? r.User.Username : string.Empty
                    }
                })
                .ToListAsync();

            return Ok(reviews);
        }

        public class CreateProductReviewDto
        {
            public int Rating { get; set; }
            public string? Comment { get; set; }
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> Create(int productId, [FromBody] CreateProductReviewDto dto)
        {
            if (dto.Rating < 1 || dto.Rating > 5)
                return BadRequest("Điểm đánh giá phải từ 1 đến 5.");

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == productId);
            if (product == null) return NotFound("Sản phẩm không tồn tại.");

            var existingReview = await _context.ProductReviews
                .FirstOrDefaultAsync(r => r.ProductId == productId && r.UserId == userId);

            if (existingReview != null)
            {
                existingReview.Rating = dto.Rating;
                existingReview.Comment = dto.Comment?.Trim();
            }
            else
            {
                var review = new ProductReview
                {
                    ProductId = productId,
                    UserId = userId,
                    Rating = dto.Rating,
                    Comment = dto.Comment?.Trim()
                };

                _context.ProductReviews.Add(review);
            }

            await _context.SaveChangesAsync();

            await RecalculateProductRating(productId);
            return Ok(new { message = "Đánh giá thành công." });
        }

        private async Task RecalculateProductRating(int productId)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == productId);
            if (product == null) return;

            var query = _context.ProductReviews.Where(r => r.ProductId == productId);
            var reviewCount = await query.CountAsync();
            var average = reviewCount == 0 ? 5.0 : await query.AverageAsync(r => (double)r.Rating);

            product.ReviewCount = reviewCount;
            product.Rating = Math.Round(average, 2);
            await _context.SaveChangesAsync();
        }
    }
}

