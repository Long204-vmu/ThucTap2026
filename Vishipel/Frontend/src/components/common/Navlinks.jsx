import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const DesktopNavLink = ({ to, children, isActive }) => {
  const [hovered, setHovered] = useState(false);
  const showLine = isActive || hovered;

  return (
    <Link
      to={to}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', padding: '10px 24px', fontSize: '16px',
        fontWeight: isActive ? '700' : '500',
        color: isActive ? '#0057FF' : '#5A6478',
        textDecoration: 'none', borderRadius: '9px',
        transition: 'color 0.2s ease, background 0.2s ease',
        display: 'inline-block', whiteSpace: 'nowrap',
      }}
    >
      {children}
      <span style={{
        position: 'absolute', bottom: '5px', left: showLine ? '24px' : '50%', right: showLine ? '24px' : '50%',
        height: '2.5px', borderRadius: '2px', background: '#0057FF',
        transition: 'left 0.25s ease, right 0.25s ease',
      }} />
    </Link>
  );
};

export const MobileNavLink = ({ to, children, isActive, onClick }) => (
  <Link
    to={to} onClick={onClick}
    style={{
      display: 'block', padding: '16px 20px', fontSize: '17px',
      fontWeight: isActive ? '700' : '500',
      color: isActive ? '#0057FF' : '#3a4560',
      textDecoration: 'none', borderRadius: '10px',
      background: isActive ? 'rgba(0,87,255,0.07)' : 'transparent',
      borderLeft: isActive ? '3px solid #0057FF' : '3px solid transparent',
      transition: 'all 0.2s ease',
    }}
  >
    {children}
  </Link>
);