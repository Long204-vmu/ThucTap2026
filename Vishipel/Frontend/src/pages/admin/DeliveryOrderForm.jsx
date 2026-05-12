import React, { useState, useEffect } from 'react';
import { Typography, Form, Input, Button, Card, Divider, Descriptions, message, Space, Tag } from 'antd';
import { CarOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';

const { Title } = Typography;
const { TextArea } = Input;

const DeliveryOrderForm = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const res = await apiClient.get(`/api/Orders/${orderId}`);
      setOrder(res.data);
      form.setFieldsValue({
        deliveryAddress: res.data.customer?.address || '',
        receiverName: res.data.customer?.fullName || '',
        receiverPhone: res.data.customer?.phone || '',
      });
    } catch (err) {
      message.error('Không thể tải thông tin đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      setSubmitting(true);
      await apiClient.post('/api/DeliveryOrders', {
        orderId: parseInt(orderId),
        ...values
      });
      message.success('Tạo phiếu xuất kho thành công!');
      navigate('/admin/sales');
    } catch (err) {
      message.error(err.response?.data?.message || 'Lỗi khi tạo phiếu xuất kho');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: 50, textAlign: 'center' }}>Đang tải...</div>;
  if (!order) return <div style={{ padding: 50, textAlign: 'center' }}>Đơn hàng không tồn tại</div>;

  return (
    <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/sales')} style={{ marginBottom: 16 }}>
        Quay lại Dashboard
      </Button>
      
      <Card title={<Space><CarOutlined /> Lập phiếu xuất kho</Space>} bordered={false} className="premium-card">
        <Descriptions title="Thông tin đơn hàng" bordered size="small" column={1} style={{ marginBottom: 24 }}>
          <Descriptions.Item label="Mã đơn hàng"><b>{order.orderCode}</b></Descriptions.Item>
          <Descriptions.Item label="Khách hàng">{order.customer?.fullName}</Descriptions.Item>
          <Descriptions.Item label="Hợp đồng">{order.contract?.contractNumber || <Tag color="error">Chưa có</Tag>}</Descriptions.Item>
          <Descriptions.Item label="Số thiết bị">{order.items?.length || 0}</Descriptions.Item>
        </Descriptions>

        <Divider />

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item 
            name="receiverName" 
            label="Người nhận hàng" 
            rules={[{ required: true, message: 'Vui lòng nhập tên người nhận' }]}
          >
            <Input placeholder="Họ và tên người nhận" />
          </Form.Item>

          <Form.Item 
            name="receiverPhone" 
            label="Số điện thoại người nhận" 
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input placeholder="Số điện thoại liên hệ" />
          </Form.Item>

          <Form.Item 
            name="deliveryAddress" 
            label="Địa chỉ giao hàng" 
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ giao hàng' }]}
          >
            <TextArea rows={3} placeholder="Địa chỉ chi tiết nơi giao hàng" />
          </Form.Item>

          <Form.Item name="note" label="Ghi chú kho/vận chuyển">
            <TextArea rows={2} placeholder="Chỉ dẫn giao hàng, thời gian..." />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" icon={<SaveOutlined />} loading={submitting} block>
              Xác nhận & Xuất kho
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default DeliveryOrderForm;
