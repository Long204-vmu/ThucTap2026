import React, { useState, useEffect, useMemo } from 'react';
import { Layout, Row, Col, Typography, Input, Card, Tag, Button, Empty, Pagination, Spin } from 'antd';
import { SearchOutlined, FilterOutlined, ArrowRightOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { BACKEND_ORIGIN } from '../config/api';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

const PAGE_SIZE = 6;

const Service = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch]                 = useState('');
  const [page, setPage]                     = useState(1);

  // State cho dữ liệu API
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([{ key: 'all', label: 'Tất cả dịch vụ' }]);
  const [loading, setLoading] = useState(true);

  // 1. GỌI API LẤY DỮ LIỆU THẬT
  useEffect(() => {
    const fetchApiData = async () => {
      try {
        setLoading(true);
        
        const catRes = await apiClient.get('/api/Categories?type=Service');
        const serviceCats = catRes.data.filter(c => c.name.toLowerCase().includes('dịch vụ'));
        const mappedCats = serviceCats.map(c => ({ key: String(c.id), label: c.name }));
        setCategories([{ key: 'all', label: 'Tất cả dịch vụ' }, ...mappedCats]);

        // GỌI THẲNG API CỦA BẢNG DỊCH VỤ MỚI TẠO
        const res = await apiClient.get('/api/Services');
        
        const formattedServices = res.data.map(item => {
          const imagesArray = item.imagesJson ? JSON.parse(item.imagesJson) : [];
          let finalImgUrl = 'https://via.placeholder.com/600x400?text=Service';
          if (imagesArray.length > 0) {
              const fileName = imagesArray[0].split('/').pop();
              finalImgUrl = `${BACKEND_ORIGIN}/image/${fileName}`;
          }

          return {
            id: item.id,
            name: item.name,
            categoryId: String(item.categoryId),
            typeName: item.category?.name || 'Dịch vụ',
            typeColor: item.category?.colorCode || 'blue',
            img: finalImgUrl,
            shortDesc: item.shortDescription || item.description,
            status: item.status,
            priceDisplay: item.priceDisplay
          };
        });

        setServices(formattedServices);
      } catch (err) {
        console.error('Lỗi tải dữ liệu dịch vụ', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchApiData();
  }, []);
    

  // 2. LOGIC LỌC DỮ LIỆU TẠI FRONTEND
  const filteredDisplay = useMemo(() => {
    return services.filter(item => {
      const matchCat = activeCategory === 'all' || item.categoryId === activeCategory;
      const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [services, activeCategory, search]);

  const paginatedServices = useMemo(() => {
    return filteredDisplay.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  }, [filteredDisplay, page]);

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
            
            <div
              style={{ 
              maxHeight: '280px', // Giới hạn chiều cao
              overflowY: 'auto',  // Tự sinh thanh cuộn dọc nếu vượt quá
              paddingRight: '8px' // Chừa 1 chút lề cho thanh cuộn khỏi đè vào chữ
              }}
              className="custom-scrollbar"
            >

              {loading ? <Spin size="small" style={{ marginLeft: '50%' }} /> : categories.map(cat => (
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

            </div>
          </Sider>

          {/* CỘT PHẢI: DANH SÁCH DỊCH VỤ */}
          <Content>
            <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text strong style={{ fontSize: 16 }}>
                {categories.find(c => c.key === activeCategory)?.label || 'Dịch vụ'}
                {!loading && <Text type="secondary" style={{ marginLeft: 8, fontWeight: 400 }}>({filteredDisplay.length} kết quả)</Text>}
              </Text>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '100px 0' }}><Spin size="large" /></div>
            ) : filteredDisplay.length === 0 ? (
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
                      <div style={{ color: '#666', fontSize: 14, marginBottom: 16, lineHeight: 1.5, minHeight: 63, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.shortDesc}
                      </div>
                      <div style={{ color: item.status === 'Sẵn sàng' ? '#389e0d' : '#1677ff', fontWeight: 700, fontSize: 14, marginBottom: 20 }}>
                        {item.status || 'Đang triển khai'}
                      </div>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <Button type="primary" icon={<PhoneOutlined />} style={{ flex: 1, borderRadius: 8, fontWeight: 600 }}>
                          Tư vấn ngay
                        </Button>
                        <Link to={`/services/${item.id}`}>
                           <Button icon={<ArrowRightOutlined />} style={{ borderRadius: 8 }} />
                        </Link>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}

            {filteredDisplay.length > 0 && (
              <div style={{ textAlign: 'center', marginTop: 40 }}>
                <Pagination current={page} total={filteredDisplay.length} pageSize={PAGE_SIZE} onChange={setPage} showSizeChanger={false} />
              </div>
            )}
          </Content>
        </Layout>
      </div>
    </div>
  );
};

export default Service;