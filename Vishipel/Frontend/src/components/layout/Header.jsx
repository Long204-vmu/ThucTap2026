import React, { useState, useEffect } from 'react';
import { Layout, Space, Drawer } from 'antd';
import { LoginOutlined, UserAddOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';

// Import các mảnh ghép vừa tạo
import BrandLogo from '../common/Brandlogo';
import AuthButton from '../common/AuthButton';
import { DesktopNavLink, MobileNavLink } from '../common/Navlinks';

const { Header: AntHeader } = Layout;

const navItems = [
  { key: 'home',     to: '/',         label: 'Trang Chủ' },
  { key: 'products', to: '/products', label: 'Sản Phẩm' },
  { key: 'services', to: '/services', label: 'Dịch Vụ' },
  { key: 'about',    to: '/about',    label: 'Giới Thiệu' },
  { key: 'contact',  to: '/contact',  label: 'Liên Hệ' },
];

const HeaderComponent = () => {
  const [scrolled, setScrolled]     = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile]     = useState(window.innerWidth < 768);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => { setDrawerOpen(false); }, [location.pathname]);

  return (
    <>
      <AntHeader
        style={{
          position: 'fixed', top: 0, left: 0, zIndex: 1000, width: '100%', height: '76px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 5%',
          background: 'rgba(255,255,255,1)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(0,0,0,0.07)',
          boxShadow: scrolled ? '0 4px 24px rgba(0,87,255,0.10)' : 'none',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        {/* Mảnh ghép 1: Logo */}
        <BrandLogo />

        {/* Mảnh ghép 3: Desktop Nav */}
        {!isMobile && (
          <nav style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            {navItems.map(({ key, to, label }) => (
              <DesktopNavLink key={key} to={to} isActive={location.pathname === to}>
                {label}
              </DesktopNavLink>
            ))}
          </nav>
        )}

        {/* Mảnh ghép 2: Nút Đăng nhập/Đăng ký */}
        {!isMobile && (
          <Space size={12}>
            <AuthButton to="/login" variant="solid" icon={<LoginOutlined />}>Đăng Nhập</AuthButton>
            <AuthButton to="/register" variant="outline" icon={<UserAddOutlined />}>Đăng Ký</AuthButton>
          </Space>
        )}

        {isMobile && (
          <button onClick={() => setDrawerOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#0057FF' }}>
            <MenuOutlined style={{ fontSize: '24px' }} />
          </button>
        )}
      </AntHeader>

      {/* Drawer Mobile */}
      <Drawer
        open={drawerOpen} onClose={() => setDrawerOpen(false)} placement="right" size="large"
        closeIcon={<CloseOutlined style={{ fontSize: '18px', color: '#0057FF' }} />}
        title={<BrandLogo onClick={() => setDrawerOpen(false)} />}
        styles={{ body: { padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }, header: { borderBottom: '1px solid rgba(0,87,255,0.1)' } }}
      >
        {navItems.map(({ key, to, label }) => (
          <MobileNavLink key={key} to={to} isActive={location.pathname === to} onClick={() => setDrawerOpen(false)}>
            {label}
          </MobileNavLink>
        ))}

        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
           <AuthButton to="/login" variant="solid" isFullWidth onClick={() => setDrawerOpen(false)} icon={<LoginOutlined />}>Đăng Nhập</AuthButton>
           <AuthButton to="/register" variant="outline" isFullWidth onClick={() => setDrawerOpen(false)} icon={<UserAddOutlined />}>Đăng Ký</AuthButton>
        </div>
      </Drawer>
    </>
  );
};

export default HeaderComponent;