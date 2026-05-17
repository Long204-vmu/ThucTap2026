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
      const kh = res.data.khachHang || {};
      form.setFieldsValue({
        deliveryAddress: res.data.shippingAddress || kh.diaChi || '',
        receiverName: res.data.receiverName || kh.tenKH || '',
        receiverPhone: res.data.receiverPhone || kh.soDienThoai || '',
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
      await apiClient.put(`/api/Orders/${orderId}/deliver`, values);
      message.success('Lập phiếu giao hàng thành công! Đơn hàng đã chuyển sang trạng thái Đang giao hàng.');
      navigate('/admin/sales');
    } catch (err) {
      message.error(err.response?.data?.message || 'Lỗi khi lập phiếu giao hàng');
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
      
      <Card title={<Space><CarOutlined /> Lập phiếu giao nhận hàng</Space>} bordered={false} className="premium-card">
        <Descriptions title="Thông tin đơn hàng" bordered size="small" column={1} style={{ marginBottom: 24 }}>
          <Descriptions.Item label="Mã đơn hàng"><b>{order.orderCode}</b></Descriptions.Item>
          <Descriptions.Item label="Khách hàng">{order.khachHang?.tenKH}</Descriptions.Item>
          <Descriptions.Item label="Hợp đồng">{order.contract?.maHopDong || <Tag color="error">Chưa có</Tag>}</Descriptions.Item>
          <Descriptions.Item label="Số thiết bị">{order.chiTietDonHangs?.length || 0}</Descriptions.Item>
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
              Xác nhận & Giao hàng
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default DeliveryOrderForm;
