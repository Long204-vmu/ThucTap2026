import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Row, Col, Typography, Alert, Empty, Pagination, Badge, Button, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

// Import các mảnh ghép
import FilterSidebar from '../components/features/product/FilterSidebar';
import CartDrawer from '../components/features/product/CartDrawer';
import ProductCard from '../components/features/product/ProductCard';
import ProductSkeleton from '../components/features/product/ProductSkeleton';
import apiClient from '../services/apiClient';
import { BACKEND_ORIGIN } from '../config/api';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

const PAGE_SIZE = 8;

// ─── HOOK: Lấy danh sách sản phẩm và danh mục ───
function useProductData(category, search) {
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories]   = useState([{ key: 'all', label: 'Tất cả sản phẩm' }]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. GỌI SONG SONG 2 API (SẢN PHẨM VÀ DANH MỤC TYPE=PRODUCT)
        const [prodRes, catRes] = await Promise.all([
            apiClient.get('/api/Products'),
            apiClient.get('/api/Categories?type=Product') // Lấy chuẩn danh mục thiết bị
        ]);

        // 2. CHUẨN BỊ DANH SÁCH DANH MỤC TRƯỚC
        let uniqueCategoryMap = new Map();
        uniqueCategoryMap.set('all', 'Tất cả sản phẩm');
        
        // Nhét các danh mục chuẩn (Product) từ API vào Map
        if (catRes.data && Array.isArray(catRes.data)) {
            catRes.data.forEach(c => {
                 uniqueCategoryMap.set(String(c.id), c.name); 
            });
        }

        // 3. XỬ LÝ DỮ LIỆU SẢN PHẨM (VÀ KHỚP VỚI DANH MỤC TRÊN)
        const realProducts = prodRes.data.map(item => {
          const imagesArray = item.imagesJson ? JSON.parse(item.imagesJson) : [];
          
          // An toàn: Lấy ID danh mục, nếu không có thì gán là 'uncategorized'
          let catKey = item.category ? String(item.category.id) : 'uncategorized';
          let catName = item.category ? item.category.name : 'Chưa phân loại';

          // BƯỚC BẢO VỆ: Nếu sản phẩm này đang mang một ID danh mục KHÔNG CÓ trong danh sách danh mục Product
          // (ví dụ: nó lỡ bị gán nhầm vào danh mục Service), thì chúng ta tạm thời hiển thị nó là 'Khác'
          if (catKey !== 'uncategorized' && !uniqueCategoryMap.has(catKey)) {
              catKey = 'uncategorized';
              catName = 'Thiết bị khác (Sai danh mục)';
          }

          let finalImgUrl = 'https://via.placeholder.com/600x400?text=No+Image';
          if (imagesArray.length > 0) {
              const rawPath = imagesArray[0];
              const fileName = rawPath.split('/').pop();
              finalImgUrl = `${BACKEND_ORIGIN}/image/${fileName}`;
          }
          
          return {
            ...item,
            id: item.id,
            name: item.name,
            model: item.model,
            categoryId: catKey, 
            categoryName: catName,
            type: catName,
            typeColor: item.category ? item.category.colorCode : 'default',
            status: item.status, 
            img: finalImgUrl,
          };
        });

        // Nếu có sản phẩm rơi vào 'uncategorized', hiển thị thêm mục "Chưa phân loại / Khác" trên Sidebar
        const hasUncategorized = realProducts.some(p => p.categoryId === 'uncategorized');
        if (hasUncategorized) {
            uniqueCategoryMap.set('uncategorized', 'Chưa phân loại / Khác');
        }

        // Chuyển Map thành mảng để Sidebar render
        const finalCategories = Array.from(uniqueCategoryMap, ([key, label]) => ({ key, label }));

        setCategories(finalCategories);
        setAllProducts(realProducts);

      } catch (err) {
        console.error("Lỗi API Product.jsx:", err);
        setError('Không thể tải danh sách sản phẩm. Vui lòng kiểm tra kết nối.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 3. THUẬT TOÁN LỌC (Đã an toàn)
  const filtered = useMemo(() => {
    return allProducts.filter(p => {
      const matchCat    = category === 'all' || String(p.categoryId) === String(category);
      // Kiểm tra name có null/undefined không trước khi .toLowerCase()
      const matchSearch = !search || (p.name && p.name.toLowerCase().includes(search.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [allProducts, category, search]);

  return { filtered, categories, loading, error };
}

// ─── MAIN COMPONENT ───
const ProductPage = ({ onCartChange }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch]                 = useState('');
  const [page, setPage]                     = useState(1);
  const [cart, setCart]                     = useState([]);
  const [drawerOpen, setDrawerOpen]         = useState(false);

  const { filtered, categories, loading, error } = useProductData(activeCategory, search);

  // Reset trang về 1 khi đổi bộ lọc
  useEffect(() => { setPage(1); }, [activeCategory, search]);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  );

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
            <FilterSidebar 
                active={activeCategory} 
                onSelect={setActiveCategory} 
                search={search} 
                onSearch={setSearch} 
                categories={categories} 
            />
          </Sider>

          {/* Product list */}
          <Content>
            {/* Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <Text strong style={{ fontSize: 15 }}>
                  {categories.find(c => c.key === activeCategory)?.label || 'Sản phẩm'}
                </Text>
                {!loading && <Text type="secondary" style={{ marginLeft: 8 }}>({filtered.length} sản phẩm)</Text>}
              </div>
              
              <Badge count={cart.length} size="small">
                <Button icon={<ShoppingCartOutlined />} onClick={() => setDrawerOpen(true)} style={{ borderRadius: 8, fontWeight: 600 }}>
                  Danh sách yêu cầu
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
                      <ProductCard item={item} />
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