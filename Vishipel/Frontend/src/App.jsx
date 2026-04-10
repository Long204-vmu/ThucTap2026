
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
        <Route path="/"         element={<Home />} />
        <Route path="/products" element={<Product />} />
        <Route path="/products/:id" element={<ProductDetail />}  />
        <Route path="/services" element={<ServicePage />} />
        <Route path="/about"    element={<About />} />
        <Route path="/contact"  element={<Contact />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*"         element={<Navigate to="/" replace />} />
        <Route 
          path="/admin/products/add" 
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
              <AddProduct />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AppLayout>
);

export default App;
