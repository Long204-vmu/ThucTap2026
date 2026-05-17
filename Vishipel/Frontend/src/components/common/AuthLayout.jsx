import React, { useState, useEffect } from 'react';

const AuthLayout = ({ children, leftTag, leftTitle, leftDescription, leftExtra }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: '"Be Vietnam Pro", "Segoe UI", sans-serif' }}>
      {/* ── Left Panel: Dùng chung ── */}
      <div 
        className="auth-left-panel"
        style={{
          flex: '0 0 42%',
          background: 'linear-gradient(160deg, #000d1a 0%, #001f3f 50%, #003380 100%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          padding: '48px 52px', position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Vòng tròn trang trí */}
        <div style={{ position: 'absolute', top: -120, right: -120, width: 400, height: 400, borderRadius: '50%', border: '1px solid rgba(0,87,255,0.15)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: -60, right: -60, width: 250, height: 250, borderRadius: '50%', border: '1px solid rgba(0,87,255,0.2)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -100, left: -100, width: 350, height: 350, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        {/* Lưới nền */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,87,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,87,255,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

        {/* Logo */}
        <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(-20px)', transition: 'all 0.6s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #0057FF, #003cc5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 4px 20px rgba(0,87,255,0.4)' }}>
              ⚓
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 18, letterSpacing: 1 }}>VISHIPEL</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, letterSpacing: 3, fontWeight: 500 }}>EMS_NAV SYSTEM</div>
            </div>
          </div>
        </div>

        {/* Nội dung thay đổi (truyền từ Login/Register sang) */}
        <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.7s ease 0.15s', zIndex: 1 }}>
          <div style={{ background: 'rgba(0,87,255,0.2)', border: '1px solid rgba(0,87,255,0.4)', color: '#5599ff', marginBottom: 20, fontWeight: 600, letterSpacing: 1, fontSize: 10, textTransform: 'uppercase', display: 'inline-block', padding: '4px 10px', borderRadius: 4 }}>
            {leftTag}
          </div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(26px, 2.5vw, 38px)', fontWeight: 800, lineHeight: 1.25, margin: '0 0 20px' }}>
            {leftTitle}
          </h1>
          {leftDescription && (
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, lineHeight: 1.8, marginBottom: 36 }}>
              {leftDescription}
            </p>
          )}
          {leftExtra && <div>{leftExtra(mounted)}</div>}
        </div>

        {/* Footer */}
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, opacity: mounted ? 1 : 0, transition: 'opacity 0.8s ease 0.5s', zIndex: 1 }}>
          © 2026 Vishipel Corporation · Bảo lưu mọi quyền
        </div>
      </div>

      {/* ── Right Panel: Nơi chứa Form ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f9fc', padding: '40px 32px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 440, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.7s ease 0.2s' }}>
          {children}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap');
        @media (max-width: 768px) { .auth-left-panel { display: none !important; } }
        .ant-input-affix-wrapper:focus, .ant-input-affix-wrapper-focused { border-color: #0057FF !important; box-shadow: 0 0 0 3px rgba(0,87,255,0.1) !important; }
        .ant-btn-primary:hover { background: linear-gradient(135deg, #1a6dff, #0050e6) !important; box-shadow: 0 8px 24px rgba(0,87,255,0.45) !important; transform: translateY(-1px); }
      `}</style>
    </div>
  );
};

export default AuthLayout;
