using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Vishipel.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 1. ĐĂNG KÝ CORS (Tách riêng ra độc lập)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// 2. ĐĂNG KÝ CONTROLLERS VÀ CHỐNG VÒNG LẶP JSON
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

// 3. Đăng ký Swagger (Tài liệu API)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 4. ĐĂNG KÝ APP DBCONTEXT 
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 5. ĐĂNG KÝ MÁY QUÉT JWT (AUTHENTICATION)
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            // Thêm dấu ! ở cuối để báo với C# rằng giá trị này chắc chắn không null
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

var app = builder.Build();

// Cấu hình HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowReactApp"); // Kích hoạt CORS (Phải đứng trước Authorization)

app.UseStaticFiles(); // Mở cửa cho Frontend lấy ảnh

app.UseAuthentication(); // Bật máy quét thẻ (Bắt buộc đứng trước Authorization)

app.UseAuthorization(); // Bật phân quyền

app.MapControllers();

app.Run();