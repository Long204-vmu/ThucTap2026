import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AuthButton = ({ to, icon, children, variant = 'solid', isFullWidth = false, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const isSolid = variant === 'solid';

  return (
    <Link to={to} style={{ textDecoration: 'none', width: isFullWidth ? '100%' : 'auto' }} onClick={onClick}>
      <button
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          padding: isFullWidth ? '13px' : '10px 28px',
          width: isFullWidth ? '100%' : 'auto',
          borderRadius: '11px', 
          border: isSolid ? 'none' : '2px solid #0057FF',
          background: isSolid 
            ? (hovered ? '#003FBF' : '#0057FF') 
            : (hovered ? '#0057FF' : 'transparent'),
          color: isSolid ? '#fff' : (hovered ? '#fff' : '#0057FF'),
          fontSize: isFullWidth ? '16px' : '15.5px', 
          fontWeight: '600', cursor: 'pointer', 
          transition: 'all 0.2s ease',
          transform: hovered && !isFullWidth ? 'translateY(-1px)' : 'none',
          boxShadow: hovered && !isFullWidth ? `0 4px 18px rgba(0,87,255,${isSolid ? '0.35' : '0.25'})` : 'none',
          whiteSpace: 'nowrap',
        }}
      >
        {icon} {children}
      </button>
    </Link>
  );
};

export default AuthButton;