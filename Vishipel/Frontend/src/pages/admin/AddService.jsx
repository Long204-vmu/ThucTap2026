import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Card, Row, Col, Upload, message, Typography, Divider, Spin, Space } from 'antd';
import { UploadOutlined, SaveOutlined, ArrowLeftOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

const { Title } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

const AddService = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams(); 
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [categories, setCategories] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);

  useEffect(() => {
    const initData = async () => {
      setFetchingData(true);
      try {
        // Gọi API lấy toàn bộ danh mục
        const catRes = await axios.get('/api/Categories');
        
        // ĐỔ TRỰC TIẾP DỮ LIỆU VÀO STATE (KHÔNG DÙNG FILTER NỮA)
        setCategories(catRes.data);

        if (isEditMode) {
          const res = await axios.get(`/api/Services/${id}`);
          const serviceData = res.data;

          const specsArray = serviceData.specsJson ? JSON.parse(serviceData.specsJson) : [];
          
          form.setFieldsValue({
            ...serviceData,
            dynamicSpecs: specsArray
          });
        }
      } catch (err) {
        message.error("Lỗi khi tải dữ liệu khởi tạo");
        console.error("Lỗi chi tiết:", err); // In lỗi ra console để dễ bắt bệnh
      } finally {
        setFetchingData(false);
      }
    };
    initData();
  }, [id, form, isEditMode]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const rawSpecs = values.dynamicSpecs || [];
      const validSpecs = rawSpecs.filter(item => item && item.label && item.value);

      const submitData = {
        ...(isEditMode ? { id: parseInt(id) } : {}), 
        name: values.name,
        categoryId: values.categoryId,
        status: values.status,
        shortDescription: values.shortDescription,
        description: values.description,
        priceDisplay: values.priceDisplay, // Trường mới thay cho Price
        specsJson: JSON.stringify(validSpecs), 
        imagesJson: JSON.stringify(uploadedImages) 
      };

      if (isEditMode) {
        await axios.put(`/api/Services/${id}`, submitData);
        message.success('Cập nhật dịch vụ thành công!');
      } else {
        await axios.post('/api/Services', submitData);
        message.success('Thêm mới dịch vụ thành công!');
      }
      navigate('/admin/services'); 
    } catch (err) {
      console.error("Lỗi:", err.response?.data);
      message.error('Có lỗi xảy ra khi lưu dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) return <div style={{ textAlign: 'center', marginTop: 150 }}><Spin size="large" /></div>;

  return (
    <div style={{ padding: '32px 5%', background: '#f5f7fa', minHeight: '100vh', marginTop: 64 }}>
      <div style={{ maxWidth: 1300, margin: '0 auto' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <Link to="/admin/services"><Button icon={<ArrowLeftOutlined />} shape="circle" /></Link>
          <Title level={3} style={{ margin: 0, color: '#001529' }}>
            {isEditMode ? 'Cập nhật Dịch vụ kỹ thuật' : 'Thêm Mới Dịch vụ kỹ thuật'}
          </Title>
        </div>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={24}>
            {/* CỘT TRÁI */}
            <Col xs={24} lg={16}>
              <Card bordered={false} style={{ borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <Title level={5} style={{ marginBottom: 20 }}>Thông tin Dịch vụ</Title>
                <Form.Item name="name" label="Tên dịch vụ (Gói giải pháp)" rules={[{ required: true }]}><Input size="large" placeholder="VD: Lắp đặt trạm bờ AIS..."/></Form.Item>
                <Form.Item name="shortDescription" label="Mô tả ngắn (Hiển thị ở trang danh sách)"><TextArea rows={2} /></Form.Item>
                <Form.Item name="description" label="Nội dung chi tiết quy trình thực hiện"><TextArea rows={6} /></Form.Item>
              </Card>

              {/* Thông số động (Phạm vi, Thời gian, Bảo hành...) */}
              <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <Title level={5} style={{ margin: '0 0 16px', color: '#1677ff' }}>Thông tin quy trình / Triển khai</Title>
                <Form.List name="dynamicSpecs">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Space key={key} style={{ display: 'flex', marginBottom: 16 }} align="start">
                          <Form.Item {...restField} name={[name, 'label']} rules={[{ required: true }]} style={{ margin: 0, width: 250 }}>
                            <Input placeholder="Tiêu đề (VD: Thời gian)" size="large" />
                          </Form.Item>
                          <Form.Item {...restField} name={[name, 'value']} rules={[{ required: true }]} style={{ margin: 0, width: 450 }}>
                            <Input placeholder="Nội dung (VD: 24 tiếng)" size="large" />
                          </Form.Item>
                          <Button type="text" danger icon={<MinusCircleOutlined style={{ fontSize: 20 }} />} onClick={() => remove(name)} style={{ marginTop: 4 }}/>
                        </Space>
                      ))}
                      <Form.Item style={{ marginTop: 16 }}>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} size="large">
                          Thêm thông tin triển khai
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Card>
            </Col>

            {/* CỘT PHẢI */}
            <Col xs={24} lg={8}>
              <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: 24 }}>
                <Title level={5} style={{ marginBottom: 20 }}>Phân loại & Chi phí</Title>
                <Form.Item name="categoryId" label="Danh mục Dịch vụ" rules={[{ required: true }]}>
                  <Select 
                    size="large" 
                    placeholder="Gõ để tìm hoặc chọn danh mục..."
                    showSearch // Bật tính năng gõ phím tìm kiếm
                    optionFilterProp="children" // Tìm theo nội dung chữ hiển thị
                    filterOption={(input, option) =>
                      (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    listHeight={250} // Khống chế chiều cao danh sách xổ xuống tối đa 250px (khoảng 7 item), thừa sẽ tự có thanh cuộn
                  >
                    {categories.map(cat => (
                      <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item name="priceDisplay" label="Hiển thị Phí dịch vụ">
                  <Input size="large" placeholder="VD: Liên hệ báo giá, Từ 5.000.000đ..."/>
                </Form.Item>

                <Form.Item name="status" label="Trạng thái" initialValue="Sẵn sàng" rules={[{ required: true }]}>
                  <Select size="large">
                    <Select.Option value="Sẵn sàng">✅ Sẵn sàng phục vụ</Select.Option>
                    <Select.Option value="Tạm ngưng">⏸️ Tạm ngưng</Select.Option>
                  </Select>
                </Form.Item>
              </Card>

              <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <Title level={5} style={{ marginBottom: 20 }}>Hình ảnh minh họa</Title>
                <Form.Item>
                  <Dragger 
                    name="file" 
                    multiple={false}
                    action={`${axios.defaults.baseURL || 'https://localhost:7010'}/api/Upload/image`}
                    onChange={(info) => {
                      if (info.file.status === 'done') {
                        message.success(`Tải ảnh thành công.`);
                        setUploadedImages([info.file.response.url]); 
                      }
                    }}
                  >
                    <p className="ant-upload-drag-icon"><UploadOutlined style={{ color: '#0057FF' }} /></p>
                    <p className="ant-upload-text">Kéo thả để tải ảnh lên</p>
                  </Dragger>
                </Form.Item>
              </Card>
            </Col>
          </Row>

          <Divider />
          <div style={{ textAlign: 'right' }}>
            <Link to="/admin/services"><Button size="large" style={{ marginRight: 16 }}>Hủy bỏ</Button></Link>
            <Button type="primary" size="large" htmlType="submit" icon={<SaveOutlined />} loading={loading} style={{ background: '#0057FF', borderRadius: 8 }}>
              {isEditMode ? 'Lưu Thay Đổi' : 'Tạo Dịch Vụ Mới'}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddService;