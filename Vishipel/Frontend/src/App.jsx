import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from 'antd';

// ── Components dùng chung ──────────────────────────────────────────────────────
import HeaderComponent from './components/layout/Header';
import FooterComponent from './components/layout/Footer';
import AdminSidebar from './components/layout/AdminSidebar';

// ── Pages ─────────────────────────────────────────────────────────────────────
import Home     from './pages/Home';
import Product  from './pages/Product';
import ProductDetail from './pages/ProductDetail';
import About    from './pages/About';
import Contact  from './pages/Contact';
import Login    from './pages/Login';
import Register from './pages/Register';
import AddProduct from './pages/admin/AddProduct';
import ProtectedRoute from './components/common/ProtectedRoute';
import ManageProducts from './pages/admin/ManageProducts';
import ManageCategories from './pages/admin/ManageCategories';
import ManageUsers from './pages/admin/ManageUsers';
import SystemManagement from './pages/admin/SystemManagement';
import BackupRestore from './pages/admin/BackupRestore';
import WebsiteSettings from './pages/admin/WebsiteSettings';
import WarehouseManagement from './pages/admin/WarehouseManagement';
import WarehouseStock from './pages/admin/warehouse/WarehouseStock';
import WarehouseImport from './pages/admin/warehouse/WarehouseImport';
import WarehouseExport from './pages/admin/warehouse/WarehouseExport';
import WarehouseTransfer from './pages/admin/warehouse/WarehouseTransfer';
import TechnicalManagement from './pages/admin/TechnicalManagement';
import ReportsManagement from './pages/admin/ReportsManagement';
import MyRequests from './pages/MyRequests';
import MyOrders from './pages/MyOrders';
import ManageQuotes from './pages/admin/ManageQuotes';
import SalesDashboard from './pages/admin/SalesDashboard';
import CreateOrder from './pages/admin/CreateOrder';
import ContractForm from './pages/admin/ContractForm';
import DeliveryOrderForm from './pages/admin/DeliveryOrderForm';
import InvoiceForm from './pages/admin/InvoiceForm';
import ManageSuppliers from './pages/admin/ManageSuppliers';
import Profile from './pages/Profile';

const { Content } = Layout;

// ─── Trang toàn màn hình (không có Header/Footer) ─────────────────────────────
const FULLSCREEN_ROUTES = ['/login', '/register'];

const AppLayout = ({ children }) => {
  const location = useLocation();
  const isFullscreen = FULLSCREEN_ROUTES.includes(location.pathname);
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isFullscreen) {
    return <>{children}</>;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <HeaderComponent />
      <Layout style={{ marginTop: 76 }}>
        {isAdminRoute && <AdminSidebar />}
        <Layout style={{ 
          padding: isAdminRoute ? '0' : '0', 
          marginLeft: isAdminRoute ? 260 : 0,
          transition: 'all 0.2s',
          minHeight: 'calc(100vh - 76px)'
        }}>
          <Content>
            {children}
          </Content>
          {!isAdminRoute && <FooterComponent />}
        </Layout>
      </Layout>
    </Layout>
  );
};

const App = () => (
    <AppLayout>
      <Routes>
        {/* CÁC TRANG DÀNH CHO KHÁCH */}
        <Route path="/"         element={<Home />} />
        <Route path="/products" element={<Product />} />
        <Route path="/products/:id" element={<ProductDetail />}  />
        <Route path="/about"    element={<About />} />
        <Route path="/contact"  element={<Contact />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile"  element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        
        {/* Lịch sử báo giá */}
        <Route path="/my-requests" element={<ProtectedRoute><MyRequests /></ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
        
        {/* CÁC TRANG QUẢN TRỊ (Bị khóa bởi ProtectedRoute) */}
        
        {/* 1. Trang Quản lý Danh sách */}
        <Route 
          path="/admin/products" 
          element={<ProtectedRoute allowedRoles={['Admin', 'Manager']}><ManageProducts /></ProtectedRoute>} 
        />
        
        {/* 2. Trang Thêm mới */}
        <Route 
          path="/admin/products/add" 
          element={<ProtectedRoute allowedRoles={['Admin', 'Manager']}><AddProduct /></ProtectedRoute>} 
        />
        
        {/* 3. Trang Sửa thiết bị (Có truyền ID) */}
        <Route 
          path="/admin/products/edit/:id" 
          element={<ProtectedRoute allowedRoles={['Admin', 'Manager']}><AddProduct /></ProtectedRoute>} 
        />
        <Route path="/admin/categories/NhaCungCap" element={<ProtectedRoute allowedRoles={['Admin', 'Manager']}><ManageSuppliers /></ProtectedRoute>} />
        <Route path="/admin/categories/:type" element={<ProtectedRoute allowedRoles={['Admin', 'Manager']}><ManageCategories /></ProtectedRoute>} />
        <Route path="/admin/categories" element={<Navigate to="/admin/categories/LoaiThietBi" replace />} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['Admin']}><ManageUsers /></ProtectedRoute>} />
        <Route path="/admin/system" element={<ProtectedRoute allowedRoles={['Admin']}><SystemManagement /></ProtectedRoute>} />
        <Route path="/admin/backup" element={<ProtectedRoute allowedRoles={['Admin']}><BackupRestore /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['Admin']}><WebsiteSettings /></ProtectedRoute>} />
        {/* Phân hệ Quản lý kho — 4 nhánh riêng */}
        <Route path="/admin/warehouse" element={<Navigate to="/admin/warehouse/stock" replace />} />
        <Route path="/admin/warehouse/stock" element={<ProtectedRoute allowedRoles={['Admin', 'Manager', 'Warehouse']}><WarehouseStock /></ProtectedRoute>} />
        <Route path="/admin/warehouse/import" element={<ProtectedRoute allowedRoles={['Admin', 'Manager', 'Warehouse']}><WarehouseImport /></ProtectedRoute>} />
        <Route path="/admin/warehouse/export" element={<ProtectedRoute allowedRoles={['Admin', 'Manager', 'Warehouse']}><WarehouseExport /></ProtectedRoute>} />
        <Route path="/admin/warehouse/transfer" element={<ProtectedRoute allowedRoles={['Admin', 'Manager', 'Warehouse']}><WarehouseTransfer /></ProtectedRoute>} />
        <Route path="/admin/technical" element={<ProtectedRoute allowedRoles={['Admin', 'Manager']}><TechnicalManagement /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['Admin', 'Manager', 'Accounting']}><ReportsManagement /></ProtectedRoute>} />
        <Route path="/admin/quotes" element={<ProtectedRoute allowedRoles={['Admin', 'Manager', 'SaleManager']}><ManageQuotes /></ProtectedRoute>} />
        
        {/* Quy trình kinh doanh mới */}
        <Route path="/admin/sales" element={<ProtectedRoute allowedRoles={['Admin', 'Manager', 'SaleManager', 'Warehouse', 'Accounting']}><SalesDashboard /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<Navigate to="/admin/sales" replace />} />
        <Route path="/admin" element={<Navigate to="/admin/sales" replace />} />
        <Route path="/admin/orders/create/:quoteId" element={<ProtectedRoute allowedRoles={['Admin', 'Manager', 'SaleManager']}><CreateOrder /></ProtectedRoute>} />
        <Route path="/admin/contracts/create/:orderId" element={<ProtectedRoute allowedRoles={['Admin', 'Manager', 'SaleManager', 'User']}><ContractForm /></ProtectedRoute>} />
        <Route path="/admin/delivery/create/:orderId" element={<ProtectedRoute allowedRoles={['Admin', 'Manager', 'Warehouse']}><DeliveryOrderForm /></ProtectedRoute>} />
        <Route path="/admin/invoices/create/:orderId" element={<ProtectedRoute allowedRoles={['Admin', 'Manager', 'Accounting', 'User']}><InvoiceForm /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
);

export default App;
