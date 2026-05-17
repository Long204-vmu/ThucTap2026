import React, { useState, useEffect } from 'react';
import { Table, Typography, message, Button, Modal, Form, Input, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, MailOutlined, PhoneOutlined, LockOutlined } from '@ant-design/icons';
import apiClient from '../../services/apiClient';

const { Title, Text } = Typography;

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/api/TaiKhoan');
      setUsers(res.data);
    } catch (err) {
      message.error('Không thể tải danh sách tài khoản');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openModal = (record = null) => {
    if (record) {
      setEditingId(record.maTaiKhoan);
      form.setFieldsValue({ 
        fullName: record.hoTen,
        email: record.email,
        phone: record.soDienThoai,
        username: record.tenDangNhap,
        password: '' 
      });
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleSave = async (values) => {
    setLoading(true);
    try {
      const submitData = {
        hoTen: values.fullName,
        email: values.email,
        soDienThoai: values.phone,
        tenDangNhap: values.username,
        password: values.password
      };

      if (editingId) {
        await apiClient.put(`/api/TaiKhoan/${editingId}`, submitData);
        message.success('Cập nhật tài khoản thành công!');
      } else {
        await apiClient.post('/api/TaiKhoan', submitData);
        message.success('Thêm tài khoản thành công!');
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      message.error(err.response?.data?.message || 'Có lỗi xảy ra khi lưu dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/api/TaiKhoan/${id}`);
      message.success('Đã xóa tài khoản thành công');
      fetchUsers();
    } catch (err) {
      message.error(err.response?.data || 'Không thể xóa tài khoản này');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'maTaiKhoan', width: 70 },
    { title: 'Tài khoản', dataIndex: 'tenDangNhap', render: (text) => <Text strong>{text}</Text> },
    { title: 'Họ và Tên', dataIndex: 'hoTen' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Số điện thoại', dataIndex: 'soDienThoai', render: (text) => text || '-' },
    {
      title: 'Hành động',
      width: 180,
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" ghost icon={<EditOutlined />} onClick={() => openModal(record)}>Sửa</Button>
          <Popconfirm title="Xác nhận xóa tài khoản này?" onConfirm={() => handleDelete(record.maTaiKhoan)} okText="Xóa" cancelText="Hủy">
            <Button danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '32px 5%', background: '#f5f7fa', minHeight: 'calc(100vh - 76px)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <Title level={3} style={{ margin: 0 }}>Quản lý Tài Khoản</Title>
            <Text type="secondary">Danh sách người dùng truy cập hệ thống</Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()} size="large">
            Thêm tài khoản
          </Button>
        </div>
        
        <Table 
          columns={columns} 
          dataSource={users} 
          rowKey="maTaiKhoan" 
          loading={loading} 
          pagination={{ pageSize: 10 }} 
        />
      </div>

      <Modal
        title={editingId ? 'Cập nhật thông tin tài khoản' : 'Thêm tài khoản mới'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleSave} style={{ marginTop: 20 }}>
          <Form.Item name="fullName" label="Họ và Tên" rules={[{ required: true, message: 'Nhập họ tên!' }]}>
            <Input prefix={<UserOutlined />} placeholder="Họ và tên người dùng" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Nhập email hợp lệ!' }]}>
            <Input prefix={<MailOutlined />} placeholder="Địa chỉ email" />
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại">
            <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại (tùy chọn)" />
          </Form.Item>
          <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true, message: 'Nhập tên đăng nhập!' }]}>
            <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" disabled={editingId} />
          </Form.Item>
          <Form.Item 
            name="password" 
            label={editingId ? "Mật khẩu mới (Để trống nếu không đổi)" : "Mật khẩu"} 
            rules={[{ required: !editingId, message: 'Nhập mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder={editingId ? "Nhập mật khẩu mới" : "Nhập mật khẩu"} />
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Button onClick={() => setIsModalOpen(false)} style={{ marginRight: 12 }}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={loading}>Lưu thông tin</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageUsers;