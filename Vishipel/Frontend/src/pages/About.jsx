
import React, { useState, useEffect, useRef } from 'react';
import { Layout, Row, Col, Card, Divider, Tag } from 'antd';
import {
  RocketOutlined, SafetyCertificateOutlined,
  TeamOutlined, GlobalOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

const { Content } = Layout;

// ─── DATA GIỚI THIỆU VISHIPEL ───────────────────────────────────────────────
const MOCK_STATS = [
  { label: 'Năm hình thành & phát triển', value: 40, suffix: '+' },
  { label: 'Đài TTDH toàn quốc', value: 33, suffix: '' },
  { label: 'Lĩnh vực giải pháp', value: 4, suffix: '' },
  { label: 'Trực canh cấp cứu', value: 24, suffix: '/7' },
];

const CORE_VALUES = [
  {
    icon: <SafetyCertificateOutlined />,
    title: 'Tin Cậy',
    desc: 'Hoạt động bền bỉ, tiếp nhận và xử lý thông tin cấp cứu, khẩn cấp chính xác, kịp thời tuyệt đối.',
    color: '#0057FF',
    bg: '#e6f0ff',
  },
  {
    icon: <RocketOutlined />,
    title: 'Tốc Độ',
    desc: 'Kết nối nhanh chóng, lan tỏa mạnh, đảm bảo liên lạc thông suốt trên đất liền, trên biển và không gian.',
    color: '#00b96b',
    bg: '#e6fff5',
  },
  {
    icon: <TeamOutlined />,
    title: 'Hợp Tác',
    desc: 'Đồng hành cùng ngư dân bám biển, phối hợp chặt chẽ trong công tác PCTT & TKCN.',
    color: '#f59e0b',
    bg: '#fff8e6',
  },
  {
    icon: <GlobalOutlined />,
    title: 'Tiêu Chuẩn',
    desc: 'Đáp ứng khắt khe các tiêu chuẩn quốc gia và quốc tế về hệ thống thông tin viễn thông hàng hải.',
    color: '#7c3aed',
    bg: '#f3f0ff',
  },
];

const SOLUTIONS = [
  'Giải pháp ngành Hàng hải – Dầu khí',
  'Giải pháp ngành Hàng không',
  'Giải pháp An ninh Quốc phòng',
  'Giải pháp ngành Thủy sản',
];
// ──────────────────────────────────────────────────────────────────────────────

// ─── Animated Counter ─────────────────────────────────────────────────────────
function useCountUp(target, decimal = 0, duration = 1800) {
  const [count, setCount] = useState(0);
  const startedRef = useRef(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          const start = performance.now();
          const animate = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setCount(parseFloat((eased * target).toFixed(decimal)));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, decimal, duration]);

  return [count, ref];
}

const AnimatedStat = ({ label, value, suffix, decimal = 0 }) => {
  const [count, ref] = useCountUp(value, decimal);
  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#0057FF', lineHeight: 1 }}>
        {decimal ? count.toFixed(decimal) : Math.floor(count)}{suffix}
      </div>
      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 6 }}>{label}</div>
    </div>
  );
};
// ──────────────────────────────────────────────────────────────────────────────

const About = () => {
  return (
    <Content style={{ background: '#fff', minHeight: '100vh' }}>

      {/* ── 1. Hero Banner ─────────────────────────────────────── */}
      <div
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0,10,30,0.92) 50%, rgba(0,10,30,0.5) 100%), url("https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1600&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '96px 8%',
        }}
      >
        <Tag
          color="blue"
          style={{ marginBottom: 16, fontWeight: 600, letterSpacing: '1px', fontSize: 11, textTransform: 'uppercase' }}
        >
          Về VISHIPEL
        </Tag>
        <h1
          style={{
            color: '#fff',
            fontSize: 'clamp(26px, 4vw, 48px)',
            fontWeight: 800,
            lineHeight: 1.3,
            margin: '0 0 16px',
            maxWidth: 700,
          }}
        >
          Công ty TNHH MTV Thông tin Điện tử Hàng hải Việt Nam
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 17, maxWidth: 650, lineHeight: 1.8 }}>
          <strong style={{ color: '#fff' }}>"Kết nối nhanh, lan tỏa mạnh."</strong><br/>
          VISHIPEL là doanh nghiệp cung cấp dịch vụ viễn thông hàng hải hàng đầu Việt Nam. Được Nhà nước giao quản lý và khai thác Hệ thống Thông tin duyên hải (TTDH) Việt Nam gồm 33 Đài nằm trải dọc chiều dài đất nước.
        </p>
      </div>

      {/* ── 2. Stats Bar ─────────────────────────────────────────── */}
      <div style={{ background: '#001529', padding: '40px 8%' }}>
        <Row gutter={[32, 32]} justify="center">
          {MOCK_STATS.map((s, i) => (
            <Col xs={12} sm={6} key={i}>
              <AnimatedStat {...s} />
            </Col>
          ))}
        </Row>
      </div>

      <div style={{ padding: '72px 8%', maxWidth: 1300, margin: '0 auto' }}>

        {/* ── 3. Mission & Vision + Image ───────────────────────────────── */}
        <Row gutter={[56, 40]} align="middle">
          <Col xs={24} md={12}>
            <Tag color="blue" style={{ marginBottom: 12, fontWeight: 600, letterSpacing: 1, fontSize: 11 }}>
              TẦM NHÌN & SỨ MỆNH
            </Tag>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: '#001529', lineHeight: 1.3, margin: '0 0 16px' }}>
              Cầu nối thông tin cho người đi biển
            </h2>
            
            <p style={{ fontSize: 16, color: '#555', lineHeight: 1.85, marginBottom: 16 }}>
              <strong>Tầm nhìn đến năm 2030:</strong> Khai thác hiệu quả và phát triển Hệ thống TTDH Việt Nam là hệ thống thông tin chủ đạo phục vụ công tác PCTT&TKCN, góp phần đảm bảo thông tin liên lạc, bảo vệ quốc phòng an ninh, phát triển kinh tế biển.
            </p>

            <p style={{ fontSize: 16, color: '#555', lineHeight: 1.85, marginBottom: 24 }}>
              <strong>Sứ mệnh:</strong> Thực hiện tốt nhiệm vụ công ích do Nhà nước đặt hàng, cung cấp dịch vụ đáp ứng tiêu chuẩn quốc tế. Đồng hành cùng ngư dân bám biển - Tiếp nhận, xử lý thông tin Cấp cứu-Khẩn cấp, bảo đảm an toàn hàng hải và chủ quyền biển đảo.
            </p>

            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#001529', marginBottom: 12 }}>Nhà cung cấp giải pháp toàn diện:</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SOLUTIONS.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <CheckCircleOutlined style={{ color: '#0057FF', marginTop: 3, fontSize: 15, flexShrink: 0 }} />
                  <span style={{ fontSize: 15, color: '#333', fontWeight: 500 }}>{f}</span>
                </div>
              ))}
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div style={{ position: 'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1524522173746-f628baad3644?q=80&w=900&fit=crop"
                alt="Hệ thống TTDH hàng hải"
                style={{ width: '100%', borderRadius: 16, display: 'block' }}
              />
              <div
                style={{
                  position: 'absolute', bottom: -20, left: -20,
                  background: '#0057FF', borderRadius: 12,
                  padding: '16px 24px', color: '#fff',
                  boxShadow: '0 8px 32px rgba(0,87,255,0.3)',
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 28 }}>33 Đài</div>
                <div style={{ fontSize: 13, opacity: 0.85 }}>Thông tin duyên hải</div>
              </div>
            </div>
          </Col>
        </Row>

        <Divider style={{ margin: '72px 0' }} />

        {/* ── 4. Core Values ──────────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Tag color="blue" style={{ marginBottom: 12, fontWeight: 600, letterSpacing: 1, fontSize: 11 }}>
            GIÁ TRỊ CỐT LÕI
          </Tag>
          <h2 style={{ fontSize: 30, fontWeight: 700, color: '#001529', margin: 0 }}>
            Tiên phong lĩnh vực thông tin liên lạc
          </h2>
        </div>

        <Row gutter={[24, 24]}>
          {CORE_VALUES.map((item, i) => (
            <Col xs={24} sm={12} md={6} key={i}>
              <Card
                hoverable
                style={{
                  borderRadius: 14,
                  border: '1px solid #f0f0f0',
                  height: '100%',
                  transition: 'all 0.3s ease',
                }}
                styles={{ body: { padding: 24 } }}
              >
                <div
                  style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: item.bg, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, color: item.color,
                    marginBottom: 16,
                  }}
                >
                  {item.icon}
                </div>
                <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8, color: '#001529' }}>
                  {item.title}
                </div>
                <div style={{ color: '#666', fontSize: 14, lineHeight: 1.7 }}>
                  {item.desc}
                </div>
              </Card>
            </Col>
          ))}
        </Row>

      </div>
    </Content>
  );
};

export default About;