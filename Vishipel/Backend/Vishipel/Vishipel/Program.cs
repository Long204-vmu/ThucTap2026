using Microsoft.EntityFrameworkCore; // Thêm dòng này
using Vishipel.Data; // Thêm dòng này để gọi được AppDbContext

var builder = WebApplication.CreateBuilder(args);

// 1. Đăng ký Controllers
builder.Services.AddControllers();

// 2. Đăng ký Swagger (Tài liệu API)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 3. ĐĂNG KÝ APP DBCONTEXT KẾT NỐI VỚI SQL SERVER
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 4. Bật CORS (Rất quan trọng để Frontend React gọi được API mà không bị chặn)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000", "http://localhost:5173") // Port mặc định của Vite/React
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Cấu hình HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowReactApp"); // Kích hoạt CORS

app.UseAuthorization();

app.MapControllers();

app.Run();