import React, { useState, useEffect } from 'react';
import { Layout, Space, Drawer } from 'antd';
import { LoginOutlined, UserAddOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const { Header: AntHeader } = Layout;

const navItems = [
  { key: 'home',     to: '/',         label: 'Trang Chủ' },
  { key: 'products', to: '/products', label: 'Sản Phẩm' },
  { key: 'about',    to: '/about',    label: 'Giới Thiệu' },
  { key: 'contact',  to: '/contact',  label: 'Liên Hệ' },
];

/* ── Desktop NavLink ── */
const NavLink = ({ to, children, isActive }) => {
  const [hovered, setHovered] = useState(false);
  const showLine = isActive || hovered;

  return (
    <Link
      to={to}
      style={{
        position: 'relative',
        padding: '10px 24px',
        fontSize: '16px',
        fontWeight: isActive ? '700' : '500',
        color: isActive ? '#0057FF' : '#5A6478',
        textDecoration: 'none',
        borderRadius: '9px',
        transition: 'color 0.2s ease, background 0.2s ease',
        display: 'inline-block',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      <span
        style={{
          position: 'absolute',
          bottom: '5px',
          left: showLine ? '24px' : '50%',
          right: showLine ? '24px' : '50%',
          height: '2.5px',
          borderRadius: '2px',
          background: '#0057FF',
          transition: 'left 0.25s ease, right 0.25s ease',
        }}
      />
    </Link>
  );
};

/* ── Mobile NavLink ── */
const MobileNavLink = ({ to, children, isActive, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    style={{
      display: 'block',
      padding: '16px 20px',
      fontSize: '17px',
      fontWeight: isActive ? '700' : '500',
      color: isActive ? '#0057FF' : '#3a4560',
      textDecoration: 'none',
      borderRadius: '10px',
      background: isActive ? 'rgba(0,87,255,0.07)' : 'transparent',
      borderLeft: isActive ? '3px solid #0057FF' : '3px solid transparent',
      transition: 'all 0.2s ease',
    }}
  >
    {children}
  </Link>
);

const HeaderComponent = () => {
  const [scrolled, setScrolled]         = useState(false);
  const [loginHovered, setLoginHovered] = useState(false);
  const [regHovered, setRegHovered]     = useState(false);
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [isMobile, setIsMobile]         = useState(window.innerWidth < 768);
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

  /* Đóng drawer khi chuyển route */
  useEffect(() => { setDrawerOpen(false); }, [location.pathname]);

  return (
    <>
      <AntHeader
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1000,
          width: '100%',
          height: '76px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 5%',
          background: 'rgba(255,255,255,1)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(0,0,0,0.07)',
          boxShadow: scrolled ? '0 4px 24px rgba(0,87,255,0.10)' : 'none',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        {/* ── Logo ── */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          {/* Logo image từ thư mục public */}
          <img
            src="/image/logo.jpg"
            alt="Vishipel EMS Logo"
            style={{
              height: '46px',
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
            }}
          />
          {/* Badge EMS bên cạnh logo */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              lineHeight: 1.15,
              borderLeft: '2px solid rgba(0,87,255,0.2)',
              paddingLeft: '10px',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#0057FF',
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              EMS
            </span>
            <span
              style={{
                fontSize: '9.5px',
                color: '#8a94a6',
                fontWeight: '500',
                letterSpacing: '0.4px',
                whiteSpace: 'nowrap',
              }}
            >
              Quản Lý Thiết Bị
            </span>
          </div>
        </Link>

        {/* ── Desktop Nav ── */}
        {!isMobile && (
          <nav style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
          }}>
            {navItems.map(({ key, to, label }) => (
              <NavLink key={key} to={to} isActive={location.pathname === to}>
                {label}
              </NavLink>
            ))}
          </nav>
        )}

        {/* ── Desktop Buttons ── */}
        {!isMobile && (
          <Space size={12}>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <button
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 28px',
                  borderRadius: '11px', border: 'none',
                  background: loginHovered ? '#003FBF' : '#0057FF',
                  color: '#fff', fontSize: '15.5px', fontWeight: '600',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                  transform: loginHovered ? 'translateY(-1px)' : 'none',
                  boxShadow: loginHovered ? '0 4px 18px rgba(0,87,255,0.35)' : 'none',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={() => setLoginHovered(true)}
                onMouseLeave={() => setLoginHovered(false)}
              >
                <LoginOutlined style={{ fontSize: '16px' }} />
                Đăng Nhập
              </button>
            </Link>

            <Link to="/register" style={{ textDecoration: 'none' }}>
              <button
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 28px',
                  borderRadius: '11px', border: '2px solid #0057FF',
                  background: regHovered ? '#0057FF' : 'transparent',
                  color: regHovered ? '#fff' : '#0057FF',
                  fontSize: '15.5px', fontWeight: '600',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                  transform: regHovered ? 'translateY(-1px)' : 'none',
                  boxShadow: regHovered ? '0 4px 18px rgba(0,87,255,0.25)' : 'none',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={() => setRegHovered(true)}
                onMouseLeave={() => setRegHovered(false)}
              >
                <UserAddOutlined style={{ fontSize: '16px' }} />
                Đăng Ký
              </button>
            </Link>
          </Space>
        )}

        {/* ── Mobile Hamburger ── */}
        {isMobile && (
          <button
            onClick={() => setDrawerOpen(true)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '8px', borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#0057FF',
            }}
          >
            <MenuOutlined style={{ fontSize: '24px' }} />
          </button>
        )}
      </AntHeader>

      {/* ── Mobile Drawer ── */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        placement="right"
        size="large"
        closeIcon={<CloseOutlined style={{ fontSize: '18px', color: '#0057FF' }} />}
        title={
          <Link
            to="/"
            style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
          >
            <img
              src="/logo.png"
              alt="Vishipel EMS Logo"
              style={{ height: '34px', width: 'auto', objectFit: 'contain' }}
            />
            <span
              style={{
                color: '#0057FF',
                fontWeight: '700',
                fontSize: '13px',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
              }}
            >
              EMS
            </span>
          </Link>
        }
        styles={{
          body: { padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' },
          header: { borderBottom: '1px solid rgba(0,87,255,0.1)', padding: '16px 20px' },
        }}
      >
        {/* Mobile nav links */}
        {navItems.map(({ key, to, label }) => (
          <MobileNavLink
            key={key}
            to={to}
            isActive={location.pathname === to}
            onClick={() => setDrawerOpen(false)}
          >
            {label}
          </MobileNavLink>
        ))}

        {/* Mobile action buttons */}
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link to="/login" style={{ textDecoration: 'none' }} onClick={() => setDrawerOpen(false)}>
            <button style={{
              width: '100%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px',
              padding: '13px', borderRadius: '11px', border: 'none',
              background: '#0057FF', color: '#fff',
              fontSize: '16px', fontWeight: '600', cursor: 'pointer',
            }}>
              <LoginOutlined /> Đăng Nhập
            </button>
          </Link>

          <Link to="/register" style={{ textDecoration: 'none' }} onClick={() => setDrawerOpen(false)}>
            <button style={{
              width: '100%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px',
              padding: '13px', borderRadius: '11px',
              border: '2px solid #0057FF', background: 'transparent',
              color: '#0057FF', fontSize: '16px', fontWeight: '600', cursor: 'pointer',
            }}>
              <UserAddOutlined /> Đăng Ký
            </button>
          </Link>
        </div>
      </Drawer>
    </>
  );
};

export default HeaderComponent;
