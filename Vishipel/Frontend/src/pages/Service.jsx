import React, { useState, useMemo } from 'react';
import { Layout, Row, Col, Typography, Input, Card, Tag, Button, Empty, Pagination } from 'antd';
import { SearchOutlined, FilterOutlined, ToolOutlined, ArrowRightOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

const PAGE_SIZE = 6;

// 1. DANH MỤC DỊCH VỤ
const SERVICE_CATEGORIES = [
  { key: 'all',          label: 'Tất cả dịch vụ',  color: 'default' },
  { key: 'installation', label: 'Thi công & Lắp đặt', color: 'blue' },
  { key: 'maintenance',  label: 'Bảo dưỡng & Sửa chữa',color: 'orange' },
  { key: 'inspection',   label: 'Kiểm định vô tuyến', color: 'green' },
  { key: 'consulting',   label: 'Tư vấn giải pháp',   color: 'cyan' },
];

// 2. DỮ LIỆU GIẢ LẬP (MOCK DATA) - Thay bằng API sau
const MOCK_SERVICES = [
  { id: 1, name: 'Lắp đặt Hệ thống Radar', category: 'installation', typeColor: 'blue', typeName: 'Thi công & Lắp đặt', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=600&fit=crop', price: 'Liên hệ báo giá', shortDesc: 'Thi công lắp đặt, đấu nối và hiệu chỉnh hệ thống Radar hàng hải theo tiêu chuẩn IMO.' },
  { id: 2, name: 'Bảo dưỡng thiết bị AIS định kỳ', category: 'maintenance', typeColor: 'orange', typeName: 'Bảo dưỡng', img: 'https://images.unsplash.com/photo-1504917595217-d4bf500f4820?q=80&w=600&fit=crop', price: 'Từ 2.000.000 ₫', shortDesc: 'Kiểm tra, vệ sinh và nâng cấp phần mềm cho thiết bị nhận dạng tự động AIS.' },
  { id: 3, name: 'Kiểm định An toàn Vô tuyến điện', category: 'inspection', typeColor: 'green', typeName: 'Kiểm định', img: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=600&fit=crop', price: 'Theo quy định', shortDesc: 'Đo đạc, cấp chứng nhận an toàn kỹ thuật vô tuyến điện cho tàu biển.' },
  { id: 4, name: 'Tư vấn Hệ thống ECDIS', category: 'consulting', typeColor: 'cyan', typeName: 'Tư vấn', img: 'https://images.unsplash.com/photo-1500514960786-8de7943729e2?q=80&w=600&fit=crop', price: 'Miễn phí', shortDesc: 'Tư vấn lựa chọn, thiết kế bản vẽ lắp đặt hệ thống hải đồ điện tử ECDIS.' },
  { id: 5, name: 'Sửa chữa GMDSS lưu động', category: 'maintenance', typeColor: 'orange', typeName: 'Sửa chữa', img: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=600&fit=crop', price: 'Liên hệ báo giá', shortDesc: 'Đội ngũ kỹ sư cơ động 24/7 khắc phục sự cố thông tin liên lạc GMDSS tại cảng.' },
];

const ServicePage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch]                 = useState('');
  const [page, setPage]                     = useState(1);

  // 3. LOGIC LỌC DỮ LIỆU
  const filteredServices = useMemo(() => {
    return MOCK_SERVICES.filter(item => {
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, search]);

  const paginatedServices = useMemo(() => {
    return filteredServices.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  }, [filteredServices, page]);

  return (
    <div style={{ marginTop: 68, minHeight: '100vh', background: '#f5f7fa' }}>
      {/* Header Banner */}
      <div style={{ background: 'linear-gradient(135deg, #001529 0%, #003a70 100%)', padding: '40px 5%' }}>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 8, letterSpacing: 1 }}>
          VISHIPEL / DỊCH VỤ
        </div>
        <Title level={2} style={{ color: '#fff', margin: 0 }}>Giải Pháp Kỹ Thuật Hàng Hải</Title>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, marginTop: 12, maxWidth: 600 }}>
          Đội ngũ kỹ sư chuyên nghiệp, phục vụ 24/7 tại các cảng biển trên toàn quốc. Đảm bảo an toàn và tuân thủ các quy chuẩn quốc tế.
        </p>
      </div>

      <div style={{ padding: '32px 5%', maxWidth: 1400, margin: '0 auto' }}>
        <Layout style={{ background: 'transparent', gap: 24 }}>
          
          {/* CỘT TRÁI: BỘ LỌC */}
          <Sider width={280} style={{ background: '#fff', borderRadius: 12, padding: '24px 20px', border: '1px solid #f0f0f0', height: 'fit-content' }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FilterOutlined style={{ color: '#1677ff' }} /> Lọc dịch vụ
            </div>
            <Input
              placeholder="Tìm kiếm dịch vụ..."
              prefix={<SearchOutlined style={{ color: '#bbb' }} />}
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              allowClear
              style={{ marginBottom: 24, borderRadius: 8 }}
            />
            <div style={{ fontWeight: 600, fontSize: 12, color: '#8c8c8c', textTransform: 'uppercase', marginBottom: 12 }}>
              Danh mục chuyên môn
            </div>
            {SERVICE_CATEGORIES.map(cat => (
              <div
                key={cat.key}
                onClick={() => { setActiveCategory(cat.key); setPage(1); }}
                style={{
                  padding: '12px 16px', borderRadius: 8, cursor: 'pointer', marginBottom: 6,
                  background: activeCategory === cat.key ? '#e6f4ff' : 'transparent',
                  color: activeCategory === cat.key ? '#1677ff' : '#444',
                  fontWeight: activeCategory === cat.key ? 600 : 500,
                  transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between',
                }}
              >
                {cat.label}
              </div>
            ))}
          </Sider>

          {/* CỘT PHẢI: DANH SÁCH DỊCH VỤ */}
          <Content>
            <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text strong style={{ fontSize: 16 }}>
                {activeCategory === 'all' ? 'Tất cả dịch vụ' : SERVICE_CATEGORIES.find(c => c.key === activeCategory)?.label}
                <Text type="secondary" style={{ marginLeft: 8, fontWeight: 400 }}>({filteredServices.length} kết quả)</Text>
              </Text>
            </div>

            {filteredServices.length === 0 ? (
              <Empty description="Không tìm thấy dịch vụ phù hợp" style={{ padding: '60px 0', background: '#fff', borderRadius: 12 }} />
            ) : (
              <Row gutter={[24, 24]}>
                {paginatedServices.map(item => (
                  <Col xs={24} md={12} xl={8} key={item.id}>
                    <Card
                      hoverable
                      cover={<img alt={item.name} src={item.img} style={{ height: 200, objectFit: 'cover' }} />}
                      style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #f0f0f0' }}
                      bodyStyle={{ padding: 20 }}
                    >
                      <Tag color={item.typeColor} style={{ marginBottom: 10 }}>{item.typeName}</Tag>
                      <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8, color: '#001529', minHeight: 46 }}>
                        {item.name}
                      </div>
                      <div style={{ color: '#666', fontSize: 14, marginBottom: 16, lineHeight: 1.5, minHeight: 63 }}>
                        {item.shortDesc}
                      </div>
                      <div style={{ color: '#1677ff', fontWeight: 700, fontSize: 16, marginBottom: 20 }}>
                        {item.price}
                      </div>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <Button type="primary" icon={<PhoneOutlined />} style={{ flex: 1, borderRadius: 8, fontWeight: 600 }}>
                          Tư vấn ngay
                        </Button>
                        <Button icon={<ArrowRightOutlined />} style={{ borderRadius: 8 }} onClick={() => navigate('/contact')} />
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}

            {filteredServices.length > 0 && (
              <div style={{ textAlign: 'center', marginTop: 40 }}>
                <Pagination current={page} total={filteredServices.length} pageSize={PAGE_SIZE} onChange={setPage} showSizeChanger={false} />
              </div>
            )}
          </Content>
        </Layout>
      </div>
    </div>
  );
};

export default ServicePage;