import React, { useState, useEffect } from 'react';
import { Table, Typography, message, Switch, Select, Tag, Space, Card, Tabs, Button, Modal, Form, Input, Popconfirm } from 'antd';
import { 
  SafetyCertificateOutlined, 
  UserOutlined, 
  StopOutlined, 
  CheckCircleOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined
} from '@ant-design/icons';
import apiClient from '../../services/apiClient';

const { Title, Text } = Typography;

const SystemManagement = () => {
  // State cho Tab Người dùng
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  // State cho Tab Vai trò
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [roleForm] = Form.useForm();

  // --- Logic cho QUẢN LÝ NGƯỜI DÙNG ---
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await apiClient.get('/api/TaiKhoan');
      setUsers(res.data);
    } catch (err) {
      message.error('Không thể tải danh sách tài khoản');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleToggleApproval = async (id, currentStatus) => {
    try {
      await apiClient.put(`/api/TaiKhoan/${id}/toggle-status`);
      message.success(currentStatus ? 'Đã vô hiệu hóa tài khoản' : 'Đã kích hoạt tài khoản');
      fetchUsers();
    } catch (err) {
      message.error(err.response?.data?.message || 'Lỗi khi cập nhật trạng thái');
    }
  };

  const handleChangeUserRole = async (id, newRoleId) => {
    try {
      await apiClient.put(`/api/TaiKhoan/${id}/change-role`, { maVaiTro: newRoleId });
      message.success('Đã cập nhật phân quyền người dùng');
      fetchUsers();
    } catch (err) {
      message.error(err.response?.data?.message || 'Lỗi khi cấp quyền');
    }
  };

  // --- Logic cho QUẢN LÝ DANH MỤC VAI TRÒ ---
  const fetchRoles = async () => {
    setLoadingRoles(true);
    try {
      const res = await apiClient.get('/api/VaiTro');
      setRoles(res.data);
    } catch (err) {
      message.error('Không thể tải danh sách vai trò');
    } finally {
      setLoadingRoles(false);
    }
  };

  const openRoleModal = (record = null) => {
    if (record) {
      setEditingRoleId(record.maVaiTro);
      roleForm.setFieldsValue(record);
    } else {
      setEditingRoleId(null);
      roleForm.resetFields();
    }
    setIsRoleModalOpen(true);
  };

  const handleSaveRole = async (values) => {
    setLoadingRoles(true);
    try {
      if (editingRoleId) {
        await apiClient.put(`/api/VaiTro/${editingRoleId}`, { ...values, maVaiTro: editingRoleId });
        message.success('Cập nhật vai trò thành công!');
      } else {
        await apiClient.post('/api/VaiTro', values);
        message.success('Thêm vai trò thành công!');
      }
      setIsRoleModalOpen(false);
      fetchRoles();
    } catch (err) {
      message.error(err.response?.data?.message || 'Có lỗi xảy ra khi lưu vai trò');
    } finally {
      setLoadingRoles(false);
    }
  };

  const handleDeleteRole = async (id) => {
    try {
      await apiClient.delete(`/api/VaiTro/${id}`);
      message.success('Đã xóa vai trò thành công');
      fetchRoles();
    } catch (err) {
      message.error(err.response?.data?.message || 'Không thể xóa vai trò này');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // Định nghĩa Columns cho Bảng Người dùng
  const userColumns = [
    { title: 'ID', dataIndex: 'maTaiKhoan', width: 70, align: 'center' },
    { title: 'Tài khoản', dataIndex: 'tenDangNhap', render: (text) => <Text strong>{text}</Text> },
    { title: 'Họ và Tên', dataIndex: 'hoTen' },
    {
      title: 'Phân Quyền',
      dataIndex: 'roleName',
      render: (roleName, record) => (
        <Select 
          value={roleName} 
          style={{ width: 160 }} 
          onChange={(newRoleName) => {
            const roleObj = roles.find(r => r.tenVaiTro === newRoleName);
            if (roleObj) handleChangeUserRole(record.maTaiKhoan, roleObj.maVaiTro);
          }}
        >
          {roles.map(r => (
            <Select.Option key={r.maVaiTro} value={r.tenVaiTro}>
              <Tag color="blue">{r.tenVaiTro.toUpperCase()}</Tag>
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'trangThai',
      render: (trangThai, record) => (
        <Space>
          <Switch 
            checked={trangThai} 
            onChange={() => handleToggleApproval(record.maTaiKhoan, trangThai)} 
            checkedChildren={<CheckCircleOutlined />} 
            unCheckedChildren={<StopOutlined />}
          />
          {trangThai ? <Tag color="success">HOẠT ĐỘNG</Tag> : <Tag color="error">VÔ HIỆU</Tag>}
        </Space>
      ),
    },
  ];

  // Định nghĩa Columns cho Bảng Vai trò
  const roleColumns = [
    { title: 'Mã', dataIndex: 'maVaiTro', width: 80, align: 'center' },
    { title: 'Tên Vai Trò', dataIndex: 'tenVaiTro', render: (text) => <Tag color="purple" style={{ fontWeight: 600 }}>{text.toUpperCase()}</Tag> },
    {
      title: 'Thao tác',
      width: 150,
      align: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => openRoleModal(record)}
            disabled={record.tenVaiTro === 'Admin'}
          />
          <Popconfirm 
            title="Xác nhận xóa vai trò này?" 
            onConfirm={() => handleDeleteRole(record.maVaiTro)}
            disabled={record.tenVaiTro === 'Admin' || record.tenVaiTro === 'User'}
          >
            <Button 
              type="link" 
              danger 
              icon={<DeleteOutlined />}
              disabled={record.tenVaiTro === 'Admin' || record.tenVaiTro === 'User'}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: '1',
      label: <Space><TeamOutlined />Quản lý người dùng</Space>,
      children: (
        <Table 
          columns={userColumns} 
          dataSource={users} 
          rowKey="maTaiKhoan" 
          loading={loadingUsers} 
          pagination={{ pageSize: 8 }} 
        />
      ),
    },
    {
      key: '2',
      label: <Space><SafetyCertificateOutlined />Danh mục vai trò</Space>,
      children: (
        <>
          <div style={{ marginBottom: 16, textAlign: 'right' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openRoleModal()}>Thêm vai trò</Button>
          </div>
          <Table 
            columns={roleColumns} 
            dataSource={roles} 
            rowKey="maVaiTro" 
            loading={loadingRoles} 
            pagination={false} 
          />
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: '32px 5%', background: '#f5f7fa', minHeight: 'calc(100vh - 76px)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Card style={{ borderRadius: 16, boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, background: '#e6f7ff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SafetyCertificateOutlined style={{ fontSize: 24, color: '#1890ff' }} />
            </div>
            <div>
              <Title level={3} style={{ margin: 0 }}>Phân quyền & Vô hiệu hóa</Title>
              <Text type="secondary">Quản lý tập trung tài khoản và các cấp độ quyền hạn hệ thống</Text>
            </div>
          </div>
          
          <Tabs 
            defaultActiveKey="1" 
            items={tabItems} 
            type="card"
            style={{ marginTop: 8 }}
          />
        </Card>
      </div>

      <Modal
        title={editingRoleId ? 'Cập nhật vai trò' : 'Thêm vai trò mới'}
        open={isRoleModalOpen}
        onCancel={() => setIsRoleModalOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <Form form={roleForm} layout="vertical" onFinish={handleSaveRole} style={{ marginTop: 20 }}>
          <Form.Item name="tenVaiTro" label="Tên vai trò" rules={[{ required: true, message: 'Nhập tên vai trò!' }]}>
            <Input prefix={<SafetyCertificateOutlined />} placeholder="Ví dụ: Accountant, Sale Manager..." />
          </Form.Item>
          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Button onClick={() => setIsRoleModalOpen(false)} style={{ marginRight: 12 }}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={loadingRoles}>Lưu lại</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default SystemManagement;
