using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vishipel.Data;
using Vishipel.Models;
using Microsoft.AspNetCore.Authorization;

namespace Vishipel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceRequestsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ServiceRequestsController(AppDbContext context)
        {
            _context = context;
        }

        // HÀM CHO KHÁCH HÀNG (KHÔNG CẦN LOGIN)
        [HttpPost("public-request")]
        [AllowAnonymous]
        public async Task<IActionResult> CreatePublicRequest(ServiceRequest request)
        {
            request.Status = "Mới";
            request.CreatedAt = DateTime.Now;
            _context.ServiceRequests.Add(request);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Gửi yêu cầu thành công!" });
        }

        // HÀM LẤY DANH SÁCH CHO ADMIN (BẮT BUỘC LOGIN)
        [HttpGet]
        [Authorize(Roles = "Sales, Admin")] 
        public async Task<ActionResult<IEnumerable<ServiceRequest>>> GetRequests()
        {
            // Sắp xếp yêu cầu mới nhất lên đầu để Sales dễ xử lý
            return await _context.ServiceRequests.OrderByDescending(r => r.CreatedAt).ToListAsync();
        }
    }
}