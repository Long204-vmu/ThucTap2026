import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import axios from 'axios'; // Dùng axios gốc, không dùng apiClient để tránh bị gắn token sinh lỗi 401

const RequestFormModal = ({ isOpen, onClose, itemName, itemType }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Đóng gói dữ liệu gửi xuống Backend
      const payload = {
        customerName: values.customerName,
        phone: values.phone,
        email: values.email,
        // Lưu thẳng tên Sản phẩm/Dịch vụ khách đang xem vào mục Ghi chú để Sales biết
        adminNote: `Khách yêu cầu tư vấn cho ${itemType}: ${itemName}\nLưu ý của khách: ${values.note || 'Không có'}`
      };

      // Gọi API public không cần đăng nhập
      await axios.post('https://localhost:7010/api/ServiceRequests/public-request', payload);
      
      message.success('Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ sớm nhất.');
      form.resetFields(); // Xóa trắng form
      onClose(); // Đóng popup
    } catch (error) {
      message.error('Có lỗi xảy ra, vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div style={{ fontSize: 20, fontWeight: 700, color: '#0057FF' }}>
          Đăng ký tư vấn / Yêu cầu báo giá
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <div style={{ marginBottom: 20, color: '#555' }}>
        Bạn đang yêu cầu tư vấn cho: <strong>{itemName}</strong>
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item 
          name="customerName" 
          label="Họ và Tên / Tên Công ty" 
          rules={[{ required: true, message: 'Vui lòng nhập thông tin này!' }]}
        >
          <Input size="large" placeholder="VD: Nguyễn Văn A hoặc Công ty TNHH Biển Đông" />
        </Form.Item>

        <Form.Item 
          name="phone" 
          label="Số điện thoại liên hệ" 
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
        >
          <Input size="large" placeholder="VD: 0901234567" />
        </Form.Item>

        <Form.Item name="email" label="Email (Không bắt buộc)">
          <Input size="large" placeholder="VD: email@company.com" />
        </Form.Item>

        <Form.Item name="note" label="Yêu cầu cụ thể (Không bắt buộc)">
          <Input.TextArea rows={4} placeholder="VD: Cần khảo sát tàu tại cảng Hải Phòng vào ngày mai..." />
        </Form.Item>

        <Button 
          type="primary" 
          htmlType="submit" 
          size="large" 
          block 
          loading={loading}
          icon={<SendOutlined />}
          style={{ height: 45, borderRadius: 8, fontWeight: 600 }}
        >
          Gửi Yêu Cầu
        </Button>
      </Form>
    </Modal>
  );
};

export default RequestFormModal;