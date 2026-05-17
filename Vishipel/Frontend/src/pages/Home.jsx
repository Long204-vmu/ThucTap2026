import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Tag, Alert, Button, message } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { BACKEND_ORIGIN } from '../config/api';
import { getProducts } from '../services/productService';

// Nhập các mảnh ghép chúng ta vừa tạo
import HeroBanner from '../components/features/home/HeroBanner';
import StatsBar from '../components/features/home/StatsBar';
import ProductCard from '../components/features/product/ProductCard';
import ProductSkeleton from '../components/features/product/ProductSkeleton';

const { Content } = Layout;

// HOOK: Fetch dữ liệu
function useHomeData() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getProducts();
        
        const realProducts = res.data.map(item => {
          const imagesArray = item.hinhAnhJson ? JSON.parse(item.hinhAnhJson) : [];
          
          let finalImgUrl = 'https://via.placeholder.com/600x400?text=No+Image';
          if (imagesArray.length > 0) {
              const rawPath = imagesArray[0];
              const fileName = rawPath.split('/').pop();
              finalImgUrl = `${BACKEND_ORIGIN}/image/${fileName}`;
          }
          
          return {
            ...item,
            id: item.maThietBi,
            name: item.tenThietBi,
            model: item.model,
            type: item.loaiThietBi ? item.loaiThietBi.tenLoai : 'Thiết bị',
            typeColor: item.loaiThietBi ? item.loaiThietBi.maMau : 'blue',
            img: finalImgUrl,
            status: item.trangThai === 1 ? 'Còn hàng' : 'Ngừng kinh doanh',
          };
        });

        const newestProducts = realProducts
            .sort((a, b) => b.id - a.id)
            .slice(0, 4);

        setProducts(newestProducts);

      } catch (err) {
        setError('Không thể tải dữ liệu từ máy chủ. Vui lòng kiểm tra lại kết nối.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { products, loading, error };
}

// MAIN COMPONENT
const Home = () => {
  const { products, loading, error } = useHomeData();
  const [, setCartCount] = useState(0);

  const handleAddToCart = (product) => {
    const currentCart = JSON.parse(localStorage.getItem('vishipel_cart') || '[]');
    if (currentCart.find(item => item.id === product.id)) {
      message.info(`"${product.name}" đã có trong danh sách yêu cầu`);
      return;
    }
    const next = [...currentCart, {
      id: product.id,
      name: product.name,
      price: product.price || 0,
      img: product.img
    }];
    localStorage.setItem('vishipel_cart', JSON.stringify(next));
    setCartCount(next.length);
    message.success(`Đã thêm "${product.name}" vào danh sách yêu cầu`);
    // Phát sự kiện để Header hoặc các trang khác có thể cập nhật
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <Content>
      {error && <Alert title={error} type="error" showIcon closable style={{ margin: '16px 5%', borderRadius: 10 }} />}

      <HeroBanner />
      <StatsBar />

      <div style={{ padding: '64px 5%', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Tag color="blue" style={{ marginBottom: 12, fontWeight: 600, letterSpacing: 1, fontSize: 11 }}>DANH MỤC SẢN PHẨM</Tag>
          <h2 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 12px', color: '#001529' }}>Sản Phẩm Nổi Bật</h2>
          <p style={{ color: '#8c8c8c', fontSize: 16 }}>Thiết bị hàng hải chính hãng, đáp ứng tiêu chuẩn quốc tế</p>
        </div>

        <Row gutter={[24, 24]}>
          {loading
            ? [1, 2, 3, 4].map(n => <ProductSkeleton key={n} />)
            : products.map(item => (
                <Col xs={24} sm={12} md={6} key={item.id}>
                  <ProductCard item={item} isNew={true} onAdd={handleAddToCart} /> 
                </Col>
              ))}
        </Row>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link to="/products">
            <Button size="large" style={{ height: 48, padding: '0 40px', borderRadius: 10, fontWeight: 600, fontSize: 15, borderColor: '#1677ff', color: '#1677ff' }}>
              Xem tất cả sản phẩm <ArrowRightOutlined />
            </Button>
          </Link>
        </div>
      </div>
    </Content>
  );
};

export default Home;
