import React, { useState } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const ImageSlider = ({ images = [], alt = '' }) => {
  const [current, setCurrent] = useState(0);
  const total = images.length;

  const prev = () => setCurrent(i => (i - 1 + total) % total);
  const next = () => setCurrent(i => (i + 1) % total);

  if (total === 0) return null;
  if (total === 1) {
    return (
      <img
        src={images[0]}
        alt={alt}
        style={{ width: '100%', height: 450, objectFit: 'cover', display: 'block' }}
      />
    );
  }

  return (
    <div style={{ position: 'relative', userSelect: 'none' }}>
      {/* Main image */}
      <img
        key={current}
        src={images[current]}
        alt={`${alt} - ảnh ${current + 1}`}
        style={{
          width: '100%', height: 450, objectFit: 'cover', display: 'block',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Arrow Left */}
      <button
        onClick={prev}
        style={{
          position: 'absolute', top: '50%', left: 16,
          transform: 'translateY(-50%)',
          width: 44, height: 44, borderRadius: '50%',
          background: 'rgba(0,0,0,0.45)', border: 'none',
          cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: '#fff', fontSize: 18,
          transition: 'background 0.2s', zIndex: 2,
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.45)'}
      >
        <LeftOutlined />
      </button>

      {/* Arrow Right */}
      <button
        onClick={next}
        style={{
          position: 'absolute', top: '50%', right: 16,
          transform: 'translateY(-50%)',
          width: 44, height: 44, borderRadius: '50%',
          background: 'rgba(0,0,0,0.45)', border: 'none',
          cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: '#fff', fontSize: 18,
          transition: 'background 0.2s', zIndex: 2,
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.45)'}
      >
        <RightOutlined />
      </button>

      {/* Dot indicators */}
      <div
        style={{
          position: 'absolute', bottom: 16, left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', gap: 8, zIndex: 2,
        }}
      >
        {images.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: i === current ? 24 : 8,
              height: 8, borderRadius: 4,
              background: i === current ? '#1677ff' : 'rgba(255,255,255,0.75)',
              cursor: 'pointer', transition: 'all 0.25s ease',
              boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
            }}
          />
        ))}
      </div>

      {/* Counter badge */}
      <div
        style={{
          position: 'absolute', top: 16, right: 16,
          background: 'rgba(0,0,0,0.6)', color: '#fff',
          fontSize: 13, fontWeight: 600,
          padding: '4px 12px', borderRadius: 20, zIndex: 2,
        }}
      >
        {current + 1} / {total}
      </div>

      {/* Thumbnail strip */}
      <div
        style={{
          display: 'flex', gap: 10, padding: '16px 0 0',
          justifyContent: 'center', overflowX: 'auto',
        }}
      >
        {images.map((src, i) => (
          <div
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: 80, height: 60, borderRadius: 8, overflow: 'hidden',
              cursor: 'pointer', flexShrink: 0,
              border: i === current ? '2px solid #1677ff' : '2px solid transparent',
              transition: 'border-color 0.2s',
              boxShadow: i === current ? '0 0 0 2px #e6f4ff' : '0 1px 4px rgba(0,0,0,0.12)',
            }}
          >
            <img
              src={src}
              alt={`thumb-${i + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;