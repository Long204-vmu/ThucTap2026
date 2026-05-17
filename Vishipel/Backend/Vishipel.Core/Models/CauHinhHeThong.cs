using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vishipel.Core.Models
{
    public class CauHinhHeThong
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string TenWebsite { get; set; } = "Vishipel EMS";

        [StringLength(500)]
        public string Slogan { get; set; } = "";

        [StringLength(500)]
        public string LogoUrl { get; set; } = "";

        [StringLength(50)]
        public string Hotline { get; set; } = "";

        [StringLength(200)]
        public string EmailLienHe { get; set; } = "";

        [StringLength(500)]
        public string DiaChi { get; set; } = "";

        [StringLength(200)]
        public string BanQuyen { get; set; } = "© 2026 Vishipel. All rights reserved.";

        public string? SmtpServer { get; set; }
        public int? SmtpPort { get; set; }
        public string? SmtpUser { get; set; }
        public string? SmtpPass { get; set; }

        public DateTime NgayCapNhat { get; set; } = DateTime.Now;
    }
}
