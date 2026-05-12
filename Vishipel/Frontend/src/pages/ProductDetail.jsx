import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Row, Col, Button, Typography, Tag, Spin, Empty, 
  Breadcrumb, message, Alert 
} from 'antd';
import { 
  ShoppingCartOutlined, ArrowLeftOutlined, PhoneOutlined, 
  CheckCircleOutlined, SafetyCertificateOutlined, 
  ThunderboltOutlined, GlobalOutlined 
} from '@ant-design/icons';

// Import component slider ảnh
import ImageSlider from '../components/features/product/ImageSlider';
import { BACKEND_ORIGIN } from '../config/api';
import { getProductById } from '../services/productService';

const { Title, Text, Paragraph } = Typography;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        // Gọi API lấy dữ liệu theo ID
        const res = await getProductById(id);
        const data = res.data;
        
        // Parse dữ liệu JSON từ SQL Server và gắn tiền tố ảnh
        data.images = data.imagesJson 
          ? JSON.parse(data.imagesJson).map(img => {
              const fileName = img.split('/').pop();
              return `${BACKEND_ORIGIN}/image/${fileName}`;
            }) 
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
    // Lấy giỏ hàng hiện tại từ localStorage
    const currentCart = JSON.parse(localStorage.getItem('vishipel_cart') || '[]');
    
    // Kiểm tra xem sản phẩm đã có trong giỏ chưa
    if (!currentCart.find(item => item.id === product.id)) {
        // Lưu các thông tin cần thiết vào giỏ
        currentCart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            img: product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/150'
        });
        localStorage.setItem('vishipel_cart', JSON.stringify(currentCart));
    }
    
    message.success({ content: `Đã thêm "${product.name}" vào danh sách yêu cầu`, duration: 2 });
  };

  const handleRequestConsult = () => {
    navigate('/contact');
  };

  if (loading) {
    return (
      <div style={{ marginTop: 68, minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spin size="large" description="Đang tải thông tin thiết bị..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ marginTop: 68, padding: '100px 5%' }}>
        <Empty description={error || "Không tìm thấy thiết bị"} />
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
            { title: 'Thiết bị', onClick: () => navigate('/products'), className: 'cursor-pointer' },
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
              <Title level={2} style={{ margin: '0 0 24px', color: '#001529', fontWeight: 700 }}>
                {product.name}
              </Title>

              {/* Box Trạng thái & Bảo hành mới */}
              <div style={{ background: '#f6ffed', borderRadius: 12, padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #b7eb8f' }}>
                <div>
                  <div style={{ fontSize: 13, color: '#389e0d', marginBottom: 4, fontWeight: 500 }}>Trạng thái hiện tại</div>
                  <div style={{ color: '#237804', fontWeight: 800, fontSize: 20 }}>
                    {product.status || 'Đang cập nhật'}
                  </div>
                </div>
                <div style={{ textAlign: 'right', borderLeft: '1px solid #b7eb8f', paddingLeft: 24 }}>
                  <div style={{ fontSize: 13, color: '#389e0d', marginBottom: 4, fontWeight: 500 }}>Chế độ bảo hành</div>
                  <div style={{ fontWeight: 700, color: '#237804', fontSize: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircleOutlined /> {product.warranty || 'Liên hệ chi tiết'}
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
                  Xuất xứ: <strong>{product.origin || 'Đang cập nhật'}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#555', background: '#fafafa', padding: '8px 16px', borderRadius: 8 }}>
                  <ThunderboltOutlined style={{ color: '#fa8c16', fontSize: 16 }} />
                  Lắp đặt & Hỗ trợ kỹ thuật toàn quốc
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
                  Thêm vào danh sách yêu cầu
                </Button>
              </div>

              {product.status !== 'Còn hàng' && (
                <Alert title="Thiết bị hiện đang chờ nhập kho hoặc bảo trì — Quý khách vui lòng yêu cầu tư vấn để biết thêm chi tiết." type="warning" showIcon style={{ marginTop: 16, borderRadius: 8 }} />
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
            <strong>Lưu ý:</strong> Giá cả, thông số kỹ thuật và tính năng của sản phẩm có thể được cập nhật hoặc thay đổi từ nhà sản xuất mà không cần báo trước. Quý đối tác vui lòng liên hệ bộ phận kỹ thuật của Vishipel để được xác nhận chính xác các thông tin pháp lý và kỹ thuật trước khi triển khai.
          </Text>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;