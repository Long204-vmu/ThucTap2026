import React, { useRef } from 'react';
import { Carousel, Tag, Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const MOCK_BANNERS = [
  {
    key: 'radar', tag: 'Mới nhất', title: 'Hệ Thống Radar JRC',
    desc: 'Thiết bị định vị và phát hiện mục tiêu hàng hải nguyên bản, chính xác tuyệt đối.',
    btnText: 'Khám phá ngay', btnLink: '/products',
    img: 'https://images.unsplash.com/photo-1549497538-303791108f94?q=80&w=1600&h=700&fit=crop',
  },
  {
    key: 'ais', tag: 'Bán chạy', title: 'Thiết bị AIS FA-170',
    desc: 'Giải pháp giám sát và định danh tàu thuyền thời gian thực cho an toàn hàng hải.',
    btnText: 'Tìm hiểu thêm', btnLink: '/products',
    img: 'https://images.pexels.com/photos/1012613/pexels-photo-1012613.jpeg?auto=compress&cs=tinysrgb&w=1600&h=700&fit=crop',
  },
];

const HeroBanner = () => {
  const carouselRef = useRef(null);

  // Không bắt banner chờ Loading nữa, hiện ngay lập tức!
  return (
    <div style={{ position: 'relative' }}>
      <Carousel ref={carouselRef} autoplay autoplaySpeed={5000} dots={{ className: 'hero-dots' }} fade>
        {MOCK_BANNERS.map(item => (
          <div key={item.key}>
            <div
              style={{
                backgroundImage: `linear-gradient(to right, rgba(0,15,40,0.85) 40%, rgba(0,15,40,0.3) 100%), url(${item.img})`,
                backgroundSize: 'cover', backgroundPosition: 'center', height: 520,
                display: 'flex', alignItems: 'center', padding: '0 8%',
              }}
            >
              <div style={{ maxWidth: 560, animation: 'slideUp 0.7s ease' }}>
                <Tag color="blue" style={{ marginBottom: 16, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', fontSize: 11 }}>
                  {item.tag}
                </Tag>
                <h1 style={{ color: '#fff', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, lineHeight: 1.2, margin: '0 0 16px', fontFamily: '"Be Vietnam Pro", sans-serif' }}>
                  {item.title}
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 17, marginBottom: 32, lineHeight: 1.7 }}>{item.desc}</p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <Link to={item.btnLink}>
                    <Button type="primary" size="large" icon={<ArrowRightOutlined />} style={{ height: 48, padding: '0 32px', fontWeight: 600, borderRadius: 10, fontSize: 15 }}>
                      {item.btnText}
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button size="large" ghost style={{ height: 48, padding: '0 28px', borderRadius: 10, fontSize: 15, borderColor: 'rgba(255,255,255,0.5)', color: '#fff' }}>
                      Về chúng tôi
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .hero-dots li button { background: rgba(255,255,255,0.5) !important; }
        .hero-dots li.slick-active button { background: #1677ff !important; width: 24px !important; }
      `}</style>
    </div>
  );
};

export default HeroBanner;
