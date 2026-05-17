import React from 'react';
import { Link } from 'react-router-dom';
import { BACKEND_ORIGIN } from '../../config/api';

const BrandLogo = ({ onClick }) => {
  return (
    <Link
      to="/"
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px', 
        textDecoration: 'none', flexShrink: 0,
      }}
    >
      <img
        src={`${BACKEND_ORIGIN}/image/logo.jpg`}
        alt="Vishipel EMS Logo"
        style={{ height: '46px', width: 'auto', objectFit: 'contain', display: 'block' }}
      />
      
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15, borderLeft: '2px solid rgba(0,87,255,0.2)', paddingLeft: '10px' }}>
        <span style={{ fontSize: '11px', fontWeight: '700', color: '#0057FF', letterSpacing: '2px', textTransform: 'uppercase' }}>
          EMS
        </span>
        <span style={{ fontSize: '9.5px', color: '#8a94a6', fontWeight: '500', letterSpacing: '0.4px', whiteSpace: 'nowrap' }}>
          Quản Lý Thiết Bị
        </span>
      </div>
    </Link>
  );
};

export default BrandLogo;
