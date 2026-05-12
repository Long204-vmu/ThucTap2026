import React, { useState, useEffect } from 'react';
import { Table, Typography, message, Switch, Select, Tag, Space } from 'antd';
import apiClient from '../../services/apiClient'; // Import apiClient đã có config token của bạn

const { Title, Text } = Typography;

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/api/Users');
      setUsers(res.data);
    } catch (err) {
      message.error('Không thể tải danh sách tài khoản');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Gọi API Bật/Tắt duyệt
  const handleToggleApproval = async (id, currentStatus) => {
    try {
      await apiClient.put(`/api/Users/${id}/toggle-approval`);
      message.success(currentStatus ? 'Đã khóa tài khoản' : 'Đã duyệt tài khoản');
      fetchUsers(); // Tải lại bảng
    } catch (err) {
      message.error(err.response?.data || 'Lỗi khi cập nhật trạng thái');
    }
  };

  // Gọi API Đổi Quyền
  const handleChangeRole = async (id, newRole) => {
    try {
      await apiClient.put(`/api/Users/${id}/change-role`, `"${newRole}"`, {
        headers: { 'Content-Type': 'application/json' }
      });
      message.success('Đã cập nhật phân quyền');
      fetchUsers();
    } catch (err) {
      message.error(err.response?.data || 'Lỗi khi cấp quyền');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: 'Tài khoản', dataIndex: 'username', render: (text) => <strong>{text}</strong> },
    { title: 'Họ và Tên', dataIndex: 'fullName' },
    { title: 'Email', dataIndex: 'email' },
    {
      title: 'Phân Quyền',
      dataIndex: 'role',
      render: (role, record) => (
        <Select 
          value={role} 
          style={{ width: 120 }} 
          onChange={(newRole) => handleChangeRole(record.id, newRole)}
        >
          <Select.Option value="Admin"><Tag color="red">Admin</Tag></Select.Option>
          <Select.Option value="Manager"><Tag color="orange">Manager</Tag></Select.Option>
          <Select.Option value="User"><Tag color="blue">User</Tag></Select.Option>
        </Select>
      ),
    },
    {
      title: 'Trạng Thái Duyệt',
      dataIndex: 'isApproved',
      render: (isApproved, record) => (
        <Space>
          <Switch 
            checked={isApproved} 
            onChange={() => handleToggleApproval(record.id, isApproved)} 
            checkedChildren="Đã duyệt" 
            unCheckedChildren="Chờ duyệt"
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '32px 5%', background: '#f5f7fa', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', background: '#fff', padding: 24, borderRadius: 12 }}>
        <div style={{ marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0 }}>Quản lý Tài Khoản</Title>
          <Text type="secondary">Phê duyệt và cấp quyền truy cập hệ thống</Text>
        </div>
        
        <Table 
          columns={columns} 
          dataSource={users} 
          rowKey="id" 
          loading={loading} 
          pagination={{ pageSize: 10 }} 
        />
      </div>
    </div>
  );
};

export default ManageUsers;