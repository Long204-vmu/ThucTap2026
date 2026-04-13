import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Row, Col, Button, Typography, Tag, Spin, Empty, 
  Breadcrumb, message, Alert, Card, Divider 
} from 'antd';
import { 
  ArrowLeftOutlined, PhoneOutlined, 
  SafetyCertificateOutlined, 
  AuditOutlined, CustomerServiceOutlined,
  ContainerOutlined, EnvironmentOutlined
} from '@ant-design/icons';

// Tái sử dụng Slider ảnh
import ImageSlider from '../components/features/product/ImageSlider';
import { BACKEND_ORIGIN } from '../config/api';
import { getServiceById } from '../services/serviceService';

const { Title, Text, Paragraph } = Typography;

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await getServiceById(id);
        const data = res.data;
        
        // Chuẩn hóa ảnh
        data.images = data.imagesJson 
          ? JSON.parse(data.imagesJson).map(img => {
              const fileName = img.split('/').pop();
              return `${BACKEND_ORIGIN}/image/${fileName}`;
            }) 
          : ['https://via.placeholder.com/600x400?text=Service+Image'];
          
        data.specs = data.specsJson ? JSON.parse(data.specsJson) : [];
        setService(data);
      } catch (err) {
        message.error('Không thể tải thông tin dịch vụ');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleConsult = () => {
    message.success({
      content: 'Yêu cầu tư vấn dịch vụ đã được gửi. Vishipel sẽ liên hệ bạn trong vòng 24h!',
      duration: 4,
    });
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: 150 }}><Spin size="large" tip="Đang tải quy trình dịch vụ..." /></div>;
  if (!service) return <div style={{ marginTop: 100 }}><Empty description="Không tìm thấy dịch vụ" /></div>;

  return (
    <div style={{ marginTop: 68, minHeight: '100vh', background: '#f0f2f5', paddingBottom: 60 }}>
      {/* Thanh điều hướng */}
      <div style={{ background: '#fff', padding: '16px 5%', borderBottom: '1px solid #e8e8e8' }}>
        <Breadcrumb items={[
          { title: 'Trang chủ', onClick: () => navigate('/') },
          { title: 'Dịch vụ', onClick: () => navigate('/services') },
          { title: service.name }
        ]} />
      </div>

      <div style={{ padding: '32px 5%', maxWidth: 1400, margin: '0 auto' }}>
        <Row gutter={[40, 32]}>
          {/* CỘT TRÁI: HÌNH ẢNH & CHỨNG CHỈ */}
          <Col xs={24} lg={10}>
            <Card bordered={false} style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <ImageSlider images={service.images} alt={service.name} />
            </Card>

            <div style={{ marginTop: 24, padding: '20px', background: '#e6f7ff', borderRadius: 12, border: '1px solid #91d5ff' }}>
              <Title level={5} style={{ color: '#0050b3', marginBottom: 12 }}>
                <SafetyCertificateOutlined /> Tiêu chuẩn kỹ thuật
              </Title>
              <Text type="secondary">
                Dịch vụ được thực hiện bởi đội ngũ kỹ thuật viên Vishipel có chứng chỉ quốc tế, đảm bảo độ chính xác và an toàn tuyệt đối theo tiêu chuẩn hàng hải.
              </Text>
            </div>
          </Col>

          {/* CỘT PHẢI: CHI TIẾT DỊCH VỤ */}
          <Col xs={24} lg={14}>
            <div style={{ background: '#fff', padding: '40px', borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <Tag color="blue" style={{ marginBottom: 16 }}>{service.category?.name || 'Dịch vụ hàng hải'}</Tag>
              <Title level={2} style={{ marginTop: 0, marginBottom: 24 }}>{service.name}</Title>
              
              <Paragraph style={{ fontSize: 16, lineHeight: 1.8, color: '#444' }}>
                {service.description || "Đang cập nhật nội dung chi tiết cho dịch vụ này..."}
              </Paragraph>

              <Divider />

              {/* Thông số/Quy trình dịch vụ (Render động từ SpecsJson) */}
              <Title level={4} style={{ marginBottom: 20 }}><AuditOutlined /> Chi tiết triển khai</Title>
              <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
                {service.specs.map(spec => (
                  <Col span={12} key={spec.label}>
                    <div style={{ padding: '12px', background: '#fafafa', borderRadius: 8 }}>
                      <div style={{ color: '#8c8c8c', fontSize: 12 }}>{spec.label}</div>
                      <div style={{ fontWeight: 600, color: '#262626' }}>{spec.value}</div>
                    </div>
                  </Col>
                ))}
              </Row>

              {/* Nút hành động */}
              <div style={{ display: 'flex', gap: 16 }}>
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<CustomerServiceOutlined />} 
                  onClick={handleConsult}
                  style={{ height: 50, flex: 1, borderRadius: 8, fontWeight: 600, background: '#001529' }}
                >
                  Đăng ký dịch vụ ngay
                </Button>
                <Button 
                  size="large" 
                  icon={<PhoneOutlined />} 
                  href="tel:0123456789"
                  style={{ height: 50, width: 200, borderRadius: 8, fontWeight: 600 }}
                >
                  Hotline hỗ trợ
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ServiceDetail;