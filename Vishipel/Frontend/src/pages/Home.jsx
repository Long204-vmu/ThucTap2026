/**
 * Home.jsx — Trang chủ VISHIPEL EMS_NAV
 * ─────────────────────────────────────
 * ✅ API-ready: Tìm comment "🔌 API" để kết nối backend
 * ✅ Loading skeleton + Error state
 * ✅ Responsive (xs → xl)
 * ✅ Ant Design 5.x compatible
 */

import React, { useState, useEffect, useRef } from 'react';
import { Layout, Carousel, Row, Col, Card, Tag, Skeleton, Alert, Button, Statistic } from 'antd';
import { ArrowRightOutlined, SafetyCertificateOutlined, ThunderboltOutlined, GlobalOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Content } = Layout;

// ─── MOCK DATA (xoá khi có API) ───────────────────────────────────────────────
const MOCK_BANNERS = [
  {
    key: 'radar',
    tag: 'Mới nhất',
    title: 'Hệ Thống Radar JRC',
    desc: 'Thiết bị định vị và phát hiện mục tiêu hàng hải nguyên bản, chính xác tuyệt đối.',
    btnText: 'Khám phá ngay',
    btnLink: '/products',
    img: 'https://images.unsplash.com/photo-1549497538-303791108f94?q=80&w=1600&h=700&fit=crop',
  },
  {
    key: 'ais',
    tag: 'Bán chạy',
    title: 'Thiết bị AIS FA-170',
    desc: 'Giải pháp giám sát và định danh tàu thuyền thời gian thực cho an toàn hàng hải.',
    btnText: 'Tìm hiểu thêm',
    btnLink: '/products',
    img: 'https://images.pexels.com/photos/1012613/pexels-photo-1012613.jpeg?auto=compress&cs=tinysrgb&w=1600&h=700&fit=crop',
  },
];

const MOCK_PRODUCTS = [
  { id: 1, name: 'Máy Radar JRC',    model: 'JMA-5312', type: 'Định vị',  typeColor: 'blue',   img: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=600&fit=crop', price: '30.000.000 ₫' },
  { id: 2, name: 'Thiết bị AIS',     model: 'FA-170',   type: 'Giám sát', typeColor: 'cyan',   img: 'https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?q=80&w=600&fit=crop', price: '12.000.000 ₫' },
  { id: 3, name: 'Máy Đo Sâu',       model: 'FE-800',   type: 'Cảm biến', typeColor: 'green',  img: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=600&fit=crop', price: '25.000.000 ₫' },
  { id: 4, name: 'Hệ Thống ECDIS',   model: 'JAN-9201', type: 'Hải đồ',   typeColor: 'orange', img: 'https://images.unsplash.com/photo-1500514960786-8de7943729e2?q=80&w=600&fit=crop', price: '45.000.000 ₫' },
];

const MOCK_STATS = [
  { label: 'Thiết bị quản lý', value: 1500, suffix: '+', icon: <SafetyCertificateOutlined /> },
  { label: 'Đối tác tin cậy',  value: 48,   suffix: '+', icon: <GlobalOutlined /> },
  { label: 'Năm kinh nghiệm',  value: 15,   suffix: '',  icon: <ThunderboltOutlined /> },
  { label: 'Độ chính xác',     value: 99.9, suffix: '%', icon: <SafetyCertificateOutlined />, precision: 1 },
];
// ──────────────────────────────────────────────────────────────────────────────

// ─── HOOK: Fetch dữ liệu (dễ thay bằng axios) ────────────────────────────────
function useHomeData() {
  const [banners, setBanners]     = useState([]);
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 🔌 API INTEGRATION — thay khối dưới bằng:
        // const [bannerRes, productRes] = await Promise.all([
        //   axios.get('/api/banners'),
        //   axios.get('/api/products/featured'),
        // ]);
        // setBanners(bannerRes.data);
        // setProducts(productRes.data);

        await new Promise(r => setTimeout(r, 600)); // giả lập network delay
        setBanners(MOCK_BANNERS);
        setProducts(MOCK_PRODUCTS);
      } catch (err) {
        setError('Không thể tải dữ liệu. Vui lòng thử lại.');
        console.error('[Home] fetchData error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { banners, products, loading, error };
}
// ──────────────────────────────────────────────────────────────────────────────

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

const HeroBanner = ({ banners, loading }) => {
  const carouselRef = useRef(null);

  if (loading) {
    return <Skeleton.Image active style={{ width: '100%', height: 520, display: 'block' }} />;
  }

  return (
    <div style={{ position: 'relative' }}>
      <Carousel ref={carouselRef} autoplay autoplaySpeed={5000} dots={{ className: 'hero-dots' }} fade>
        {banners.map(item => (
          <div key={item.key}>
            <div
              style={{
                backgroundImage: `linear-gradient(to right, rgba(0,15,40,0.85) 40%, rgba(0,15,40,0.3) 100%), url(${item.img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: 520,
                display: 'flex',
                alignItems: 'center',
                padding: '0 8%',
              }}
            >
              <div style={{ maxWidth: 560, animation: 'slideUp 0.7s ease' }}>
                <Tag
                  color="blue"
                  style={{ marginBottom: 16, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', fontSize: 11 }}
                >
                  {item.tag}
                </Tag>
                <h1
                  style={{
                    color: '#fff',
                    fontSize: 'clamp(28px, 4vw, 48px)',
                    fontWeight: 700,
                    lineHeight: 1.2,
                    margin: '0 0 16px',
                    fontFamily: '"Be Vietnam Pro", sans-serif',
                  }}
                >
                  {item.title}
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 17, marginBottom: 32, lineHeight: 1.7 }}>
                  {item.desc}
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <Link to={item.btnLink}>
                    <Button
                      type="primary"
                      size="large"
                      icon={<ArrowRightOutlined />}
                      style={{ height: 48, padding: '0 32px', fontWeight: 600, borderRadius: 10, fontSize: 15 }}
                    >
                      {item.btnText}
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button
                      size="large"
                      ghost
                      style={{ height: 48, padding: '0 28px', borderRadius: 10, fontSize: 15, borderColor: 'rgba(255,255,255,0.5)', color: '#fff' }}
                    >
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
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-dots li button { background: rgba(255,255,255,0.5) !important; }
        .hero-dots li.slick-active button { background: #1677ff !important; width: 24px !important; }
      `}</style>
    </div>
  );
};

const StatsBar = () => (
  <div style={{ background: '#001529', padding: '32px 8%' }}>
    <Row gutter={[24, 24]} justify="center">
      {MOCK_STATS.map((s, i) => (
        <Col xs={12} sm={6} key={i} style={{ textAlign: 'center' }}>
          <Statistic
            value={s.value}
            suffix={s.suffix}
            precision={s.precision ?? 0}
            valueStyle={{ color: '#1677ff', fontWeight: 700, fontSize: 32 }}
          />
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 4 }}>{s.label}</div>
        </Col>
      ))}
    </Row>
  </div>
);

const ProductCard = ({ item }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Card
      hoverable
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      cover={
        <div style={{ overflow: 'hidden', height: 210 }}>
          <img
            alt={item.name}
            src={item.img}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: hovered ? 'scale(1.07)' : 'scale(1)',
              transition: 'transform 0.4s ease',
            }}
          />
        </div>
      }
      style={{
        borderRadius: 12,
        overflow: 'hidden',
        border: hovered ? '1px solid #1677ff' : '1px solid #f0f0f0',
        boxShadow: hovered ? '0 8px 32px rgba(22,119,255,0.15)' : '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'all 0.3s ease',
      }}
    >
      <Tag color={item.typeColor} style={{ marginBottom: 8, fontWeight: 500 }}>{item.type}</Tag>
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{item.name}</div>
      <div style={{ color: '#8c8c8c', fontSize: 13, marginBottom: 12 }}>Model: {item.model}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#1677ff', fontWeight: 700, fontSize: 15 }}>{item.price}</span>
        <Link to={`/products/${item.id}`}>
          <Button
            type={hovered ? 'primary' : 'default'}
            size="small"
            icon={<ArrowRightOutlined />}
            style={{ borderRadius: 8, transition: 'all 0.2s' }}
          >
            Chi tiết
          </Button>
        </Link>
      </div>
    </Card>
  );
};

const ProductSkeleton = () => (
  <Col xs={24} sm={12} md={6}>
    <Card style={{ borderRadius: 12 }}>
      <Skeleton.Image active style={{ width: '100%', height: 210, marginBottom: 16 }} />
      <Skeleton active paragraph={{ rows: 3 }} />
    </Card>
  </Col>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const Home = () => {
  const { banners, products, loading, error } = useHomeData();

  return (
    <Content style={{ marginTop: 68 }}>
      {/* Error Banner */}
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          closable
          style={{ margin: '16px 5%', borderRadius: 10 }}
        />
      )}

      {/* Hero Carousel */}
      <HeroBanner banners={banners} loading={loading} />

      {/* Stats */}
      <StatsBar />

      {/* Featured Products */}
      <div style={{ padding: '64px 5%', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Tag color="blue" style={{ marginBottom: 12, fontWeight: 600, letterSpacing: 1, fontSize: 11 }}>
            DANH MỤC SẢN PHẨM
          </Tag>
          <h2 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 12px', color: '#001529' }}>
            Sản Phẩm Nổi Bật
          </h2>
          <p style={{ color: '#8c8c8c', fontSize: 16 }}>
            Thiết bị hàng hải chính hãng, đáp ứng tiêu chuẩn quốc tế
          </p>
        </div>

        <Row gutter={[24, 24]}>
          {loading
            ? [1, 2, 3, 4].map(n => <ProductSkeleton key={n} />)
            : products.map(item => (
                <Col xs={24} sm={12} md={6} key={item.id}>
                  <ProductCard item={item} />
                </Col>
              ))}
        </Row>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link to="/products">
            <Button
              size="large"
              style={{ height: 48, padding: '0 40px', borderRadius: 10, fontWeight: 600, fontSize: 15, borderColor: '#1677ff', color: '#1677ff' }}
            >
              Xem tất cả sản phẩm <ArrowRightOutlined />
            </Button>
          </Link>
        </div>
      </div>
    </Content>
  );
};

export default Home;
