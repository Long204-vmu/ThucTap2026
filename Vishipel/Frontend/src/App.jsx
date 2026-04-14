import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from 'antd';

// ── Components dùng chung ──────────────────────────────────────────────────────
import HeaderComponent from './components/layout/Header';
import FooterComponent from './components/layout/Footer';

// ── Pages ─────────────────────────────────────────────────────────────────────
import Home     from './pages/Home';
import Product  from './pages/Product';
import ProductDetail from './pages/ProductDetail';
import ServicePage from './pages/Service';
import About    from './pages/About';
import Contact  from './pages/Contact';
import Login    from './pages/Login';
import Register from './pages/Register';
import AddProduct from './pages/admin/AddProduct'; 
import ProtectedRoute from './components/common/ProtectedRoute';
import ManageProducts from './pages/admin/ManageProducts';
import ServiceDetail from './pages/ServiceDetail';
import ManageServices from './pages/admin/ManageServices';
import AddService from './pages/admin/AddService';
import ManageCategories from './pages/admin/ManageCategories';
import ManageUsers from './pages/admin/ManageUsers';
import ManageRequests from './pages/admin/ManageRequests';
const { Content } = Layout;

// ─── Trang toàn màn hình (không có Header/Footer) ─────────────────────────────
const FULLSCREEN_ROUTES = ['/login', '/register'];

const AppLayout = ({ children }) => {
  const location = useLocation();
  const isFullscreen = FULLSCREEN_ROUTES.includes(location.pathname);

  if (isFullscreen) {
    return <>{children}</>;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <HeaderComponent />
      <Content>
        {children}
      </Content>
      <FooterComponent />
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
        <Route path="/services" element={<ServicePage />} />
        <Route path="/about"    element={<About />} />
        <Route path="/contact"  element={<Contact />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*"         element={<Navigate to="/" replace />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        
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
        <Route path="/admin/services" element={<ProtectedRoute allowedRoles={['Admin', 'Manager']}><ManageServices /></ProtectedRoute>} />
        <Route path="/admin/services/add" element={<ProtectedRoute allowedRoles={['Admin', 'Manager']}><AddService /></ProtectedRoute>} />
        <Route path="/admin/services/edit/:id" element={<ProtectedRoute allowedRoles={['Admin', 'Manager']}><AddService /></ProtectedRoute>} />
        <Route path="/admin/categories" element={<ProtectedRoute allowedRoles={['Admin', 'Manager']}><ManageCategories /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['Admin']}><ManageUsers /></ProtectedRoute>} />
        <Route path="/admin/requests" element={<ProtectedRoute allowedRoles={['Sales', 'Admin']}><ManageRequests /></ProtectedRoute>} />
      </Routes>
    </AppLayout>
);

export default App;