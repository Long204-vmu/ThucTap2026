import React, { useState, useEffect } from 'react';
import { Layout, Space, Drawer, Dropdown, Avatar, Button } from 'antd';
import { 
  LoginOutlined, 
  UserAddOutlined, 
  MenuOutlined, 
  CloseOutlined,
  UserOutlined, 
  LogoutOutlined, 
  PlusCircleOutlined, 
  AppstoreOutlined 
} from '@ant-design/icons';
import { useLocation, Link, useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled]     = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile]     = useState(window.innerWidth < 768);

  // 1. Lấy thông tin User từ "Két sắt" LocalStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  // 2. Hàm Xử lý Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload(); 
  };

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

  // 3. Xây dựng Menu thả xuống cho Desktop
  const userMenuItems = [
    {
      key: 'greeting',
      label: (
        <div style={{ padding: '4px 0', color: '#8c8c8c' }}>
          Đăng nhập với tư cách <br/>
          <strong style={{ color: '#001529', fontSize: 14 }}>{user?.fullName || user?.username}</strong>
        </div>
      ),
      disabled: true, 
    },
    { type: 'divider' },
    // Phân quyền hiển thị Menu
    ...(user?.role === 'Admin' || user?.role === 'Manager' 
      ? [
          {
            key: 'admin-add',
            icon: <PlusCircleOutlined style={{ color: '#0057FF' }} />,
            label: <Link to="/admin/products/add" style={{ fontWeight: 500 }}>Thêm Sản phẩm / Dịch vụ</Link>,
          }
        ] 
      : [
          {
            key: 'user-dashboard',
            icon: <AppstoreOutlined style={{ color: '#52c41a' }} />,
            label: <Link to="/dashboard" style={{ fontWeight: 500 }}>Quản lý cá nhân</Link>,
          }
        ]),
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: handleLogout,
      danger: true, 
    },
  ];

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

        {/* Mảnh ghép 2: Desktop Nav */}
        {!isMobile && (
          <nav style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            {navItems.map(({ key, to, label }) => (
              <DesktopNavLink key={key} to={to} isActive={location.pathname === to}>
                {label}
              </DesktopNavLink>
            ))}
          </nav>
        )}

        {/* Mảnh ghép 3: Auth / User Menu (Desktop) */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {user ? (
               <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                 <Space style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 20, transition: 'background 0.3s' }} className="user-hover">
                   <Avatar style={{ backgroundColor: '#0057FF' }} icon={<UserOutlined />} />
                   <span style={{ fontWeight: 600, color: '#001529' }}>{user.username}</span>
                 </Space>
               </Dropdown>
            ) : (
              <Space size={12}>
                <AuthButton to="/login" variant="solid" icon={<LoginOutlined />}>Đăng Nhập</AuthButton>
                <AuthButton to="/register" variant="outline" icon={<UserAddOutlined />}>Đăng Ký</AuthButton>
              </Space>
            )}
          </div>
        )}

        {/* Nút bật Menu Mobile */}
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
        {/* Navigation Mobile */}
        {navItems.map(({ key, to, label }) => (
          <MobileNavLink key={key} to={to} isActive={location.pathname === to} onClick={() => setDrawerOpen(false)}>
            {label}
          </MobileNavLink>
        ))}

        {/* Auth / User Menu Mobile */}
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {user ? (
            <>
              <div style={{ padding: '12px', background: '#f5f7fa', borderRadius: '8px', marginBottom: '8px', border: '1px solid #e8ecf0' }}>
                <div style={{ color: '#8c8c8c', fontSize: 12 }}>Đang đăng nhập dưới tên:</div>
                <div style={{ color: '#001529', fontWeight: 700, fontSize: 16 }}>{user.fullName || user.username}</div>
              </div>

              {/* Phân quyền Mobile */}
              {user.role === 'Admin' || user.role === 'Manager' ? (
                 <AuthButton to="/admin/products/add" variant="outline" onClick={() => setDrawerOpen(false)} isFullWidth icon={<PlusCircleOutlined/>}>Thêm Sản Phẩm</AuthButton>
              ) : (
                 <AuthButton to="/dashboard" variant="outline" onClick={() => setDrawerOpen(false)} isFullWidth icon={<AppstoreOutlined/>}>Quản lý cá nhân</AuthButton>
              )}

              <Button danger type="text" icon={<LogoutOutlined />} onClick={handleLogout} style={{ marginTop: 8, fontWeight: 600, height: 40 }}>
                Đăng xuất
              </Button>
            </>
          ) : (
            <>
              <AuthButton to="/login" variant="solid" isFullWidth onClick={() => setDrawerOpen(false)} icon={<LoginOutlined />}>Đăng Nhập</AuthButton>
              <AuthButton to="/register" variant="outline" isFullWidth onClick={() => setDrawerOpen(false)} icon={<UserAddOutlined />}>Đăng Ký</AuthButton>
            </>
          )}
        </div>
      </Drawer>

      {/* Style phụ trợ cho hover */}
      <style>{`
        .user-hover:hover { background: #f0f2f5; }
      `}</style>
    </>
  );
};

export default HeaderComponent;