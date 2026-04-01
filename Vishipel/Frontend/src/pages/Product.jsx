/**
 * Product.jsx — Trang sản phẩm VISHIPEL EMS_NAV
 * ──────────────────────────────────────────────
 * ✅ API-ready: Tìm comment "🔌 API" để kết nối backend
 * ✅ Filter + Search hoạt động phía client (sau khi có API thì filter server-side)
 * ✅ Loading skeleton + Empty state + Error state
 * ✅ Pagination
 * ✅ Cart state (dễ nâng lên Context/Redux)
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Layout, Row, Col, Card, Button, Typography, Input,
  Tag, Skeleton, Alert, Empty, Pagination, Badge,
  Drawer, message, Tooltip,
} from 'antd';
import {
  FilterOutlined, ShoppingCartOutlined, SearchOutlined,
  AppstoreOutlined, BarsOutlined, CloseOutlined,
} from '@ant-design/icons';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

// ─── MOCK DATA (xoá khi có API) ───────────────────────────────────────────────
const MOCK_PRODUCTS = [
  { id: 1,  name: 'Radar JMA-5200',       category: 'radar',  price: 30000000, img: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=600&fit=crop',  brand: 'JRC',     status: 'Còn hàng' },
  { id: 2,  name: 'AIS FA-170',           category: 'ais',    price: 12000000, img: 'https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?q=80&w=600&fit=crop',  brand: 'Furuno',  status: 'Còn hàng' },
  { id: 3,  name: 'Máy đo sâu FE-800',   category: 'sensor', price: 25000000, img: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=600&fit=crop',  brand: 'Furuno',  status: 'Còn hàng' },
  { id: 4,  name: 'Hải đồ ECDIS JAN-9201',category: 'all',   price: 45000000, img: 'https://images.unsplash.com/photo-1500514960786-8de7943729e2?q=80&w=600&fit=crop',  brand: 'JRC',     status: 'Sắp về' },
  { id: 5,  name: 'Cảm biến gió WS-200', category: 'sensor', price: 8000000,  img: 'https://images.pexels.com/photos/103135/pexels-photo-103135.jpeg?auto=compress&w=600',brand: 'Furuno', status: 'Còn hàng' },
  { id: 6,  name: 'Radar JMA-5310',       category: 'radar',  price: 38000000, img: 'https://images.unsplash.com/photo-1549497538-303791108f94?q=80&w=600&fit=crop',  brand: 'JRC',     status: 'Còn hàng' },
  { id: 7,  name: 'AIS FA-150',           category: 'ais',    price: 9500000,  img: 'https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?q=80&w=600&fit=crop',  brand: 'Furuno',  status: 'Còn hàng' },
  { id: 8,  name: 'Ăng-ten AV-17HB',     category: 'spare',  price: 2500000,  img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&fit=crop',  brand: 'JRC',     status: 'Còn hàng' },
];

const CATEGORIES = [
  { key: 'all',    label: 'Tất cả sản phẩm', color: 'default' },
  { key: 'radar',  label: 'Máy Radar',        color: 'blue'    },
  { key: 'ais',    label: 'Thiết bị AIS',     color: 'cyan'    },
  { key: 'sensor', label: 'Cảm biến & Đo sâu',color: 'green'   },
  { key: 'spare',  label: 'Phụ kiện',         color: 'orange'  },
];

const PAGE_SIZE = 6;
// ──────────────────────────────────────────────────────────────────────────────

// Định dạng tiền VNĐ
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

        // 🔌 API INTEGRATION — thay khối dưới bằng:
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
  }, []); // Nếu dùng API server-side filter: thêm [category, search] vào dependency

  // Client-side filter (chỉ dùng khi API chưa hỗ trợ filter)
  const filtered = useMemo(() => {
    return allProducts.filter(p => {
      const matchCat    = category === 'all' || p.category === category;
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [allProducts, category, search]);

  return { filtered, loading, error };
}
// ──────────────────────────────────────────────────────────────────────────────

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

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

const ProductCardGrid = ({ item, onAddCart, isInCart }) => {
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
            src={item.img}
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
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: '#001529' }}>
        {item.name}
      </div>
      <div style={{ color: '#1677ff', fontWeight: 700, fontSize: 17, marginBottom: 14 }}>
        {formatPrice(item.price)}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Tooltip title={isInCart ? 'Đã có trong giỏ' : 'Thêm vào giỏ hàng'}>
          <Button
            type={isInCart ? 'default' : 'primary'}
            icon={<ShoppingCartOutlined />}
            onClick={() => onAddCart(item)}
            block
            style={{ borderRadius: 8, fontWeight: 600, height: 38 }}
          >
            {isInCart ? 'Đã thêm' : 'Thêm vào giỏ'}
          </Button>
        </Tooltip>
      </div>
    </Card>
  );
};

const ProductCardSkeleton = () => (
  <Card style={{ borderRadius: 12, overflow: 'hidden' }}>
    <Skeleton.Image active style={{ width: '100%', height: 180 }} />
    <Skeleton active paragraph={{ rows: 3 }} style={{ marginTop: 12 }} />
  </Card>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const ProductPage = ({ onCartChange }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch]                 = useState('');
  const [viewMode, setViewMode]             = useState('grid'); // 'grid' | 'list'
  const [page, setPage]                     = useState(1);
  const [cart, setCart]                     = useState([]);
  const [drawerOpen, setDrawerOpen]         = useState(false); // mobile filter

  const { filtered, loading, error } = useProducts(activeCategory, search);

  // Reset về trang 1 khi filter thay đổi
  useEffect(() => { setPage(1); }, [activeCategory, search]);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  );

  const handleAddCart = useCallback((item) => {
    setCart(prev => {
      if (prev.find(p => p.id === item.id)) return prev; // tránh duplicate
      const next = [...prev, item];
      onCartChange?.(next.length); // 🔌 gửi số lượng lên Header/Context
      return next;
    });
    message.success({
      content: `Đã thêm "${item.name}" vào giỏ hàng`,
      duration: 2,
    });
  }, [onCartChange]);

  const handleRemoveCart = (id) => {
    setCart(prev => {
      const next = prev.filter(p => p.id !== id);
      onCartChange?.(next.length);
      return next;
    });
  };

  const cartIds = new Set(cart.map(p => p.id));

  const activeLabel = CATEGORIES.find(c => c.key === activeCategory)?.label ?? 'Tất cả';

  return (
    <div style={{ marginTop: 68, minHeight: '100vh', background: '#f5f7fa' }}>

      {/* ── Page header ─────────────────────────────────────────── */}
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

          {/* ── Sidebar ─────────────────────────────────────────── */}
          <Sider
            width={260}
            style={{
              background: '#fff',
              borderRadius: 12,
              border: '1px solid #f0f0f0',
              height: 'fit-content',
              flexShrink: 0,
            }}
          >
            <FilterSidebar
              active={activeCategory}
              onSelect={setActiveCategory}
              search={search}
              onSearch={setSearch}
            />
          </Sider>

          {/* ── Product list ─────────────────────────────────────── */}
          <Content>
            {/* Toolbar */}
            <div
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: 20, flexWrap: 'wrap', gap: 8,
              }}
            >
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

            {/* Product grid */}
            {loading ? (
              <Row gutter={[20, 20]}>
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <Col xs={24} sm={12} md={viewMode === 'grid' ? 8 : 24} key={n}>
                    <ProductCardSkeleton />
                  </Col>
                ))}
              </Row>
            ) : filtered.length === 0 ? (
              <Empty
                description={<span>Không tìm thấy sản phẩm phù hợp</span>}
                style={{ padding: '60px 0' }}
              >
                <Button onClick={() => { setSearch(''); setActiveCategory('all'); }}>
                  Xoá bộ lọc
                </Button>
              </Empty>
            ) : (
              <>
                <Row gutter={[20, 20]}>
                  {paginated.map(item => (
                    <Col xs={24} sm={12} md={viewMode === 'grid' ? 8 : 24} key={item.id}>
                      <ProductCardGrid
                        item={item}
                        onAddCart={handleAddCart}
                        isInCart={cartIds.has(item.id)}
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

      {/* ── Cart Drawer ───────────────────────────────────────────── */}
      <Drawer
        title={<span><ShoppingCartOutlined /> Giỏ hàng ({cart.length})</span>}
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={360}
        footer={
          cart.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text strong>Tổng cộng:</Text>
                <Text strong style={{ color: '#1677ff', fontSize: 16 }}>
                  {formatPrice(cart.reduce((s, p) => s + p.price, 0))}
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
              style={{
                display: 'flex', gap: 12, alignItems: 'center',
                padding: '12px 0', borderBottom: '1px solid #f5f5f5',
              }}
            >
              <img src={item.img} alt={item.name} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
                <div style={{ color: '#1677ff', fontWeight: 700, fontSize: 14 }}>{formatPrice(item.price)}</div>
              </div>
              <Button
                type="text"
                icon={<CloseOutlined />}
                size="small"
                onClick={() => handleRemoveCart(item.id)}
                danger
              />
            </div>
          ))
        )}
      </Drawer>
    </div>
  );
};

export default ProductPage;
