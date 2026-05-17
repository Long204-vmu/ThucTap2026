import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Avatar, Typography, Tag, Row, Col, Button, Divider, Space, Modal, Form, Input, message } from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  SafetyCertificateOutlined, 
  IdcardOutlined, 
  EditOutlined,
  PhoneOutlined,
  CalendarOutlined,
  LockOutlined
} from '@ant-design/icons';
import moment from 'moment';
import apiClient from '../services/apiClient';

const { Title, Text } = Typography;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editForm] = Form.useForm();
  const [passForm] = Form.useForm();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      editForm.setFieldsValue({
        HoTen: userData.fullName || userData.hoTen,
        Email: userData.email,
        SoDienThoai: userData.phone || userData.soDienThoai
      });
    }
  }, [editForm]);

  if (!user) return null;

  const getRoleTag = (role) => {
    const roles = {
      admin: { color: 'red', text: 'Quản trị viên' },
      manager: { color: 'orange', text: 'Quản lý' },
      user: { color: 'blue', text: 'Khách hàng' },
      warehouse: { color: 'green', text: 'Nhân viên kho' },
      accounting: { color: 'purple', text: 'Kế toán' },
      salemanager: { color: 'cyan', text: 'Quản lý bán hàng' }
    };
    const r = roles[role?.toLowerCase()] || { color: 'default', text: role };
    return <Tag color={r.color} style={{ fontWeight: 600, padding: '2px 10px', borderRadius: 4 }}>{r.text?.toUpperCase()}</Tag>;
  };


  const handleUpdateProfile = async (values) => {
    setLoading(true);
    try {
      const res = await apiClient.put('/api/TaiKhoan/profile', values);
      const updatedUser = { ...user, ...res.data.user };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      message.success('Cập nhật thông tin thành công!');
      setIsEditModalOpen(false);
    } catch (err) {
      message.error(err.response?.data?.message || 'Lỗi khi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      return message.error('Mật khẩu xác nhận không khớp!');
    }
    setLoading(true);
    try {
      await apiClient.put('/api/TaiKhoan/change-password', {
        oldPassword: values.oldPassword.trim(),
        newPassword: values.newPassword.trim()
      });
      message.success('Đổi mật khẩu thành công!');
      setIsPassModalOpen(false);
      passForm.resetFields();
    } catch (err) {
      message.error(err.response?.data?.message || 'Mật khẩu cũ không chính xác');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px 5%', background: '#f0f2f5', minHeight: 'calc(100vh - 76px)' }}>
      <Row gutter={24} justify="center">
        <Col xs={24} lg={8}>
          <Card 
            bordered={false} 
            style={{ borderRadius: 16, textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
          >
            <Avatar size={120} icon={<UserOutlined />} style={{ backgroundColor: '#0057FF', marginBottom: 16 }} />
            <Title level={3} style={{ marginBottom: 4 }}>{user.hoTen || user.tenDangNhap}</Title>
            <div style={{ marginBottom: 16 }}>{getRoleTag(user.role)}</div>
            <Text type="secondary">Thành viên của hệ thống Vishipel</Text>
            <Divider />
            <div style={{ textAlign: 'left' }}>
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><MailOutlined style={{ color: '#8c8c8c' }} /><Text>{user.email}</Text></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><PhoneOutlined style={{ color: '#8c8c8c' }} /><Text>{user.soDienThoai || 'Chưa cập nhật SĐT'}</Text></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><IdcardOutlined style={{ color: '#8c8c8c' }} /><Text>@{user.tenDangNhap}</Text></div>
              </Space>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={14}>
          <Card 
            title={<Title level={4} style={{ margin: 0 }}>Chi tiết tài khoản</Title>}
            bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
            extra={<Button type="primary" icon={<EditOutlined />} ghost onClick={() => setIsEditModalOpen(true)}>Chỉnh sửa</Button>}
          >
            <Descriptions column={1} bordered size="middle">
              <Descriptions.Item label={<Space><IdcardOutlined /> Họ và Tên</Space>}><Text strong>{user.hoTen || 'Chưa cập nhật'}</Text></Descriptions.Item>
              <Descriptions.Item label={<Space><UserOutlined /> Tên tài khoản</Space>}><Text strong>{user.tenDangNhap}</Text></Descriptions.Item>
              <Descriptions.Item label={<Space><MailOutlined /> Địa chỉ Email</Space>}><Text strong>{user.email}</Text></Descriptions.Item>
              <Descriptions.Item label={<Space><PhoneOutlined /> Số điện thoại</Space>}><Text strong>{user.soDienThoai || 'Chưa cập nhật'}</Text></Descriptions.Item>
              <Descriptions.Item label={<Space><SafetyCertificateOutlined /> Quyền hạn</Space>}>{getRoleTag(user.role)}</Descriptions.Item>
              <Descriptions.Item label={<Space><CalendarOutlined /> Ngày tham gia</Space>}><Text strong>{moment(user.ngayTao).format('DD/MM/YYYY HH:mm')}</Text></Descriptions.Item>
            </Descriptions>


            <div style={{ marginTop: 32 }}>
              <Title level={5}>Bảo mật tài khoản</Title>
              <Text type="secondary">Bạn nên đổi mật khẩu định kỳ để bảo vệ tài khoản của mình.</Text>
              <div style={{ marginTop: 16 }}>
                <Button type="default" icon={<LockOutlined />} onClick={() => setIsPassModalOpen(true)}>Đổi mật khẩu</Button>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Modal Chỉnh sửa thông tin */}
      <Modal 
        title="Chỉnh sửa thông tin cá nhân" 
        open={isEditModalOpen} 
        onCancel={() => setIsEditModalOpen(false)}
        onOk={() => editForm.submit()}
        confirmLoading={loading}
        okText="Lưu thay đổi"
        cancelText="Hủy"
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdateProfile} style={{ marginTop: 16 }}>
          <Form.Item name="HoTen" label="Họ và Tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
            <Input prefix={<UserOutlined />} placeholder="Họ và tên của bạn" />
          </Form.Item>
          <Form.Item name="Email" label="Email" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}>
            <Input prefix={<MailOutlined />} placeholder="Địa chỉ email" />
          </Form.Item>
          <Form.Item name="SoDienThoai" label="Số điện thoại">
            <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại liên hệ" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Đổi mật khẩu */}
      <Modal 
        title="Đổi mật khẩu tài khoản" 
        open={isPassModalOpen} 
        onCancel={() => setIsPassModalOpen(false)}
        onOk={() => passForm.submit()}
        confirmLoading={loading}
        okText="Cập nhật mật khẩu"
        cancelText="Hủy"
      >
        <Form form={passForm} layout="vertical" onFinish={handleChangePassword} style={{ marginTop: 16 }}>
          <Form.Item name="oldPassword" label="Mật khẩu hiện tại" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ!' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu đang sử dụng" />
          </Form.Item>
          <Divider />
          <Form.Item name="newPassword" label="Mật khẩu mới" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }, { min: 6, message: 'Mật khẩu phải từ 6 ký tự!' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu mới" />
          </Form.Item>
          <Form.Item name="confirmPassword" label="Xác nhận mật khẩu mới" rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu mới!' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu mới" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
