/**
 * About.jsx — Trang giới thiệu VISHIPEL EMS_NAV
 * ─────────────────────────────────────────────
 * ✅ API-ready: Tìm comment "🔌 API" để kết nối backend
 * ✅ Animated counter khi vào viewport
 * ✅ Accessible timeline
 * ✅ Responsive
 */

import React, { useState, useEffect, useRef } from 'react';
import { Layout, Row, Col, Card, Divider, Tag } from 'antd';
import {
  RocketOutlined, SafetyCertificateOutlined,
  TeamOutlined, GlobalOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

const { Content } = Layout;

// ─── MOCK DATA (xoá khi có API) ───────────────────────────────────────────────
const MOCK_STATS = [
  { label: 'Thiết bị quản lý', value: 1500, suffix: '+' },
  { label: 'Độ chính xác',     value: 99.9, suffix: '%', decimal: 1 },
  { label: 'Năm kinh nghiệm',  value: 15,   suffix: '' },
  { label: 'Cảng biển phục vụ',value: 48,   suffix: '+' },
];

const CORE_VALUES = [
  {
    icon: <SafetyCertificateOutlined />,
    title: 'Tin Cậy',
    desc: 'Dữ liệu thiết bị chính xác tuyệt đối, được xác thực từ SQL Server.',
    color: '#0057FF',
    bg: '#e6f0ff',
  },
  {
    icon: <RocketOutlined />,
    title: 'Tốc Độ',
    desc: 'Truy xuất thông tin thiết bị tức thì qua quét mã QR tích hợp.',
    color: '#00b96b',
    bg: '#e6fff5',
  },
  {
    icon: <TeamOutlined />,
    title: 'Hợp Tác',
    desc: 'Kết nối liền mạch giữa bộ phận Kỹ thuật, Kế toán và Lãnh đạo.',
    color: '#f59e0b',
    bg: '#fff8e6',
  },
  {
    icon: <GlobalOutlined />,
    title: 'Tiêu Chuẩn',
    desc: 'Tuân thủ đầy đủ các quy định hàng hải quốc tế SOLAS, IMO.',
    color: '#7c3aed',
    bg: '#f3f0ff',
  },
];

const TIMELINE = [
  {
    date: 'Tháng 02/2026',
    title: 'Khởi động dự án',
    desc: 'Phân tích nghiệp vụ và khảo sát thực tế tại Vishipel. Xác định yêu cầu từ các phòng ban.',
    done: true,
  },
  {
    date: 'Tháng 03/2026',
    title: 'Thiết kế & Database',
    desc: 'Hoàn thiện UI/UX prototype và thiết kế schema SQL Server. Phê duyệt kiến trúc hệ thống.',
    done: true,
  },
  {
    date: 'Tháng 04/2026',
    title: 'Phát triển Backend',
    desc: 'Xây dựng API .NET Core, tích hợp QR Code, và viết unit test cho các module cốt lõi.',
    done: false,
    active: true,
  },
  {
    date: 'Tháng 05/2026',
    title: 'Hoàn thiện & Bàn giao',
    desc: 'Kiểm thử UAT tại Vishipel, tối ưu hiệu năng, và bảo vệ đồ án tốt nghiệp.',
    done: false,
  },
];

const FEATURES = [
  'Quản lý vòng đời thiết bị toàn diện',
  'Tra cứu thiết bị bằng mã QR trực tiếp',
  'Dashboard thống kê thời gian thực',
  'Tích hợp sẵn với hệ thống kho Vishipel',
  'Phân quyền đa cấp (Admin / Kỹ thuật / Kế toán)',
  'Xuất báo cáo PDF & Excel tự động',
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
  // 🔌 API INTEGRATION — có thể fetch content động từ backend:
  // useEffect(() => {
  //   axios.get('/api/about').then(res => setAboutData(res.data));
  // }, []);

  return (
    <Content style={{ marginTop: 68, background: '#fff', minHeight: '100vh' }}>

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
          Về chúng tôi
        </Tag>
        <h1
          style={{
            color: '#fff',
            fontSize: 'clamp(28px, 4vw, 52px)',
            fontWeight: 800,
            lineHeight: 1.2,
            margin: '0 0 16px',
            maxWidth: 600,
          }}
        >
          Về EMS_NAV
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 17, maxWidth: 560, lineHeight: 1.8 }}>
          Hệ thống quản lý vòng đời thiết bị hàng hải thông minh — được phát triển bởi
          kỹ sư Vishipel, dành riêng cho ngành hàng hải Việt Nam.
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

        {/* ── 3. Mission + Image ───────────────────────────────── */}
        <Row gutter={[56, 40]} align="middle">
          <Col xs={24} md={12}>
            <Tag color="blue" style={{ marginBottom: 12, fontWeight: 600, letterSpacing: 1, fontSize: 11 }}>
              TẦM NHÌN & SỨ MỆNH
            </Tag>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: '#001529', lineHeight: 1.3, margin: '0 0 16px' }}>
              Chuyển đổi số cho ngành hàng hải Việt Nam
            </h2>
            <p style={{ fontSize: 16, color: '#555', lineHeight: 1.85, marginBottom: 24 }}>
              Được ra đời từ nhu cầu thực tế tại <strong>Vishipel</strong>, EMS_NAV không chỉ
              là phần mềm quản lý kho — mà là giải pháp chuyển đổi số toàn diện, giúp số hóa
              thông tin thiết bị qua mã QR, cho phép kỹ thuật viên và ban quản lý nắm bắt
              tình trạng thiết bị mọi lúc, mọi nơi.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {FEATURES.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <CheckCircleOutlined style={{ color: '#0057FF', marginTop: 3, fontSize: 15, flexShrink: 0 }} />
                  <span style={{ fontSize: 15, color: '#333' }}>{f}</span>
                </div>
              ))}
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div style={{ position: 'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1524522173746-f628baad3644?q=80&w=900&fit=crop"
                alt="Hệ thống hàng hải"
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
                <div style={{ fontWeight: 800, fontSize: 28 }}>99.9%</div>
                <div style={{ fontSize: 13, opacity: 0.85 }}>Độ chính xác dữ liệu</div>
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
            Điều chúng tôi cam kết
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

        <Divider style={{ margin: '72px 0' }} />

        {/* ── 5. Timeline ─────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Tag color="blue" style={{ marginBottom: 12, fontWeight: 600, letterSpacing: 1, fontSize: 11 }}>
            LỘ TRÌNH DỰ ÁN
          </Tag>
          <h2 style={{ fontSize: 30, fontWeight: 700, color: '#001529', margin: 0 }}>
            Hành trình phát triển
          </h2>
        </div>

        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative' }}>
          {/* Đường dọc */}
          <div
            style={{
              position: 'absolute', left: 20, top: 0, bottom: 0,
              width: 2, background: '#e8ecf0',
            }}
          />

          {TIMELINE.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex', gap: 24, marginBottom: i < TIMELINE.length - 1 ? 36 : 0,
                position: 'relative',
              }}
            >
              {/* Dot */}
              <div
                style={{
                  width: 40, height: 40, borderRadius: '50%', flexShrink: 0, zIndex: 1,
                  background: item.done ? '#0057FF' : item.active ? '#fff' : '#f0f0f0',
                  border: item.active ? '2px solid #0057FF' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: item.done ? '#fff' : item.active ? '#0057FF' : '#bbb',
                  fontSize: 16, fontWeight: 700,
                  boxShadow: item.active ? '0 0 0 4px rgba(0,87,255,0.15)' : 'none',
                }}
              >
                {item.done ? <CheckCircleOutlined /> : i + 1}
              </div>

              {/* Content */}
              <div
                style={{
                  flex: 1,
                  background: item.active ? '#f0f6ff' : '#fafafa',
                  border: item.active ? '1px solid #bfd9ff' : '1px solid #f0f0f0',
                  borderRadius: 12, padding: '16px 20px',
                  marginTop: 4,
                }}
              >
                <div style={{ fontSize: 12, color: item.done ? '#0057FF' : '#999', fontWeight: 600, marginBottom: 4 }}>
                  {item.date}
                  {item.active && (
                    <Tag color="blue" style={{ marginLeft: 8, fontSize: 10, fontWeight: 600 }}>Đang thực hiện</Tag>
                  )}
                  {item.done && (
                    <Tag color="green" style={{ marginLeft: 8, fontSize: 10, fontWeight: 600 }}>Hoàn thành</Tag>
                  )}
                </div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#001529', marginBottom: 6 }}>
                  {item.title}
                </div>
                <div style={{ color: '#666', fontSize: 14, lineHeight: 1.7 }}>
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Content>
  );
};

export default About;
