using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Vishipel.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhuongThucThanhToanController : ControllerBase
    {
        private readonly string _filePath;

        public PhuongThucThanhToanController(IWebHostEnvironment env)
        {
            var dataDir = Path.Combine(env.ContentRootPath, "Data");
            if (!Directory.Exists(dataDir))
            {
                Directory.CreateDirectory(dataDir);
            }
            _filePath = Path.Combine(dataDir, "PhuongThucThanhToan.json");
            
            if (!System.IO.File.Exists(_filePath))
            {
                var initialData = new List<DynamicCategory>
                {
                    new DynamicCategory { MaLoai = 1, TenLoai = "Tiền mặt", MoTa = "Thanh toán bằng tiền mặt" },
                    new DynamicCategory { MaLoai = 2, TenLoai = "Chuyển khoản", MoTa = "Thanh toán qua ngân hàng" },
                    new DynamicCategory { MaLoai = 3, TenLoai = "Thẻ tín dụng", MoTa = "Thanh toán qua thẻ VISA/MasterCard" }
                };
                System.IO.File.WriteAllText(_filePath, JsonSerializer.Serialize(initialData));
            }
        }

        private List<DynamicCategory> GetData()
        {
            var json = System.IO.File.ReadAllText(_filePath);
            return JsonSerializer.Deserialize<List<DynamicCategory>>(json) ?? new List<DynamicCategory>();
        }

        private void SaveData(List<DynamicCategory> data)
        {
            System.IO.File.WriteAllText(_filePath, JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true }));
        }

        [HttpGet]
        public ActionResult<IEnumerable<object>> Get()
        {
            var data = GetData();
            return Ok(data.Select(d => new { maLoai = d.MaLoai, tenLoai = d.TenLoai, moTa = d.MoTa }));
        }

        [HttpGet("{id}")]
        public ActionResult<object> Get(int id)
        {
            var item = GetData().FirstOrDefault(x => x.MaLoai == id);
            if (item == null) return NotFound();
            return Ok(new { maLoai = item.MaLoai, tenLoai = item.TenLoai, moTa = item.MoTa });
        }

        [HttpPost]
        public ActionResult<object> Post([FromBody] DynamicCategoryDto dto)
        {
            var data = GetData();
            int newId = data.Any() ? data.Max(x => x.MaLoai) + 1 : 1;
            var newItem = new DynamicCategory
            {
                MaLoai = newId,
                TenLoai = dto.TenLoai,
                MoTa = dto.MoTa
            };
            data.Add(newItem);
            SaveData(data);
            return CreatedAtAction(nameof(Get), new { id = newItem.MaLoai }, new { maLoai = newItem.MaLoai, tenLoai = newItem.TenLoai, moTa = newItem.MoTa });
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] DynamicCategoryDto dto)
        {
            var data = GetData();
            var item = data.FirstOrDefault(x => x.MaLoai == id);
            if (item == null) return NotFound();

            item.TenLoai = dto.TenLoai;
            item.MoTa = dto.MoTa;
            SaveData(data);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var data = GetData();
            var item = data.FirstOrDefault(x => x.MaLoai == id);
            if (item == null) return NotFound();

            data.Remove(item);
            SaveData(data);
            return NoContent();
        }
    }
}
