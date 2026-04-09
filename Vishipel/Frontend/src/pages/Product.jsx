import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Layout, Row, Col, Typography, Alert, Empty, Pagination, Badge, Button, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

// Import các mảnh ghép
import FilterSidebar from '../components/features/product/FilterSidebar';
import CartDrawer from '../components/features/product/CartDrawer';
import ProductCard from '../components/features/product/ProductCard';
import ProductSkeleton from '../components/features/product/ProductSkeleton';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

const PAGE_SIZE = 8;
const BACKEND_URL = 'https://localhost:7010'; // Nhớ đổi port cho đúng

// ─── HOOK: Lấy danh sách sản phẩm ───
function useProducts(category, search) {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/Products');

        const realProducts = res.data.map(item => {
          const imagesArray = item.imagesJson ? JSON.parse(item.imagesJson) : [];
          const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price);

          return {
            id: item.id,
            name: item.name,
            model: item.model,
            category: item.category ? item.category.slug : 'all',
            type: item.category ? item.category.name : 'Thiết bị',
            typeColor: item.category ? item.category.colorCode : 'default',
            price: item.price, // Giữ dạng số để tính tổng giỏ hàng
            displayPrice: formattedPrice, // Chuỗi để hiển thị
            img: imagesArray.length > 0 ? `${BACKEND_URL}${imagesArray[0]}` : 'https://via.placeholder.com/600x400?text=No+Image',
            ...item
          };
        });

        setAllProducts(realProducts);
      } catch (err) {
        setError('Không thể tải danh sách sản phẩm. Vui lòng kiểm tra kết nối.');
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

// ─── MAIN COMPONENT ───
const ProductPage = ({ onCartChange }) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch]                 = useState('');
  const [page, setPage]                     = useState(1);
  const [cart, setCart]                     = useState([]);
  const [drawerOpen, setDrawerOpen]         = useState(false);

  const { filtered, loading, error } = useProducts(activeCategory, search);

  // Reset trang về 1 khi đổi bộ lọc
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

  return (
    <div style={{ marginTop: 68, minHeight: '100vh', background: '#f5f7fa' }}>
      
      {/* Page header */}
      <div style={{ background: '#001529', padding: '36px 5%' }}>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 4, letterSpacing: 1 }}>
          VISHIPEL / SẢN PHẨM
        </div>
        <Title level={2} style={{ color: '#fff', margin: 0 }}>Khám Phá Thiết Bị Hàng Hải</Title>
      </div>

      {error && <Alert message={error} type="error" showIcon closable style={{ margin: '16px 5%', borderRadius: 10 }} />}

      <div style={{ padding: '24px 5%' }}>
        <Layout style={{ background: 'transparent', gap: 20 }}>
          
          {/* Sidebar */}
          <Sider width={260} style={{ background: '#fff', borderRadius: 12, border: '1px solid #f0f0f0', height: 'fit-content', flexShrink: 0 }}>
            <FilterSidebar active={activeCategory} onSelect={setActiveCategory} search={search} onSearch={setSearch} />
          </Sider>

          {/* Product list */}
          <Content>
            {/* Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <Text strong style={{ fontSize: 15 }}>
                  {activeCategory === 'all' ? 'Tất cả sản phẩm' : CATEGORIES.find(c => c.key === activeCategory)?.label}
                </Text>
                {!loading && <Text type="secondary" style={{ marginLeft: 8 }}>({filtered.length} sản phẩm)</Text>}
              </div>
              
              <Badge count={cart.length} size="small">
                <Button icon={<ShoppingCartOutlined />} onClick={() => setDrawerOpen(true)} style={{ borderRadius: 8, fontWeight: 600 }}>
                  Giỏ hàng
                </Button>
              </Badge>
            </div>

            {/* Grid Sản Phẩm */}
            {loading ? (
              <Row gutter={[20, 20]}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <ProductSkeleton key={n} />)}
              </Row>
            ) : filtered.length === 0 ? (
              <Empty description="Không tìm thấy sản phẩm phù hợp" style={{ padding: '60px 0' }}>
                <Button onClick={() => { setSearch(''); setActiveCategory('all'); }}>Xoá bộ lọc</Button>
              </Empty>
            ) : (
              <>
                <Row gutter={[20, 20]}>
                  {paginated.map(item => (
                    <Col xs={24} sm={12} md={8} xl={6} key={item.id}>
                      {/* Tái sử dụng ProductCard, ghi đè thuộc tính price để hiện chuỗi */}
                      <ProductCard item={{...item, price: item.displayPrice}} />
                    </Col>
                  ))}
                </Row>
                
                <div style={{ textAlign: 'center', marginTop: 40 }}>
                  <Pagination current={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} showSizeChanger={false} />
                </div>
              </>
            )}
          </Content>
        </Layout>
      </div>

      <CartDrawer open={drawerOpen} cart={cart} onClose={() => setDrawerOpen(false)} onRemove={handleRemoveCart} />
    </div>
  );
};

export default ProductPage;