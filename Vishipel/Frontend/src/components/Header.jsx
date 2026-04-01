import React, { useState, useEffect } from 'react';
import { Layout, Badge, Space } from 'antd';
import { ShoppingCartOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const { Header: AntHeader } = Layout;

const styles = {
  header: (scrolled) => ({
    position: 'fixed',
    zIndex: 1000,
    width: '100%',
    height: '68px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 5%',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(0,0,0,0.07)',
    boxShadow: scrolled ? '0 4px 24px rgba(0,87,255,0.10)' : 'none',
    transition: 'box-shadow 0.3s ease, background 0.3s ease',
  }),

  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    flexShrink: 0,
  },

  logoBadge: {
    background: '#0057FF',
    padding: '5px 12px',
    borderRadius: '6px',
    color: '#fff',
    fontWeight: '700',
    fontSize: '13px',
    letterSpacing: '0.5px',
    transition: 'transform 0.2s ease',
  },

  logoName: {
    color: '#0057FF',
    fontWeight: '700',
    fontSize: '17px',
    letterSpacing: '-0.3px',
  },

  navWrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
  },

  navLink: (isActive) => ({
    position: 'relative',
    padding: '8px 16px',
    fontSize: '14.5px',
    fontWeight: isActive ? '600' : '500',
    color: isActive ? '#0057FF' : '#5A6478',
    textDecoration: 'none',
    borderRadius: '8px',
    transition: 'color 0.2s ease, background 0.2s ease',
    display: 'inline-block',
  }),

  cartBtn: (hovered) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '10px',
    border: `1px solid ${hovered ? '#0057FF' : 'rgba(0,0,0,0.1)'}`,
    background: hovered ? 'rgba(0,87,255,0.05)' : 'transparent',
    color: hovered ? '#0057FF' : '#0A0F1E',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
  }),

  loginBtn: (hovered) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 20px',
    borderRadius: '10px',
    border: 'none',
    background: hovered ? '#003FBF' : '#0057FF',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    transform: hovered ? 'translateY(-1px)' : 'none',
    boxShadow: hovered ? '0 4px 16px rgba(0,87,255,0.3)' : 'none',
  }),

  registerBtn: (hovered) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 20px',
    borderRadius: '10px',
    border: '1.5px solid #0057FF',
    background: hovered ? '#0057FF' : 'transparent',
    color: hovered ? '#fff' : '#0057FF',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    transform: hovered ? 'translateY(-1px)' : 'none',
    boxShadow: hovered ? '0 4px 16px rgba(0,87,255,0.2)' : 'none',
  }),
};

/* Animated underline for nav items */
const NavLink = ({ to, children, isActive }) => {
  const [hovered, setHovered] = useState(false);
  const showLine = isActive || hovered;

  return (
    <Link
      to={to}
      style={styles.navLink(isActive)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      <span
        style={{
          position: 'absolute',
          bottom: '4px',
          left: showLine ? '16px' : '50%',
          right: showLine ? '16px' : '50%',
          height: '2px',
          borderRadius: '2px',
          background: '#0057FF',
          transition: 'left 0.25s ease, right 0.25s ease',
        }}
      />
    </Link>
  );
};

const HeaderComponent = ({ cartCount = 0 }) => {
  const [scrolled, setScrolled] = useState(false);
  const [cartHovered, setCartHovered] = useState(false);
  const [loginHovered, setLoginHovered] = useState(false);
  const [registerHovered, setRegisterHovered] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { key: 'home',     to: '/',        label: 'Trang Chủ' },
    { key: 'products', to: '/products', label: 'Sản Phẩm' },
    { key: 'about',    to: '/about',    label: 'Giới Thiệu' },
    { key: 'contact',  to: '/contact',  label: 'Liên Hệ' },
  ];

  return (
    <AntHeader style={styles.header(scrolled)}>

      {/* ── Logo ── */}
      <Link to="/" style={styles.logo}>
        <div style={styles.logoBadge}>VISHIPEL</div>
        <span style={styles.logoName}>
          EMS_NAV
          <span
            style={{
              display: 'inline-block',
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: '#00C2FF',
              marginLeft: '3px',
              verticalAlign: 'middle',
              animation: 'pulse-dot 2s ease-in-out infinite',
            }}
          />
        </span>
      </Link>

      {/* ── Navigation ── */}
      <nav style={styles.navWrapper}>
        {navItems.map(({ key, to, label }) => (
          <NavLink key={key} to={to} isActive={location.pathname === to}>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* ── Actions ── */}
      <Space size={8}>

        {/* Cart */}
        <button
          style={styles.cartBtn(cartHovered)}
          onMouseEnter={() => setCartHovered(true)}
          onMouseLeave={() => setCartHovered(false)}
        >
          <ShoppingCartOutlined
            style={{
              fontSize: '16px',
              transform: cartHovered ? 'rotate(-12deg) scale(1.15)' : 'none',
              transition: 'transform 0.25s ease',
            }}
          />
          Giỏ hàng
          <Badge
            count={cartCount}
            showZero
            style={{
              background: '#0057FF',
              fontSize: '9px',
              height: '16px',
              minWidth: '16px',
              lineHeight: '16px',
              padding: '0 4px',
            }}
          />
        </button>

        {/* Login */}
        <button
          style={styles.loginBtn(loginHovered)}
          onMouseEnter={() => setLoginHovered(true)}
          onMouseLeave={() => setLoginHovered(false)}
        >
          <LoginOutlined style={{ fontSize: '14px' }} />
          Đăng Nhập
        </button>

        {/* Register */}
        <button
          style={styles.registerBtn(registerHovered)}
          onMouseEnter={() => setRegisterHovered(true)}
          onMouseLeave={() => setRegisterHovered(false)}
        >
          <UserAddOutlined style={{ fontSize: '14px' }} />
          Đăng Ký
        </button>

      </Space>

      {/* Keyframe cho logo dot — inject 1 lần */}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.65); }
        }
      `}</style>
    </AntHeader>
  );
};

export default HeaderComponent;
