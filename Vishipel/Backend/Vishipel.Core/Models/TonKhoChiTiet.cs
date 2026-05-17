using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vishipel.Core.Models
{
    public class TonKhoChiTiet
    {
        public byte MaKho { get; set; }
        public int MaThietBi { get; set; }
        
        public int SoLuongTon { get; set; } = 0;
        public DateTime NgayCapNhat { get; set; } = DateTime.Now;

        [ForeignKey("MaKho")]
        public virtual Kho? Kho { get; set; }
        
        [ForeignKey("MaThietBi")]
        public virtual ThietBi? ThietBi { get; set; }
    }
}
