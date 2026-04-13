import React, { useState, useEffect } from 'react';
import { Layout, Space, Drawer, Dropdown, Avatar, Button, Divider } from 'antd';
import { 
  LoginOutlined, 
  UserAddOutlined, 
  MenuOutlined, 
  CloseOutlined,
  UserOutlined, 
  LogoutOutlined, 
  PlusCircleOutlined, 
  AppstoreOutlined,
  ToolOutlined
} from '@ant-design/icons';
import { useLocation, Link, useNavigate } from 'react-router-dom';

import BrandLogo from '../common/Brandlogo';
import AuthButton from '../common/AuthButton';
import { DesktopNavLink, MobileNavLink } from '../common/Navlinks';

const { Header: AntHeader } = Layout;

const navItems = [
  { key: 'home',     to: '/',         label: 'Trang Chủ' },
  { key: 'products', to: '/products', label: 'Thiết Bị' },
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

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

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

  // Cấu hình Menu Avatar cho Admin
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
    ...(user?.role === 'Admin' || user?.role === 'Manager' 
      ? [
           {
            key: 'admin-manage-categories',
            icon: <AppstoreOutlined style={{ color: '#eb2f96' }} />, // Tùy chọn icon
            label: <Link to="/admin/categories" style={{ fontWeight: 500 }}>Quản lý Danh mục</Link>,
          },
          {
            key: 'admin-manage-products',
            icon: <AppstoreOutlined style={{ color: '#0057FF' }} />,
            label: <Link to="/admin/products" style={{ fontWeight: 500 }}>Quản lý Thiết bị</Link>,
          },
          {
            key: 'admin-add-product',
            icon: <PlusCircleOutlined style={{ color: '#52c41a' }} />,
            label: <Link to="/admin/products/add" style={{ fontWeight: 500 }}>Thêm Thiết bị</Link>,
          },
          { type: 'divider' }, // Vạch ngăn cách cho gọn mắt
          {
            key: 'admin-manage-services',
            icon: <ToolOutlined style={{ color: '#fa8c16' }} />,
            label: <Link to="/admin/services" style={{ fontWeight: 500 }}>Quản lý Dịch vụ</Link>,
          },
          {
            key: 'admin-add-service',
            icon: <PlusCircleOutlined style={{ color: '#52c41a' }} />,
            label: <Link to="/admin/services/add" style={{ fontWeight: 500 }}>Thêm Dịch vụ</Link>,
          }
        ] 
      : []),
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
        <BrandLogo />

        {!isMobile && (
          <nav style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            {navItems.map(({ key, to, label }) => (
              <DesktopNavLink key={key} to={to} isActive={location.pathname === to}>{label}</DesktopNavLink>
            ))}
          </nav>
        )}

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

        {isMobile && (
          <button onClick={() => setDrawerOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#0057FF' }}>
            <MenuOutlined style={{ fontSize: '24px' }} />
          </button>
        )}
      </AntHeader>

      <Drawer
        open={drawerOpen} onClose={() => setDrawerOpen(false)} placement="right" size="large"
        closeIcon={<CloseOutlined style={{ fontSize: '18px', color: '#0057FF' }} />}
        title={<BrandLogo onClick={() => setDrawerOpen(false)} />}
        styles={{ body: { padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }, header: { borderBottom: '1px solid rgba(0,87,255,0.1)' } }}
      >
        {navItems.map(({ key, to, label }) => (
          <MobileNavLink key={key} to={to} isActive={location.pathname === to} onClick={() => setDrawerOpen(false)}>{label}</MobileNavLink>
        ))}

        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {user ? (
            <>
              <div style={{ padding: '12px', background: '#f5f7fa', borderRadius: '8px', marginBottom: '8px', border: '1px solid #e8ecf0' }}>
                <div style={{ color: '#8c8c8c', fontSize: 12 }}>Đang đăng nhập dưới tên:</div>
                <div style={{ color: '#001529', fontWeight: 700, fontSize: 16 }}>{user.fullName || user.username}</div>
              </div>
              
              {/* Menu cho Mobile khi là Admin */}
              {(user.role === 'Admin' || user.role === 'Manager') && (
                 <>
                   <div style={{ fontSize: 12, fontWeight: 700, color: '#8c8c8c', marginTop: 8, textTransform: 'uppercase' }}>Phần Cứng</div>
                   <AuthButton to="/admin/products" variant="outline" onClick={() => setDrawerOpen(false)} isFullWidth icon={<AppstoreOutlined/>}>Quản lý Thiết bị</AuthButton>
                   <AuthButton to="/admin/products/add" variant="outline" onClick={() => setDrawerOpen(false)} isFullWidth icon={<PlusCircleOutlined/>}>Thêm Thiết Bị</AuthButton>
                   
                   <div style={{ fontSize: 12, fontWeight: 700, color: '#8c8c8c', marginTop: 8, textTransform: 'uppercase' }}>Dịch Vụ</div>
                   <AuthButton to="/admin/services" variant="outline" onClick={() => setDrawerOpen(false)} isFullWidth icon={<ToolOutlined/>}>Quản lý Dịch vụ</AuthButton>
                   <AuthButton to="/admin/services/add" variant="outline" onClick={() => setDrawerOpen(false)} isFullWidth icon={<PlusCircleOutlined/>}>Thêm Dịch Vụ</AuthButton>
                 </>
              )}
              <Button danger type="text" icon={<LogoutOutlined />} onClick={handleLogout} style={{ marginTop: 8, fontWeight: 600, height: 40 }}>Đăng xuất</Button>
            </>
          ) : (
            <>
              <AuthButton to="/login" variant="solid" isFullWidth onClick={() => setDrawerOpen(false)} icon={<LoginOutlined />}>Đăng Nhập</AuthButton>
              <AuthButton to="/register" variant="outline" isFullWidth onClick={() => setDrawerOpen(false)} icon={<UserAddOutlined />}>Đăng Ký</AuthButton>
            </>
          )}
        </div>
      </Drawer>

      <style>{`.user-hover:hover { background: #f0f2f5; }`}</style>
    </>
  );
};

export default HeaderComponent;