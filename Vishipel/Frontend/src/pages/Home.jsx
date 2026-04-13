import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Tag, Alert, Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Nhập các mảnh ghép chúng ta vừa tạo
import HeroBanner from '../components/features/home/HeroBanner';
import StatsBar from '../components/features/home/StatsBar';
import ProductCard from '../components/features/product/ProductCard';
import ProductSkeleton from '../components/features/product/ProductSkeleton';

const { Content } = Layout;
const BACKEND_URL = 'https://localhost:7010'; // Đổi port cho khớp với backend của bạn

// HOOK: Fetch dữ liệu
function useHomeData() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/Products');
        
        const realProducts = res.data.map(item => {
          const imagesArray = item.imagesJson ? JSON.parse(item.imagesJson) : [];
          
          let finalImgUrl = 'https://via.placeholder.com/600x400?text=No+Image';
          if (imagesArray.length > 0) {
              const rawPath = imagesArray[0];
              const fileName = rawPath.split('/').pop(); // Tự động lấy tên file (VD: radar-jma5310-1.jpg)
              finalImgUrl = `${BACKEND_URL}/image/${fileName}`; // Ép thêm /image/ vào trước
          }
          
          return {
            id: item.id,
            name: item.name,
            model: item.model,
            type: item.category ? item.category.name : 'Thiết bị',
            typeColor: item.category ? item.category.colorCode : 'blue',
            img: imagesArray.length > 0 ? `${BACKEND_URL}${imagesArray[0]}` : 'https://via.placeholder.com/600x400?text=No+Image',
            status: item.status, // Đưa Trạng thái vào thay thế cho Giá
            ...item
          };
        });

        // Chỉ lấy 4 sản phẩm mới nhất ra trang chủ
        const newestProducts = realProducts
            .sort((a, b) => b.id - a.id) // Sort giảm dần
            .slice(0, 4); // Lấy 4 ông mới nhất

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

  return (
    <Content style={{ marginTop: 68 }}>
      {error && <Alert message={error} type="error" showIcon closable style={{ margin: '16px 5%', borderRadius: 10 }} />}

      {/* HeroBanner không còn phải đợi Loading nữa, load trang là hiện ngay! */}
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
                  {/* Bật cờ isNew={true} để nó hiện ruy-băng đỏ */}
                  <ProductCard item={item} isNew={true} /> 
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