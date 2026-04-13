using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Vishipel.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
    ?? builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Missing ConnectionStrings:DefaultConnection.");
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "VishipelBackend";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "VishipelFrontend";
var jwtKey = Environment.GetEnvironmentVariable("JWT__KEY")
    ?? builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("Missing Jwt:Key (or JWT__KEY env var).");

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
    options.UseSqlServer(connectionString));

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
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

var app = builder.Build();

// Cấu hình HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseExceptionHandler(errorApp =>
    {
        errorApp.Run(async context =>
        {
            var exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerPathFeature>();
            var logger = context.RequestServices.GetRequiredService<ILoggerFactory>().CreateLogger("GlobalException");

            if (exceptionHandlerPathFeature?.Error != null)
            {
                logger.LogError(exceptionHandlerPathFeature.Error, "Unhandled exception at {Path}", exceptionHandlerPathFeature.Path);
            }

            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(new
            {
                message = "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau."
            });
        });
    });
}

app.UseHttpsRedirection();

app.UseCors("AllowReactApp"); // Kích hoạt CORS (Phải đứng trước Authorization)

app.UseStaticFiles(); // Mở cửa cho Frontend lấy ảnh

app.UseAuthentication(); // Bật máy quét thẻ (Bắt buộc đứng trước Authorization)

app.UseAuthorization(); // Bật phân quyền

app.MapControllers();

app.Run();