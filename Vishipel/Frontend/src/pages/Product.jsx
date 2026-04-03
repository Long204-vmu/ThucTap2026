/**
 * Product.jsx — Trang sản phẩm VISHIPEL EMS_NAV
 * ──────────────────────────────────────────────
 * ✅ API-ready: Tìm comment "🔌 API" để kết nối backend
 * ✅ Filter + Search hoạt động phía client
 * ✅ Loading skeleton + Empty state + Error state
 * ✅ Pagination
 * ✅ Cart state (dễ nâng lên Context/Redux)
 * ✅ Trang chi tiết sản phẩm (ProductDetail) với nút Tư vấn & Giỏ hàng
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Layout, Row, Col, Card, Button, Typography, Input,
  Tag, Skeleton, Alert, Empty, Pagination, Badge,
  Drawer, message, Tooltip, Divider, Rate, Breadcrumb,
} from 'antd';
import {
  FilterOutlined, ShoppingCartOutlined, SearchOutlined,
  AppstoreOutlined, BarsOutlined, CloseOutlined,
  EyeOutlined, ArrowLeftOutlined, PhoneOutlined,
  CheckCircleOutlined, SafetyCertificateOutlined,
  ThunderboltOutlined, GlobalOutlined,
  LeftOutlined, RightOutlined,
} from '@ant-design/icons';

const { Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Radar JMA-5200',
    category: 'radar',
    price: 30000000,
    images: [
      '/image/JMA-5200-1.jpg',
      '/image/JMA-5200-2.jpg',
    ],
    brand: 'JRC',
    status: 'Còn hàng',
    rating: 4.5,
    reviews: 12,
    shortDesc: 'Radar hàng hải dải X-band, phù hợp tàu cỡ vừa và lớn.',
    description: `Radar JMA-5200 là dòng radar hàng hải X-band hiệu năng cao của JRC, được thiết kế cho các tàu cỡ vừa và lớn hoạt động trong mọi điều kiện thời tiết. Tích hợp công nghệ xử lý tín hiệu kỹ thuật số tiên tiến, cho phép phát hiện mục tiêu nhỏ ngay cả trong mưa lớn và sóng cao.`,
    specs: [
      { label: 'Tần số', value: '9410 MHz (X-band)' },
      { label: 'Công suất phát', value: '10 kW' },
      { label: 'Tầm quan sát', value: 'Tối đa 96 hải lý' },
      { label: 'Màn hình', value: '19" LCD màu, độ phân giải 1280×1024' },
      { label: 'Chuẩn kết nối', value: 'NMEA 0183, NMEA 2000' },
      { label: 'Nhiệt độ hoạt động', value: '-15°C ~ +55°C' },
    ],
    warranty: '24 tháng',
    origin: 'Nhật Bản',
    certifications: ['IMO', 'SOLAS', 'IEC 62388'],
  },
  {
    id: 2,
    name: 'Bộ đàm IC-M324',
    category: 'spare', // Chuyển về danh mục phụ kiện/liên lạc
    price: 12000000,
    images: [
      '/image/IC-M324-1.jpg',
      '/image/IC-M324-2.jpg',
    ],
    brand: 'Icom', // Sửa từ Furuno thành Icom
    status: 'Còn hàng',
    rating: 4.8,
    reviews: 27,
    shortDesc: 'Bộ đàm cố định VHF hàng hải, tích hợp tính năng định danh số (DSC) lớp D.',
    description: `Icom IC-M324 là dòng bộ đàm VHF cố định mạnh mẽ, sở hữu giao diện người dùng trực quan và khả năng chống nước chuẩn IPX7. Thiết bị tích hợp tính năng gọi chọn số chuẩn Class D (DSC), giúp tăng cường an toàn liên lạc trên biển.`,
    specs: [
      { label: 'Dải tần số', value: 'VHF (156.025–157.425 MHz)' },
      { label: 'Công suất phát', value: '25 W / 1 W' },
      { label: 'Chống nước', value: 'IPX7 (độ sâu 1m trong 30 phút)' },
      { label: 'Màn hình', value: 'LCD Ma trận điểm độ tương phản cao' },
      { label: 'Tính năng nổi bật', value: 'DSC Class D, AquaQuake™ thoát nước loa' },
      { label: 'Nguồn', value: '13.8 VDC' },
    ],
    warranty: '12 tháng', // Thường bảo hành 12 tháng theo chuẩn hãng
    origin: 'Nhật Bản',
    certifications: ['ITU-R M493-13', 'IPX7'],
  },
  {
    id: 3,
    name: 'Máy đo sâu FE-800',
    category: 'sensor',
    price: 25000000,
    images: [
      '/images/FE-800.jpg',
      '/images/FE-800-1.jpg',
    ],
    brand: 'Furuno',
    status: 'Còn hàng',
    rating: 4.3,
    reviews: 9,
    shortDesc: 'Máy đo sâu hồi âm đơn tần, độ chính xác cao, màn hình màu.',
    description: `FE-800 là máy đo sâu hồi âm đơn tần của Furuno, phù hợp cho tàu đánh cá và tàu thương mại cỡ nhỏ. Màn hình màu 5.7" hiển thị rõ nét ngay dưới ánh sáng mặt trời. Phát hiện đáy biển chính xác ở độ sâu lên đến 1000m.`,
    specs: [
      { label: 'Tần số hoạt động', value: '50 / 200 kHz' },
      { label: 'Độ sâu tối đa', value: '1000 m' },
      { label: 'Màn hình', value: '5.7" TFT màu' },
      { label: 'Công suất phát', value: '600 W (RMS)' },
      { label: 'Giao thức', value: 'NMEA 0183' },
      { label: 'Cấp bảo vệ', value: 'IPX5' },
    ],
    warranty: '18 tháng',
    origin: 'Nhật Bản',
    certifications: ['IEC 60945'],
  },
  {
    id: 4,
    name: 'Hải đồ ECDIS JAN-9201',
    category: 'all',
    price: 45000000,
    images: [
      '/images/ecdis-jan9201-1.jpg',
      '/images/ecdis-jan9201-2.jpg',
      '/images/ecdis-jan9201-3.jpg',
    ],
    brand: 'JRC',
    status: 'Sắp về',
    rating: 4.9,
    reviews: 5,
    shortDesc: 'Hệ thống hải đồ điện tử ECDIS chuẩn IMO, màn hình 19".',
    description: `JAN-9201 là hệ thống hải đồ điện tử (ECDIS) thế hệ mới của JRC, tương thích đầy đủ với chuẩn IHO S-57/S-63. Giao diện trực quan, tích hợp dữ liệu AIS, radar overlay và route planning thông minh giúp sĩ quan hàng hải vận hành an toàn và hiệu quả.`,
    specs: [
      { label: 'Màn hình', value: '19" LCD, 1280×1024' },
      { label: 'Chuẩn hải đồ', value: 'IHO S-57, S-63' },
      { label: 'Kết nối', value: 'NMEA 0183/2000, Ethernet' },
      { label: 'CPU', value: 'Intel Core i5 tích hợp' },
      { label: 'Lưu trữ', value: 'SSD 256 GB' },
      { label: 'Nhiệt độ', value: '-15°C ~ +55°C' },
    ],
    warranty: '24 tháng',
    origin: 'Nhật Bản',
    certifications: ['IMO', 'SOLAS', 'IEC 61174'],
  },
  {
    id: 5,
    name: 'Cảm biến gió WS-200',
    category: 'sensor',
    price: 8000000,
    images: [
      '/images/wind-ws200-1.jpg',
      '/images/wind-ws200-2.jpg',
    ],
    brand: 'Furuno',
    status: 'Còn hàng',
    rating: 4.1,
    reviews: 14,
    shortDesc: 'Cảm biến tốc độ và hướng gió siêu âm, không có bộ phận chuyển động.',
    description: `WS-200 sử dụng công nghệ siêu âm để đo tốc độ và hướng gió mà không cần bộ phận cơ học chuyển động, giúp tăng độ bền và giảm bảo trì. Phù hợp lắp đặt trên cột buồm hoặc thượng tầng tàu.`,
    specs: [
      { label: 'Nguyên lý', value: 'Siêu âm (Ultrasonic)' },
      { label: 'Tốc độ gió', value: '0 – 75 m/s' },
      { label: 'Hướng gió', value: '0° – 360°' },
      { label: 'Giao thức', value: 'NMEA 0183' },
      { label: 'Nguồn', value: '12–24 VDC' },
      { label: 'Cấp bảo vệ', value: 'IP67' },
    ],
    warranty: '12 tháng',
    origin: 'Nhật Bản',
    certifications: ['IEC 60945'],
  },
  {
    id: 6,
    name: 'Radar JMA-5310',
    category: 'radar',
    price: 38000000,
    images: [
      '/images/radar-jma5310-1.jpg',
      '/images/radar-jma5310-2.jpg',
      '/images/radar-jma5310-3.jpg',
    ],
    brand: 'JRC',
    status: 'Còn hàng',
    rating: 4.7,
    reviews: 8,
    shortDesc: 'Radar X-band cao cấp tích hợp ARPA, phù hợp tàu lớn.',
    description: `JMA-5310 là phiên bản nâng cấp của dòng JMA-5200, tích hợp thêm hệ thống ARPA (Automatic Radar Plotting Aid) giúp theo dõi và dự báo quỹ đạo tối đa 40 mục tiêu đồng thời. Đây là lựa chọn lý tưởng cho tàu hàng cỡ lớn và tàu chở dầu.`,
    specs: [
      { label: 'Tần số', value: '9410 MHz (X-band)' },
      { label: 'Công suất phát', value: '25 kW' },
      { label: 'Tầm quan sát', value: 'Tối đa 120 hải lý' },
      { label: 'ARPA', value: '40 mục tiêu' },
      { label: 'Màn hình', value: '21" LCD màu' },
      { label: 'Chuẩn kết nối', value: 'NMEA 0183, NMEA 2000, IEC 61162' },
    ],
    warranty: '24 tháng',
    origin: 'Nhật Bản',
    certifications: ['IMO', 'SOLAS', 'IEC 62388'],
  },
  {
    id: 7,
    name: 'AIS FA-150',
    category: 'ais',
    price: 9500000,
    images: [
      '/images/ais-fa150-1.jpg',
      '/images/ais-fa150-2.jpg',
    ],
    brand: 'Furuno',
    status: 'Còn hàng',
    rating: 4.4,
    reviews: 19,
    shortDesc: 'Transponder AIS Class B giá tốt, phù hợp tàu nhỏ và tàu cá.',
    description: `FA-150 là transponder AIS Class B của Furuno dành cho tàu nhỏ, tàu cá và tàu thể thao. Nhỏ gọn, dễ lắp đặt, tiêu thụ điện năng thấp. Tương thích với hầu hết plotters và màn hình hàng hải trên thị trường.`,
    specs: [
      { label: 'Loại', value: 'Class B Transponder' },
      { label: 'Công suất phát', value: '2 W' },
      { label: 'Kênh', value: '87B / 88B' },
      { label: 'Giao thức', value: 'NMEA 0183' },
      { label: 'Nguồn', value: '12–24 VDC' },
      { label: 'Kích thước', value: '130 × 150 × 40 mm' },
    ],
    warranty: '12 tháng',
    origin: 'Nhật Bản',
    certifications: ['IEC 62287-2'],
  },
  {
    id: 8,
    name: 'Ăng-ten AV-17HB',
    category: 'spare',
    price: 2500000,
    images: [
      '/images/antenna-av17hb-1.jpg',
      '/images/antenna-av17hb-2.jpg',
    ],
    brand: 'JRC',
    status: 'Còn hàng',
    rating: 4.0,
    reviews: 31,
    shortDesc: 'Ăng-ten VHF băng rộng, chắc chắn, chống ăn mòn muối biển.',
    description: `AV-17HB là ăng-ten VHF chất lượng cao dành cho môi trường hàng hải. Vỏ bọc sợi thủy tinh chịu tia UV và ăn mòn muối biển, phù hợp lắp trên mọi loại tàu. Tương thích với tất cả bộ đàm VHF hàng hải.`,
    specs: [
      { label: 'Tần số', value: '156–174 MHz' },
      { label: 'Gain', value: '3 dBi' },
      { label: 'Trở kháng', value: '50 Ω' },
      { label: 'Kết nối', value: 'PL-259' },
      { label: 'Chiều dài', value: '1.2 m' },
      { label: 'Vật liệu', value: 'Sợi thủy tinh + thép không gỉ' },
    ],
    warranty: '12 tháng',
    origin: 'Nhật Bản',
    certifications: ['IEC 60945'],
  },
];

const CATEGORIES = [
  { key: 'all',    label: 'Tất cả sản phẩm', color: 'default' },
  { key: 'radar',  label: 'Máy Radar',        color: 'blue'    },
  { key: 'ais',    label: 'Thiết bị AIS',     color: 'cyan'    },
  { key: 'sensor', label: 'Cảm biến & Đo sâu',color: 'green'   },
  { key: 'spare',  label: 'Phụ kiện',         color: 'orange'  },
];

const PAGE_SIZE = 6;

const formatPrice = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

// ─── HOOK: Fetch products ─────────────────────────────────────────────────────
function useProducts(category, search) {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // 🔌 API INTEGRATION:
        // const params = new URLSearchParams();
        // if (category !== 'all') params.set('category', category);
        // if (search) params.set('q', search);
        // const res = await axios.get(`/api/products?${params}`);
        // setAllProducts(res.data.items);
        await new Promise(r => setTimeout(r, 500));
        setAllProducts(MOCK_PRODUCTS);
        setError(null);
      } catch (err) {
        setError('Không thể tải danh sách sản phẩm.');
        console.error('[Product] fetchProducts error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    return allProducts.filter(p => {
      const matchCat    = category === 'all' || p.category === category;
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [allProducts, category, search]);

  return { filtered, loading, error };
}

// ─── FILTER SIDEBAR ───────────────────────────────────────────────────────────
const FilterSidebar = ({ active, onSelect, search, onSearch }) => (
  <div style={{ padding: '24px 20px' }}>
    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
      <FilterOutlined style={{ color: '#1677ff' }} />
      Bộ lọc
    </div>
    <Input
      placeholder="Tìm thiết bị..."
      prefix={<SearchOutlined style={{ color: '#bbb' }} />}
      value={search}
      onChange={e => onSearch(e.target.value)}
      allowClear
      style={{ marginBottom: 20, borderRadius: 8 }}
    />
    <div style={{ fontWeight: 600, fontSize: 12, color: '#8c8c8c', letterSpacing: 1, marginBottom: 10, textTransform: 'uppercase' }}>
      Danh mục
    </div>
    {CATEGORIES.map(cat => (
      <div
        key={cat.key}
        onClick={() => onSelect(cat.key)}
        style={{
          padding: '10px 14px',
          borderRadius: 8,
          cursor: 'pointer',
          marginBottom: 4,
          background: active === cat.key ? '#e6f4ff' : 'transparent',
          color: active === cat.key ? '#1677ff' : '#333',
          fontWeight: active === cat.key ? 600 : 400,
          fontSize: 14,
          transition: 'all 0.2s',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {cat.label}
        {active === cat.key && (
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1677ff' }} />
        )}
      </div>
    ))}
  </div>
);

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
const ProductCardGrid = ({ item, onViewDetail }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Card
      hoverable
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      cover={
        <div style={{ overflow: 'hidden', height: 180, position: 'relative' }}>
          <img
            alt={item.name}
            src={item.images[0]}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transform: hovered ? 'scale(1.06)' : 'scale(1)',
              transition: 'transform 0.4s ease',
            }}
          />
          <Tag
            color={item.status === 'Còn hàng' ? 'green' : 'orange'}
            style={{ position: 'absolute', top: 10, left: 10, fontWeight: 600, fontSize: 11 }}
          >
            {item.status}
          </Tag>
        </div>
      }
      style={{
        borderRadius: 12, overflow: 'hidden',
        border: hovered ? '1px solid #1677ff' : '1px solid #f0f0f0',
        boxShadow: hovered ? '0 8px 28px rgba(22,119,255,0.12)' : '0 2px 8px rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ fontSize: 11, color: '#8c8c8c', marginBottom: 4, fontWeight: 500 }}>
        {item.brand}
      </div>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, color: '#001529' }}>
        {item.name}
      </div>
      <div style={{ marginBottom: 6 }}>
        <Rate disabled defaultValue={item.rating} style={{ fontSize: 11 }} />
        <Text type="secondary" style={{ fontSize: 11, marginLeft: 4 }}>({item.reviews})</Text>
      </div>
      <div style={{ fontSize: 12, color: '#666', marginBottom: 10, lineHeight: 1.5, minHeight: 36 }}>
        {item.shortDesc}
      </div>
      <div style={{ color: '#1677ff', fontWeight: 700, fontSize: 17, marginBottom: 14 }}>
        {formatPrice(item.price)}
      </div>
      <Button
        type="primary"
        icon={<EyeOutlined />}
        onClick={() => onViewDetail(item)}
        block
        style={{ borderRadius: 8, fontWeight: 600, height: 38 }}
      >
        Xem chi tiết
      </Button>
    </Card>
  );
};

// ─── SKELETON ─────────────────────────────────────────────────────────────────
const ProductCardSkeleton = () => (
  <Card style={{ borderRadius: 12, overflow: 'hidden' }}>
    <Skeleton.Image active style={{ width: '100%', height: 180 }} />
    <Skeleton active paragraph={{ rows: 3 }} style={{ marginTop: 12 }} />
  </Card>
);

// ─── IMAGE SLIDER ─────────────────────────────────────────────────────────────
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
        style={{ width: '100%', height: 380, objectFit: 'cover', display: 'block' }}
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
          width: '100%', height: 380, objectFit: 'cover', display: 'block',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Arrow Left */}
      <button
        onClick={prev}
        style={{
          position: 'absolute', top: '50%', left: 12,
          transform: 'translateY(-50%)',
          width: 40, height: 40, borderRadius: '50%',
          background: 'rgba(0,0,0,0.45)', border: 'none',
          cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: '#fff', fontSize: 16,
          transition: 'background 0.2s',
          zIndex: 2,
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
          position: 'absolute', top: '50%', right: 12,
          transform: 'translateY(-50%)',
          width: 40, height: 40, borderRadius: '50%',
          background: 'rgba(0,0,0,0.45)', border: 'none',
          cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: '#fff', fontSize: 16,
          transition: 'background 0.2s',
          zIndex: 2,
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.45)'}
      >
        <RightOutlined />
      </button>

      {/* Dot indicators */}
      <div
        style={{
          position: 'absolute', bottom: 12, left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', gap: 6, zIndex: 2,
        }}
      >
        {images.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: i === current ? 22 : 8,
              height: 8, borderRadius: 4,
              background: i === current ? '#1677ff' : 'rgba(255,255,255,0.75)',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
            }}
          />
        ))}
      </div>

      {/* Counter badge */}
      <div
        style={{
          position: 'absolute', top: 12, right: 12,
          background: 'rgba(0,0,0,0.5)', color: '#fff',
          fontSize: 12, fontWeight: 600,
          padding: '2px 10px', borderRadius: 20, zIndex: 2,
        }}
      >
        {current + 1} / {total}
      </div>

      {/* Thumbnail strip */}
      <div
        style={{
          display: 'flex', gap: 8, padding: '10px 0 0',
          justifyContent: 'center',
        }}
      >
        {images.map((src, i) => (
          <div
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: 64, height: 48, borderRadius: 8, overflow: 'hidden',
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

// ─── PRODUCT DETAIL PAGE ──────────────────────────────────────────────────────
const ProductDetail = ({ product, onBack, onAddCart, isInCart, onRequestConsult }) => {
  if (!product) return null;

  return (
    <div style={{ padding: '0 0 60px' }}>

      {/* Breadcrumb */}
      <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '12px 5%' }}>
        <Breadcrumb
          items={[
            { title: 'Trang chủ' },
            { title: <span style={{ cursor: 'pointer', color: '#1677ff' }} onClick={onBack}>Sản phẩm</span> },
            { title: product.name },
          ]}
        />
      </div>

      <div style={{ padding: '32px 5%' }}>
        {/* Back button */}
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
          style={{ marginBottom: 24, borderRadius: 8 }}
        >
          Quay lại danh sách
        </Button>

        <Row gutter={[40, 32]}>
          {/* ── LEFT: Ảnh sản phẩm ── */}
          <Col xs={24} md={10}>
            <div
              style={{
                borderRadius: 16,
                overflow: 'hidden',
                border: '1px solid #f0f0f0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                position: 'relative',
              }}
            >
              <ImageSlider images={product.images} alt={product.name} />
              <Tag
                color={product.status === 'Còn hàng' ? 'green' : 'orange'}
                style={{
                  position: 'absolute', top: 16, left: 16,
                  fontWeight: 700, fontSize: 12, padding: '4px 10px',
                  zIndex: 3,
                }}
              >
                {product.status}
              </Tag>
            </div>

            {/* Nhãn chứng nhận */}
            <div
              style={{
                marginTop: 16, background: '#f6ffed',
                border: '1px solid #b7eb8f', borderRadius: 10, padding: '12px 16px',
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 13, color: '#389e0d', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <SafetyCertificateOutlined />
                Chứng nhận & Tiêu chuẩn
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {product.certifications.map(c => (
                  <Tag key={c} color="green" style={{ fontWeight: 600 }}>{c}</Tag>
                ))}
              </div>
            </div>
          </Col>

          {/* ── RIGHT: Thông tin sản phẩm ── */}
          <Col xs={24} md={14}>
            {/* Brand & tên */}
            <div style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>
              {product.brand}
            </div>
            <Title level={2} style={{ margin: '0 0 8px', color: '#001529' }}>
              {product.name}
            </Title>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Rate disabled defaultValue={product.rating} style={{ fontSize: 14 }} />
              <Text type="secondary" style={{ fontSize: 13 }}>
                {product.rating}/5 ({product.reviews} đánh giá)
              </Text>
            </div>

            {/* Giá */}
            <div
              style={{
                background: 'linear-gradient(135deg, #e6f4ff 0%, #f0f5ff 100%)',
                borderRadius: 12, padding: '16px 20px', marginBottom: 20,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 2 }}>Giá niêm yết</div>
                <div style={{ color: '#1677ff', fontWeight: 800, fontSize: 26 }}>
                  {formatPrice(product.price)}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 2 }}>Bảo hành</div>
                <div style={{ fontWeight: 700, color: '#52c41a', fontSize: 15 }}>
                  {product.warranty}
                </div>
              </div>
            </div>

            {/* Mô tả */}
            <Paragraph style={{ color: '#444', lineHeight: 1.75, marginBottom: 20, fontSize: 14 }}>
              {product.description}
            </Paragraph>

            {/* Thông tin nhanh */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#555' }}>
                <GlobalOutlined style={{ color: '#1677ff' }} />
                Xuất xứ: <strong>{product.origin}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#555' }}>
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                Chính hãng 100%
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#555' }}>
                <ThunderboltOutlined style={{ color: '#fa8c16' }} />
                Giao hàng toàn quốc
              </div>
            </div>

            {/* ── 2 NÚT CHÍNH ── */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Button
                size="large"
                icon={<PhoneOutlined />}
                onClick={() => onRequestConsult(product)}
                style={{
                  flex: 1, minWidth: 180, height: 48, borderRadius: 10, fontWeight: 700,
                  borderColor: '#1677ff', color: '#1677ff', fontSize: 15,
                  background: '#fff',
                }}
              >
                Yêu cầu tư vấn
              </Button>
              <Button
                type="primary"
                size="large"
                icon={<ShoppingCartOutlined />}
                onClick={() => onAddCart(product)}
                disabled={product.status !== 'Còn hàng'}
                style={{
                  flex: 1, minWidth: 180, height: 48, borderRadius: 10, fontWeight: 700,
                  fontSize: 15,
                  ...(isInCart ? { background: '#52c41a', borderColor: '#52c41a' } : {}),
                }}
              >
                {isInCart ? 'Đã thêm vào giỏ' : 'Thêm vào giỏ hàng'}
              </Button>
            </div>

            {product.status !== 'Còn hàng' && (
              <Alert
                message="Sản phẩm đang sắp về kho — vui lòng liên hệ để đặt trước"
                type="warning"
                showIcon
                style={{ marginTop: 12, borderRadius: 8 }}
              />
            )}
          </Col>
        </Row>

        {/* ── THÔNG SỐ KỸ THUẬT ── */}
        <div
          style={{
            marginTop: 40, background: '#fff', borderRadius: 16,
            border: '1px solid #f0f0f0', overflow: 'hidden',
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
          }}
        >
          <div
            style={{
              background: '#001529', padding: '16px 24px',
              display: 'flex', alignItems: 'center', gap: 10,
            }}
          >
            <ThunderboltOutlined style={{ color: '#1677ff', fontSize: 16 }} />
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>
              Thông số kỹ thuật
            </span>
          </div>
          <div style={{ padding: '8px 0' }}>
            {product.specs.map((spec, i) => (
              <div
                key={spec.label}
                style={{
                  display: 'flex', alignItems: 'center',
                  padding: '13px 24px',
                  background: i % 2 === 0 ? '#fafafa' : '#fff',
                  borderBottom: i < product.specs.length - 1 ? '1px solid #f5f5f5' : 'none',
                }}
              >
                <div style={{ width: '40%', fontWeight: 600, color: '#555', fontSize: 14 }}>
                  {spec.label}
                </div>
                <div style={{ width: '60%', color: '#222', fontSize: 14 }}>
                  {spec.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── GHI CHÚ PHÍA DƯỚI ── */}
        <div
          style={{
            marginTop: 24, borderRadius: 12, padding: '16px 20px',
            background: '#fffbe6', border: '1px solid #ffe58f',
          }}
        >
          <Text style={{ fontSize: 13, color: '#7c5800' }}>
            ⚠️ Giá và thông số kỹ thuật có thể thay đổi mà không báo trước. Vui lòng liên hệ bộ phận kinh doanh để được xác nhận chính xác trước khi đặt hàng.
          </Text>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const ProductPage = ({ onCartChange }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch]                 = useState('');
  const [viewMode, setViewMode]             = useState('grid');
  const [page, setPage]                     = useState(1);
  const [cart, setCart]                     = useState([]);
  const [drawerOpen, setDrawerOpen]         = useState(false);

  // ── State mới: trang chi tiết ──
  const [selectedProduct, setSelectedProduct] = useState(null); // null = danh sách, obj = chi tiết

  const { filtered, loading, error } = useProducts(activeCategory, search);

  useEffect(() => { setPage(1); }, [activeCategory, search]);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  );

  const handleAddCart = useCallback((item) => {
    setCart(prev => {
      if (prev.find(p => p.id === item.id)) {
        message.info(`"${item.name}" đã có trong giỏ hàng`);
        return prev;
      }
      const next = [...prev, item];
      onCartChange?.(next.length);
      return next;
    });
    message.success({ content: `Đã thêm "${item.name}" vào giỏ hàng`, duration: 2 });
  }, [onCartChange]);

  const handleRemoveCart = (id) => {
    setCart(prev => {
      const next = prev.filter(p => p.id !== id);
      onCartChange?.(next.length);
      return next;
    });
  };

  const handleRequestConsult = (product) => {
    // 🔌 API: gửi yêu cầu tư vấn về backend hoặc mở modal form
    message.success({
      content: `Yêu cầu tư vấn cho "${product.name}" đã được gửi. Chúng tôi sẽ liên hệ sớm!`,
      duration: 3,
    });
  };

  const cartIds = new Set(cart.map(p => p.id));
  const activeLabel = CATEGORIES.find(c => c.key === activeCategory)?.label ?? 'Tất cả';

  // ── Nếu đang xem chi tiết ──
  if (selectedProduct) {
    return (
      <div style={{ marginTop: 68, minHeight: '100vh', background: '#f5f7fa' }}>
        {/* Page header */}
        <div style={{ background: '#001529', padding: '28px 5%' }}>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 4, letterSpacing: 1 }}>
            VISHIPEL / SẢN PHẨM / CHI TIẾT
          </div>
          <Title level={3} style={{ color: '#fff', margin: 0 }}>
            {selectedProduct.name}
          </Title>
        </div>

        {/* Cart button floating */}
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 100 }}>
          <Badge count={cart.length} size="small">
            <Button
              type="primary"
              shape="circle"
              icon={<ShoppingCartOutlined />}
              size="large"
              onClick={() => setDrawerOpen(true)}
              style={{ width: 52, height: 52, fontSize: 20, boxShadow: '0 4px 16px rgba(22,119,255,0.35)' }}
            />
          </Badge>
        </div>

        <ProductDetail
          product={selectedProduct}
          onBack={() => setSelectedProduct(null)}
          onAddCart={handleAddCart}
          isInCart={cartIds.has(selectedProduct.id)}
          onRequestConsult={handleRequestConsult}
        />

        {/* Cart Drawer */}
        <CartDrawer
          open={drawerOpen}
          cart={cart}
          onClose={() => setDrawerOpen(false)}
          onRemove={handleRemoveCart}
        />
      </div>
    );
  }

  // ── Trang danh sách sản phẩm ──
  return (
    <div style={{ marginTop: 68, minHeight: '100vh', background: '#f5f7fa' }}>

      {/* Page header */}
      <div style={{ background: '#001529', padding: '36px 5%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 4, letterSpacing: 1 }}>
              VISHIPEL / SẢN PHẨM
            </div>
            <Title level={2} style={{ color: '#fff', margin: 0 }}>Khám Phá Thiết Bị Hàng Hải</Title>
          </div>
        </div>
      </div>

      {error && (
        <Alert message={error} type="error" showIcon closable style={{ margin: '16px 5%', borderRadius: 10 }} />
      )}

      <div style={{ padding: '24px 5%' }}>
        <Layout style={{ background: 'transparent', gap: 20 }}>

          {/* Sidebar */}
          <Sider
            width={260}
            style={{
              background: '#fff', borderRadius: 12,
              border: '1px solid #f0f0f0', height: 'fit-content', flexShrink: 0,
            }}
          >
            <FilterSidebar
              active={activeCategory}
              onSelect={setActiveCategory}
              search={search}
              onSearch={setSearch}
            />
          </Sider>

          {/* Product list */}
          <Content>
            {/* Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
              <div>
                <Text strong style={{ fontSize: 15 }}>{activeLabel}</Text>
                {!loading && (
                  <Text type="secondary" style={{ marginLeft: 8 }}>
                    ({filtered.length} sản phẩm)
                  </Text>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Badge count={cart.length} size="small">
                  <Button
                    icon={<ShoppingCartOutlined />}
                    onClick={() => setDrawerOpen(true)}
                    style={{ borderRadius: 8, fontWeight: 600 }}
                  >
                    Giỏ hàng
                  </Button>
                </Badge>
                <Button
                  icon={<AppstoreOutlined />}
                  type={viewMode === 'grid' ? 'primary' : 'default'}
                  onClick={() => setViewMode('grid')}
                  style={{ borderRadius: 8 }}
                />
                <Button
                  icon={<BarsOutlined />}
                  type={viewMode === 'list' ? 'primary' : 'default'}
                  onClick={() => setViewMode('list')}
                  style={{ borderRadius: 8 }}
                />
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <Row gutter={[20, 20]}>
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <Col xs={24} sm={12} md={viewMode === 'grid' ? 8 : 24} key={n}>
                    <ProductCardSkeleton />
                  </Col>
                ))}
              </Row>
            ) : filtered.length === 0 ? (
              <Empty description="Không tìm thấy sản phẩm phù hợp" style={{ padding: '60px 0' }}>
                <Button onClick={() => { setSearch(''); setActiveCategory('all'); }}>Xoá bộ lọc</Button>
              </Empty>
            ) : (
              <>
                <Row gutter={[20, 20]}>
                  {paginated.map(item => (
                    <Col xs={24} sm={12} md={viewMode === 'grid' ? 8 : 24} key={item.id}>
                      <ProductCardGrid
                        item={item}
                        onViewDetail={setSelectedProduct}
                      />
                    </Col>
                  ))}
                </Row>
                <div style={{ textAlign: 'center', marginTop: 40 }}>
                  <Pagination
                    current={page}
                    total={filtered.length}
                    pageSize={PAGE_SIZE}
                    onChange={setPage}
                    showSizeChanger={false}
                    style={{ display: 'inline-block' }}
                  />
                </div>
              </>
            )}
          </Content>
        </Layout>
      </div>

      <CartDrawer
        open={drawerOpen}
        cart={cart}
        onClose={() => setDrawerOpen(false)}
        onRemove={handleRemoveCart}
      />
    </div>
  );
};

// ─── CART DRAWER ──────────────────────────────────────────────────────────────
const CartDrawer = ({ open, cart, onClose, onRemove }) => (
  <Drawer
    title={<span><ShoppingCartOutlined /> Giỏ hàng ({cart.length})</span>}
    placement="right"
    onClose={onClose}
    open={open}
    width={360}
    footer={
      cart.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <Text strong>Tổng cộng:</Text>
            <Text strong style={{ color: '#1677ff', fontSize: 16 }}>
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                cart.reduce((s, p) => s + p.price, 0)
              )}
            </Text>
          </div>
          <Button type="primary" block size="large" style={{ borderRadius: 10, height: 46, fontWeight: 600 }}>
            Đặt hàng
          </Button>
        </div>
      )
    }
  >
    {cart.length === 0 ? (
      <Empty description="Giỏ hàng trống" style={{ paddingTop: 60 }} />
    ) : (
      cart.map(item => (
        <div
          key={item.id}
          style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}
        >
          <img src={item.images[0]} alt={item.name} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
            <div style={{ color: '#1677ff', fontWeight: 700, fontSize: 14 }}>
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
            </div>
          </div>
          <Button
            type="text"
            icon={<CloseOutlined />}
            size="small"
            onClick={() => onRemove(item.id)}
            danger
          />
        </div>
      ))
    )}
  </Drawer>
);

export default ProductPage;
