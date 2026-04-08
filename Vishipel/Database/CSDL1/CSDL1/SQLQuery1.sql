-- Tạo Database (Nếu chưa có)
-- CREATE DATABASE VishipelEMS;
-- GO
-- USE VishipelEMS;
-- GO

-- =========================================
-- 1. Bảng Danh mục thiết bị
-- =========================================
CREATE TABLE Categories (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Slug VARCHAR(50) NOT NULL UNIQUE, -- VD: 'radar', 'ais'
    Name NVARCHAR(100) NOT NULL,      -- VD: 'Máy Radar'
    ColorCode VARCHAR(20)             -- Phục vụ render UI (VD: 'blue', 'cyan')
);

-- =========================================
-- 2. Bảng Sản phẩm cốt lõi
-- =========================================
CREATE TABLE Products (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CategoryId INT NOT NULL FOREIGN KEY REFERENCES Categories(Id),
    Name NVARCHAR(200) NOT NULL,
    Model VARCHAR(100),
    Brand NVARCHAR(100),
    Price DECIMAL(18,2) NOT NULL DEFAULT 0,
    Status NVARCHAR(50) DEFAULT N'Còn hàng', -- 'Còn hàng', 'Sắp về'
    
    -- Thống kê hiển thị
    Rating FLOAT DEFAULT 5.0,
    ReviewCount INT DEFAULT 0,
    
    -- Nội dung chi tiết
    ShortDescription NVARCHAR(500),
    Description NVARCHAR(MAX),
    Warranty NVARCHAR(100),
    Origin NVARCHAR(100),
    
    -- Dữ liệu dạng JSON (Cho EF Core 8 Map)
    ImagesJson NVARCHAR(MAX),         -- ["/img/1.jpg", "/img/2.jpg"]
    SpecsJson NVARCHAR(MAX),          -- [{"label": "Tần số", "value": "9410 MHz"}]
    CertificationsJson NVARCHAR(MAX), -- ["IMO", "SOLAS"]

    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

-- =========================================
-- 3. Bảng Quản lý Người dùng (Users)
-- =========================================
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(150) NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE,
    Phone VARCHAR(20),
    Username VARCHAR(50) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL, -- KHÔNG LƯU TEXT THƯỜNG
    Department NVARCHAR(100),           -- Phòng ban
    Role VARCHAR(50) DEFAULT 'User',    -- 'Admin', 'User', 'Technician'
    IsApproved BIT DEFAULT 0,           -- 0: Chờ duyệt, 1: Đã duyệt (Theo logic Register.jsx)
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- =========================================
-- 4. Bảng Yêu cầu Liên hệ / Tư vấn
-- =========================================
CREATE TABLE SupportRequests (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(150) NOT NULL,
    Phone VARCHAR(20) NOT NULL,
    Email VARCHAR(150) NOT NULL,
    Company NVARCHAR(200),
    RequestType VARCHAR(50) NOT NULL,   -- 'consulting', 'support', 'complaint'
    Subject NVARCHAR(255) NOT NULL,
    Message NVARCHAR(MAX) NOT NULL,
    Status VARCHAR(50) DEFAULT 'New',   -- 'New', 'In-Progress', 'Resolved'
    CreatedAt DATETIME DEFAULT GETDATE()
);