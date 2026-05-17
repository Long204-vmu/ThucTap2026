import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Row, Col, Typography, Upload, Divider, message, Tabs, Spin } from 'antd';
import { 
  GlobalOutlined, 
  PhoneOutlined, 
  MailOutlined, 
  EnvironmentOutlined,
  UploadOutlined,
  SaveOutlined
} from '@ant-design/icons';
import apiClient from '../../services/apiClient';

const { Title, Text } = Typography;

const WebsiteSettings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchSettings = async () => {
    try {
      setFetching(true);
      const res = await apiClient.get('/api/CauHinh');
      if (res.data) {
        form.setFieldsValue({
          tenWebsite: res.data.tenWebsite,
          slogan: res.data.slogan,
          emailLienHe: res.data.emailLienHe,
          hotline: res.data.hotline,
          diaChi: res.data.diaChi,
          banQuyen: res.data.banQuyen
        });
      }
    } catch (err) {
      console.error("Lỗi tải cấu hình:", err);
      message.error("Không thể tải cấu hình website.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (values) => {
    setLoading(true);
    try {
      // Đảm bảo truyền đúng ID = 1 cho Backend
      await apiClient.put('/api/CauHinh', { ...values, id: 1 });
      message.success('Đã lưu cấu hình website thành công!');
    } catch (err) {
      message.error(err.response?.data?.message || 'Lỗi khi lưu cấu hình.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '32px 5%', background: '#f5f7fa', minHeight: 'calc(100vh - 76px)' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <Title level={2}>
            <GlobalOutlined style={{ marginRight: 12 }} />
            Cấu hình Website
          </Title>
          <Text type="secondary">Thay đổi thông tin hiển thị và các thiết lập chung của hệ thống</Text>
        </div>

        <Spin spinning={fetching} description="Đang tải cấu hình..." size="large">
          <Form 
            form={form} 
            layout="vertical" 
            onFinish={handleSave}
            style={{ opacity: fetching ? 0.5 : 1 }}
          >
            <Tabs defaultActiveKey="1" items={[
              {
                key: '1',
                label: 'Thông tin chung',
                children: (
                  <Card style={{ borderRadius: 12 }}>
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item name="tenWebsite" label="Tên Website" rules={[{ required: true, message: 'Nhập tên website!' }]}>
                          <Input size="large" placeholder="Ví dụ: Vishipel EMS" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="slogan" label="Slogan">
                          <Input size="large" placeholder="Ví dụ: Giải pháp hàng hải thông minh" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Divider />
                    <Row gutter={24} align="middle">
                      <Col span={8}>
                        <Text strong>Logo Website</Text>
                        <div style={{ marginTop: 8 }}>
                          <Upload listType="picture-card" maxCount={1} disabled>
                            <div>
                              <UploadOutlined />
                              <div style={{ marginTop: 8 }}>Tải lên</div>
                            </div>
                          </Upload>
                        </div>
                      </Col>
                      <Col span={16}>
                        <Text type="secondary">Định dạng hỗ trợ: .png, .jpg, .svg. Chức năng tải lên ảnh đang được cập nhật.</Text>
                      </Col>
                    </Row>
                  </Card>
                )
              },
              {
                key: '2',
                label: 'Liên hệ & Chân trang',
                children: (
                  <Card style={{ borderRadius: 12 }}>
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item name="emailLienHe" label="Email liên hệ">
                          <Input prefix={<MailOutlined />} size="large" placeholder="admin@vishipel.com" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="hotline" label="Hotline">
                          <Input prefix={<PhoneOutlined />} size="large" placeholder="0225.xxxx.xxx" />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item name="diaChi" label="Địa chỉ trụ sở">
                          <Input prefix={<EnvironmentOutlined />} size="large" placeholder="Số 2, Duy Tân, Cầu Giấy, Hà Nội" />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item name="banQuyen" label="Thông tin bản quyền (Footer)">
                          <Input.TextArea rows={3} placeholder="© 2026 Vishipel. All rights reserved." />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                )
              }
            ]} />

            <div style={{ textAlign: 'right', marginTop: 24 }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SaveOutlined />} 
                size="large"
                loading={loading}
                disabled={fetching}
                style={{ padding: '0 40px', height: 48, borderRadius: 8, fontWeight: 600 }}
              >
                Lưu cấu hình
              </Button>
            </div>
          </Form>
        </Spin>
      </div>
    </div>
  );
};

export default WebsiteSettings;
