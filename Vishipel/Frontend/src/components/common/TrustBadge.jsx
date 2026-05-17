import React from 'react';

const TrustBadge = ({ children, subtitle }) => {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.12)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 8,
        padding: '8px 14px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      {/* Phần trên của Tem (Chứa tên tem, icon...) */}
      {children}
      {/* Phần chữ nhỏ bên dưới */}
      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase' }}>
        {subtitle}
      </span>
    </div>
  );
};

export default TrustBadge;
