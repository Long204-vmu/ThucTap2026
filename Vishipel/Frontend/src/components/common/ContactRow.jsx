import React from 'react';

const ContactRow = ({ icon, label, value, extra, isLink }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, marginTop: 1, flexShrink: 0 }}>
        {icon}
      </span>
      <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
        <strong style={{ color: '#fff', marginRight: 4 }}>{label}</strong>
        {isLink ? (
          <a href={`mailto:${value}`} style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'underline' }}>
            {value}
          </a>
        ) : (
          value
        )}
        {extra && <span style={{ color: 'rgba(255,255,255,0.5)', marginLeft: 4 }}>{extra}</span>}
      </p>
    </div>
  );
};

export default ContactRow;
