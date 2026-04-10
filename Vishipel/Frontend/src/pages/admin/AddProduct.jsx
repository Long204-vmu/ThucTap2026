import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, InputNumber, Card, Row, Col, Upload, message, Typography, Divider } from 'antd';
import { UploadOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

const AddProduct = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // Tự động gọi API lấy danh sách Danh mục khi mở trang
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Giả sử Backend của bạn có hàm GET /api/Categories
        const res = await axios.get('/api/Categories');
        setCategories(res.data);
      } catch (err) {
        console.error("Lỗi lấy danh mục:", err);
        // Tạm thời dùng dữ liệu giả nếu API Categories chưa sẵn sàng
        setCategories([
          { id: 1, name: 'Radar Hàng Hải' },
          { id: 2, name: 'Hệ thống AIS' },
          { id: 3, name: 'Dịch vụ Kiểm định' }
        ]);
      }
    };
    fetchCategories();
  }, []);

  // Xử lý khi ấn nút "Lưu Sản Phẩm"
  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Vì đã cấu hình Axios Interceptor ở main.jsx, nó sẽ tự động lấy Token JWT gắn vào lệnh này!
      await axios.post('/api/Products', {
        name: values.name,
        model: values.model,
        brand: values.brand,
        categoryId: values.categoryId,
        price: values.price,
        status: values.status,
        shortDescription: values.shortDescription,
        // (Sau này sẽ làm logic upload ảnh thật lên server, tạm thời để trống hoặc chuỗi rỗng)
        imagesJson: "[]" 
      });

      message.success('Thêm sản phẩm thành công!');
      form.resetFields(); // Xóa trắng form sau khi lưu
      // navigate('/admin/products'); // Chuyển về trang danh sách (nếu có)
      
    } catch (err) {
      if (err.response && err.response.status === 403) {
         message.error('Bạn không có quyền thực hiện hành động này!');
      } else {
         message.error('Có lỗi xảy ra khi lưu sản phẩm.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '32px 5%', background: '#f5f7fa', minHeight: '100vh', marginTop: 64 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Header của trang Admin */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <Link to="/">
            <Button icon={<ArrowLeftOutlined />} shape="circle" />
          </Link>
          <Title level={3} style={{ margin: 0, color: '#001529' }}>Thêm Mới Thiết Bị / Dịch Vụ</Title>
        </div>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={24}>
            {/* CỘT TRÁI: THÔNG TIN CƠ BẢN */}
            <Col xs={24} lg={16}>
              <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <Title level={5} style={{ marginBottom: 20 }}>Thông tin cơ bản</Title>
                
                <Form.Item name="name" label="Tên thiết bị / dịch vụ" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                  <Input placeholder="VD: Radar Hàng hải Furuno FAR-2117" size="large" />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="model" label="Mã Model / SKU">
                      <Input placeholder="VD: FAR-2117" size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="brand" label="Thương hiệu (Hãng sản xuất)">
                      <Input placeholder="VD: Furuno" size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name="shortDescription" label="Mô tả ngắn">
                  <TextArea rows={4} placeholder="Nhập tóm tắt tính năng nổi bật..." />
                </Form.Item>
              </Card>
            </Col>

            {/* CỘT PHẢI: PHÂN LOẠI, GIÁ & ẢNH */}
            <Col xs={24} lg={8}>
              <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: 24 }}>
                <Title level={5} style={{ marginBottom: 20 }}>Phân loại & Trạng thái</Title>
                
                <Form.Item name="categoryId" label="Danh mục" rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}>
                  <Select size="large" placeholder="Chọn danh mục">
                    {categories.map(cat => (
                      <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item name="price" label="Giá (VNĐ) - Tùy chọn">
                  <InputNumber 
                    size="large" 
                    style={{ width: '100%' }} 
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    placeholder="Để trống nếu là hàng nội bộ"
                  />
                </Form.Item>

                {/* Giữ nguyên phần trạng thái */}
                <Form.Item name="status" label="Trạng thái hiện tại" initialValue="Còn hàng" rules={[{ required: true }]}>
                  <Select size="large">
                    <Select.Option value="Còn hàng">✅ Còn hàng</Select.Option>
                    <Select.Option value="Hết hàng">❌ Hết hàng</Select.Option>
                    <Select.Option value="Đang bảo trì">🛠️ Đang bảo trì / Sửa chữa</Select.Option>
                    <Select.Option value="Ngừng kinh doanh">⛔ Ngừng kinh doanh</Select.Option>
                  </Select>
                </Form.Item>
              </Card>

              <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <Title level={5} style={{ marginBottom: 20 }}>Hình ảnh sản phẩm</Title>
                <Form.Item>
                  <Dragger name="files" action="/upload.do" multiple={false}>
                    <p className="ant-upload-drag-icon">
                      <UploadOutlined style={{ color: '#0057FF' }} />
                    </p>
                    <p className="ant-upload-text">Kéo thả hoặc nhấn để tải ảnh lên</p>
                    <p className="ant-upload-hint" style={{ fontSize: 12 }}>
                      Hỗ trợ định dạng JPG, PNG. (Tính năng upload API sẽ code sau)
                    </p>
                  </Dragger>
                </Form.Item>
              </Card>
            </Col>
          </Row>

          <Divider />
          <div style={{ textAlign: 'right' }}>
            <Button size="large" style={{ marginRight: 16 }}>Hủy bỏ</Button>
            <Button type="primary" size="large" htmlType="submit" icon={<SaveOutlined />} loading={loading} style={{ background: '#0057FF', borderRadius: 8 }}>
              Lưu Sản Phẩm
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddProduct;