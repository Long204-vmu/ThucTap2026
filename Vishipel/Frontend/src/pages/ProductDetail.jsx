import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Row, Col, Button, Typography, Tag, Spin, Empty, 
  Breadcrumb, message, Alert, Rate 
} from 'antd';
import { 
  ShoppingCartOutlined, ArrowLeftOutlined, PhoneOutlined, 
  CheckCircleOutlined, SafetyCertificateOutlined, 
  ThunderboltOutlined, GlobalOutlined 
} from '@ant-design/icons';

// Import component chúng ta vừa tách ra
import ImageSlider from '../components/features/product/ImageSlider';

const { Title, Text, Paragraph } = Typography;

// KHAI BÁO ĐỊA CHỈ BACKEND (Đổi port cho đúng với máy bạn)
const BACKEND_URL = 'https://localhost:7010';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Định dạng tiền tệ
  const formatPrice = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        // Gọi API lấy dữ liệu theo ID
        const res = await axios.get(`/api/Products/${id}`);
        const data = res.data;
        
        // Parse dữ liệu JSON từ SQL Server và gắn tiền tố ảnh
        data.images = data.imagesJson 
          ? JSON.parse(data.imagesJson).map(img => `${BACKEND_URL}${img}`) 
          : ['https://via.placeholder.com/600x400?text=No+Image'];
          
        data.specs = data.specsJson ? JSON.parse(data.specsJson) : [];
        data.certs = data.certificationsJson ? JSON.parse(data.certificationsJson) : [];
        
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error("Lỗi lấy chi tiết sản phẩm:", err);
        setError('Không thể tìm thấy sản phẩm hoặc có lỗi kết nối.');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchDetail();
    }
  }, [id]);

  const handleAddCart = () => {
    message.success({ content: `Đã thêm "${product.name}" vào giỏ hàng`, duration: 2 });
    // Ở đây sau này bạn có thể gọi hàm cập nhật state giỏ hàng tổng
  };

  const handleRequestConsult = () => {
    message.success({
      content: `Yêu cầu tư vấn cho "${product.name}" đã được gửi. Chúng tôi sẽ liên hệ sớm!`,
      duration: 3,
    });
  };

  if (loading) {
    return (
      <div style={{ marginTop: 68, minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spin size="large" tip="Đang tải thông tin sản phẩm..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ marginTop: 68, padding: '100px 5%' }}>
        <Empty description={error || "Không tìm thấy sản phẩm"} />
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Button type="primary" onClick={() => navigate('/products')}>Quay lại danh sách</Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 68, minHeight: '100vh', background: '#f5f7fa', paddingBottom: 60 }}>
      
      {/* Breadcrumb Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '16px 5%' }}>
        <Breadcrumb
          items={[
            { title: 'Trang chủ', onClick: () => navigate('/'), className: 'cursor-pointer' },
            { title: 'Sản phẩm', onClick: () => navigate('/products'), className: 'cursor-pointer' },
            { title: product.name },
          ]}
        />
      </div>

      <div style={{ padding: '32px 5%', maxWidth: 1400, margin: '0 auto' }}>
        
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(-1)} 
          style={{ marginBottom: 24, borderRadius: 8, fontWeight: 500 }}
        >
          Quay lại danh sách
        </Button>

        <Row gutter={[48, 32]}>
          {/* CỘT TRÁI: KHỐI HÌNH ẢNH SẢN PHẨM */}
          <Col xs={24} md={10} lg={11}>
            <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #f0f0f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', position: 'relative', padding: 16 }}>
              <ImageSlider images={product.images} alt={product.name} />
              <Tag
                color={product.status === 'Còn hàng' ? 'green' : 'orange'}
                style={{ position: 'absolute', top: 24, left: 24, fontWeight: 700, fontSize: 13, padding: '6px 12px', zIndex: 3 }}
              >
                {product.status}
              </Tag>
            </div>

            {/* Chứng nhận */}
            {product.certs && product.certs.length > 0 && (
              <div style={{ marginTop: 20, background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 12, padding: '16px 20px' }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#389e0d', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <SafetyCertificateOutlined />
                  Chứng nhận & Tiêu chuẩn Quốc tế
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {product.certs.map(c => (
                    <Tag key={c} color="green" style={{ fontWeight: 600, padding: '4px 8px' }}>{c}</Tag>
                  ))}
                </div>
              </div>
            )}
          </Col>

          {/* CỘT PHẢI: KHỐI THÔNG TIN SẢN PHẨM */}
          <Col xs={24} md={14} lg={13}>
            <div style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
              
              {/* Tên & Brand */}
              <div style={{ fontSize: 13, color: '#8c8c8c', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
                Thương hiệu: <span style={{ color: '#1677ff' }}>{product.brand}</span>
              </div>
              <Title level={2} style={{ margin: '0 0 12px', color: '#001529', fontWeight: 700 }}>
                {product.name}
              </Title>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                <Rate disabled defaultValue={product.rating} style={{ fontSize: 15 }} />
                <Text type="secondary" style={{ fontSize: 14 }}>
                  {product.rating}/5 ({product.reviewCount} đánh giá)
                </Text>
              </div>

              {/* Box Giá & Bảo hành */}
              <div style={{ background: 'linear-gradient(135deg, #e6f4ff 0%, #f0f5ff 100%)', borderRadius: 12, padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #bae0ff' }}>
                <div>
                  <div style={{ fontSize: 13, color: '#5c8bb8', marginBottom: 4, fontWeight: 500 }}>Giá niêm yết</div>
                  <div style={{ color: '#0050b3', fontWeight: 800, fontSize: 32 }}>
                    {formatPrice(product.price)}
                  </div>
                </div>
                <div style={{ textAlign: 'right', borderLeft: '1px solid #bae0ff', paddingLeft: 24 }}>
                  <div style={{ fontSize: 13, color: '#5c8bb8', marginBottom: 4, fontWeight: 500 }}>Chế độ bảo hành</div>
                  <div style={{ fontWeight: 700, color: '#389e0d', fontSize: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircleOutlined /> {product.warranty}
                  </div>
                </div>
              </div>

              <Paragraph style={{ color: '#444', lineHeight: 1.8, marginBottom: 24, fontSize: 15 }}>
                {product.description}
              </Paragraph>

              {/* Icons đặc điểm */}
              <div style={{ display: 'flex', gap: 20, marginBottom: 32, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#555', background: '#fafafa', padding: '8px 16px', borderRadius: 8 }}>
                  <GlobalOutlined style={{ color: '#1677ff', fontSize: 16 }} />
                  Xuất xứ: <strong>{product.origin}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#555', background: '#fafafa', padding: '8px 16px', borderRadius: 8 }}>
                  <ThunderboltOutlined style={{ color: '#fa8c16', fontSize: 16 }} />
                  Lắp đặt toàn quốc
                </div>
              </div>

              {/* Các nút hành động */}
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <Button 
                  size="large" 
                  icon={<PhoneOutlined />} 
                  onClick={handleRequestConsult}
                  style={{ flex: 1, minWidth: 200, height: 54, borderRadius: 12, fontWeight: 700, borderColor: '#1677ff', color: '#1677ff', fontSize: 16 }}
                >
                  Yêu cầu tư vấn kỹ thuật
                </Button>
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<ShoppingCartOutlined />} 
                  onClick={handleAddCart}
                  disabled={product.status !== 'Còn hàng'}
                  style={{ flex: 1, minWidth: 200, height: 54, borderRadius: 12, fontWeight: 700, fontSize: 16, boxShadow: '0 4px 14px rgba(22,119,255,0.3)' }}
                >
                  Thêm vào giỏ hàng
                </Button>
              </div>

              {product.status !== 'Còn hàng' && (
                <Alert message="Sản phẩm đang được nhập về kho — Quý khách vui lòng liên hệ trực tiếp để đặt trước." type="warning" showIcon style={{ marginTop: 16, borderRadius: 8 }} />
              )}
            </div>
          </Col>
        </Row>

        {/* CỘT THÔNG SỐ KỸ THUẬT (FULL WIDTH) */}
        <div style={{ marginTop: 48, background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          <div style={{ background: '#001529', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <ThunderboltOutlined style={{ color: '#1677ff', fontSize: 18 }} />
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 18, letterSpacing: 0.5 }}>
              Thông số kỹ thuật chi tiết
            </span>
          </div>
          <div style={{ padding: '8px 0' }}>
            {product.specs && product.specs.length > 0 ? (
              product.specs.map((spec, i) => (
                <div key={spec.label} style={{ display: 'flex', alignItems: 'flex-start', padding: '16px 32px', background: i % 2 === 0 ? '#fafafa' : '#fff', borderBottom: i < product.specs.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                  <div style={{ width: '35%', fontWeight: 600, color: '#555', fontSize: 15 }}>
                    {spec.label}
                  </div>
                  <div style={{ width: '65%', color: '#222', fontSize: 15, lineHeight: 1.6 }}>
                    {spec.value}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '32px', textAlign: 'center', color: '#8c8c8c' }}>Đang cập nhật thông số kỹ thuật...</div>
            )}
          </div>
        </div>

        {/* GHI CHÚ PHÁP LÝ */}
        <div style={{ marginTop: 32, borderRadius: 12, padding: '16px 24px', background: '#fffbe6', border: '1px solid #ffe58f' }}>
          <Text style={{ fontSize: 13, color: '#7c5800', lineHeight: 1.6 }}>
            <strong>Lưu ý:</strong> Giá cả, thông số kỹ thuật và tính năng của sản phẩm có thể được cập nhật hoặc thay đổi từ nhà sản xuất mà không cần báo trước. Quý đối tác vui lòng liên hệ bộ phận kinh doanh của Vishipel để được xác nhận chính xác các thông tin pháp lý và kỹ thuật trước khi đặt hàng.
          </Text>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;