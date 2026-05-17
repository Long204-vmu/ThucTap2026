using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vishipel.Core.Models;
using Vishipel.Infrastructure.Data;

namespace Vishipel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin, Manager, Warehouse")]
    public class WarehouseController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WarehouseController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("stock")]
        public async Task<IActionResult> GetStock([FromQuery] int threshold = 10)
        {
            var stockItems = await _context.TonKhoChiTiets
                .Include(t => t.Kho)
                .Include(t => t.ThietBi)
                .Select(t => new
                {
                    t.MaKho,
                    Kho = t.Kho != null ? t.Kho.TenKho : "",
                    t.MaThietBi,
                    ThietBi = t.ThietBi != null ? t.ThietBi.TenThietBi : "",
                    t.SoLuongTon,
                    t.NgayCapNhat,
                    LowStock = t.SoLuongTon <= threshold
                })
                .OrderByDescending(t => t.SoLuongTon)
                .ToListAsync();

            return Ok(stockItems);
        }

        [HttpGet("imports")]
        public async Task<IActionResult> GetImports()
        {
            var importRecords = await _context.PhieuNhapKhos
                .Include(p => p.Kho)
                .Include(p => p.NhaCungCap)
                .Include(p => p.ChiTietNhapKhos)
                    .ThenInclude(d => d.ThietBi)
                .OrderByDescending(p => p.NgayNhap)
                .Select(p => new
                {
                    p.MaPhieuNhap,
                    p.NgayNhap,
                    p.MaKho,
                    Kho = p.Kho != null ? p.Kho.TenKho : "",
                    p.MaNCC,
                    NhaCungCap = p.NhaCungCap != null ? p.NhaCungCap.TenNCC : null,
                    p.GhiChu,
                    Items = p.ChiTietNhapKhos.Select(i => new
                    {
                        i.MaThietBi,
                        ThietBi = i.ThietBi != null ? i.ThietBi.TenThietBi : "",
                        i.SoLuong,
                        i.DonGiaNhap
                    })
                })
                .ToListAsync();

            return Ok(importRecords);
        }

        [HttpGet("exports")]
        public async Task<IActionResult> GetExports()
        {
            var exportRecords = await _context.PhieuXuatKhos
                .Include(p => p.Kho)
                .Include(p => p.ChiTietXuatKhos)
                    .ThenInclude(d => d.ThietBi)
                .OrderByDescending(p => p.NgayXuat)
                .Select(p => new
                {
                    p.MaPhieuXuat,
                    p.NgayXuat,
                    p.MaKho,
                    Kho = p.Kho != null ? p.Kho.TenKho : "",
                    p.MaHopDong,
                    p.LyDoXuat,
                    Items = p.ChiTietXuatKhos.Select(i => new
                    {
                        i.MaThietBi,
                        ThietBi = i.ThietBi != null ? i.ThietBi.TenThietBi : "",
                        i.SoLuong,
                        i.DonGiaBan
                    })
                })
                .ToListAsync();

            return Ok(exportRecords);
        }

        [HttpPost("import")]
        public async Task<IActionResult> CreateImport(WarehouseImportDto dto)
        {
            if (dto.MaKho == null)
                return BadRequest(new { message = "Vui lòng chọn kho nhập." });

            if (dto.Items == null || !dto.Items.Any())
                return BadRequest(new { message = "Vui lòng thêm ít nhất một mặt hàng." });

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var import = new PhieuNhapKho
                {
                    MaKho = dto.MaKho,
                    MaNCC = dto.MaNCC,
                    MaTaiKhoan = GetCurrentUserId(),
                    GhiChu = dto.GhiChu,
                    NgayNhap = DateTime.Now,
                    ChiTietNhapKhos = dto.Items.Select(item => new ChiTietNhapKho
                    {
                        MaThietBi = item.MaThietBi,
                        SoLuong = item.SoLuong,
                        DonGiaNhap = item.DonGiaNhap
                    }).ToList()
                };

                _context.PhieuNhapKhos.Add(import);

                foreach (var item in dto.Items)
                {
                    await UpdateStockAsync(dto.MaKho.Value, item.MaThietBi, item.SoLuong);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { message = "Phiếu nhập kho đã được tạo thành công." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("export")]
        public async Task<IActionResult> CreateExport(WarehouseExportDto dto)
        {
            if (dto.MaKho == null)
                return BadRequest(new { message = "Vui lòng chọn kho xuất." });

            if (dto.Items == null || !dto.Items.Any())
                return BadRequest(new { message = "Vui lòng thêm ít nhất một mặt hàng." });

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var export = new PhieuXuatKho
                {
                    MaKho = dto.MaKho,
                    MaTaiKhoan = GetCurrentUserId(),
                    MaHopDong = dto.MaHopDong,
                    LyDoXuat = dto.LyDoXuat,
                    NgayXuat = DateTime.Now,
                    ChiTietXuatKhos = dto.Items.Select(item => new ChiTietXuatKho
                    {
                        MaThietBi = item.MaThietBi,
                        SoLuong = item.SoLuong,
                        DonGiaBan = item.DonGiaBan
                    }).ToList()
                };

                _context.PhieuXuatKhos.Add(export);

                foreach (var item in dto.Items)
                {
                    await UpdateStockAsync(dto.MaKho.Value, item.MaThietBi, -item.SoLuong);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { message = "Phiếu xuất kho đã được tạo thành công." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("transfer")]
        public async Task<IActionResult> CreateTransfer(WarehouseTransferDto dto)
        {
            if (dto.MaKhoNguon == null || dto.MaKhoDich == null)
                return BadRequest(new { message = "Vui lòng chọn kho nguồn và kho đích." });

            if (dto.MaKhoNguon == dto.MaKhoDich)
                return BadRequest(new { message = "Kho nguồn và kho đích phải khác nhau." });

            if (dto.Items == null || !dto.Items.Any())
                return BadRequest(new { message = "Vui lòng thêm ít nhất một mặt hàng." });

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var transferOut = new PhieuXuatKho
                {
                    MaKho = dto.MaKhoNguon,
                    MaTaiKhoan = GetCurrentUserId(),
                    LyDoXuat = dto.LyDo,
                    NgayXuat = DateTime.Now,
                    ChiTietXuatKhos = dto.Items.Select(item => new ChiTietXuatKho
                    {
                        MaThietBi = item.MaThietBi,
                        SoLuong = item.SoLuong,
                        DonGiaBan = item.DonGiaNhap
                    }).ToList()
                };

                var transferIn = new PhieuNhapKho
                {
                    MaKho = dto.MaKhoDich,
                    MaTaiKhoan = GetCurrentUserId(),
                    GhiChu = $"Điều chuyển từ kho {dto.MaKhoNguon}: {dto.LyDo}",
                    NgayNhap = DateTime.Now,
                    ChiTietNhapKhos = dto.Items.Select(item => new ChiTietNhapKho
                    {
                        MaThietBi = item.MaThietBi,
                        SoLuong = item.SoLuong,
                        DonGiaNhap = item.DonGiaNhap
                    }).ToList()
                };

                _context.PhieuXuatKhos.Add(transferOut);
                _context.PhieuNhapKhos.Add(transferIn);

                foreach (var item in dto.Items)
                {
                    await UpdateStockAsync(dto.MaKhoNguon.Value, item.MaThietBi, -item.SoLuong);
                    await UpdateStockAsync(dto.MaKhoDich.Value, item.MaThietBi, item.SoLuong);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { message = "Điều chuyển kho đã được thực hiện thành công." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        private int? GetCurrentUserId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return int.TryParse(userId, out var id) ? id : null;
        }

        private async Task UpdateStockAsync(byte maKho, int maThietBi, int delta)
        {
            var stock = await _context.TonKhoChiTiets.FindAsync(maKho, maThietBi);
            if (stock == null)
            {
                if (delta < 0)
                    throw new InvalidOperationException($"Kho {maKho} không có mặt hàng {maThietBi} để xuất.");

                stock = new TonKhoChiTiet
                {
                    MaKho = maKho,
                    MaThietBi = maThietBi,
                    SoLuongTon = delta,
                    NgayCapNhat = DateTime.Now
                };
                _context.TonKhoChiTiets.Add(stock);
            }
            else
            {
                var nextQty = stock.SoLuongTon + delta;
                if (nextQty < 0)
                    throw new InvalidOperationException($"Không đủ tồn kho cho mặt hàng {maThietBi} tại kho {maKho}.");

                stock.SoLuongTon = nextQty;
                stock.NgayCapNhat = DateTime.Now;
                _context.Entry(stock).State = EntityState.Modified;
            }
        }

        public class WarehouseReceiptItemDto
        {
            public int MaThietBi { get; set; }
            public int SoLuong { get; set; }
            public decimal DonGiaNhap { get; set; }
        }

        public class WarehouseExportItemDto
        {
            public int MaThietBi { get; set; }
            public int SoLuong { get; set; }
            public decimal DonGiaBan { get; set; }
        }

        public class WarehouseImportDto
        {
            public byte? MaKho { get; set; }
            public int? MaNCC { get; set; }
            public string? GhiChu { get; set; }
            public List<WarehouseReceiptItemDto> Items { get; set; } = new();
        }

        public class WarehouseExportDto
        {
            public byte? MaKho { get; set; }
            public string? MaHopDong { get; set; }
            public string? LyDoXuat { get; set; }
            public List<WarehouseExportItemDto> Items { get; set; } = new();
        }

        public class WarehouseTransferDto
        {
            public byte? MaKhoNguon { get; set; }
            public byte? MaKhoDich { get; set; }
            public string? LyDo { get; set; }
            public List<WarehouseReceiptItemDto> Items { get; set; } = new();
        }
    }
}
