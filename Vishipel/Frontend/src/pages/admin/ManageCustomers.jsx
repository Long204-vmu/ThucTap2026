import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Typography, Modal, Form, Input, Card, Tag } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined,
  UserOutlined,
  SolutionOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined
} from '@ant-design/icons';
import apiClient from '../../services/apiClient';

const { Title, Text } = Typography;

const ManageCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [customerTypes, setCustomerTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [custRes, typeRes] = await Promise.all([
        apiClient.get('/api/KhachHang'),
        apiClient.get('/api/LoaiKhachHang')
      ]);
      setCustomers(custRes.data);
      setCustomerTypes(typeRes.data);
    } catch (err) {
      message.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openModal = (record = null) => {
    if (record) {
      setEditingId(record.maKH || record.MaKH);
      form.setFieldsValue({
        tenKH: record.tenKH || record.TenKH,
        mst: record.mst || record.MST,
        diaChi: record.diaChi || record.DiaChi,
        soDienThoai: record.soDienThoai || record.SoDienThoai,
        email: record.email || record.Email,
        loaiKhachHang: record.loaiKhachHang || record.LoaiKhachHang,
      });
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleSave = async (values) => {
    try {
      const payload = {
        maKH: editingId || 0,
        ...values
      };

      if (editingId) {
        await apiClient.put(`/api/KhachHang/${editingId}`, payload);
        message.success('Cập nhật khách hàng thành công!');
      } else {
        await apiClient.post('/api/KhachHang', payload);
        message.success('Thêm khách hàng thành công!');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      message.error('Có lỗi xảy ra khi lưu dữ liệu. Đảm bảo Backend đã sẵn sàng.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/api/KhachHang/${id}`);
      message.success('Đã xóa khách hàng thành công');
      fetchData();
    } catch (err) {
      message.error('Lỗi khi xóa khách hàng!');
    }
  };

  const columns = [
    { 
      title: 'Khách hàng', 
      key: 'customer',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>{record.tenKH || record.TenKH}</div>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>MST: {record.mst || record.MST || '---'}</div>
        </div>
      )
    },
    { 
      title: 'Liên hệ', 
      key: 'contact',
      render: (_, record) => (
        <div style={{ fontSize: 13 }}>
          <div><PhoneOutlined /> {record.soDienThoai || record.SoDienThoai || '---'}</div>
          <div><MailOutlined /> {record.email || record.Email || '---'}</div>
        </div>
      )
    },
    { 
      title: 'Địa chỉ', 
      dataIndex: 'diaChi', 
      key: 'diaChi',
      render: (text) => <Text type="secondary" style={{ fontSize: 13 }}>{text || record.DiaChi || '---'}</Text> 
    },
    { 
      title: 'Phân loại', 
      dataIndex: 'loaiKhachHang', 
      key: 'loaiKhachHang',
      render: (text) => <Tag color="blue">{text || record.LoaiKhachHang || 'Đại lý/Đối tác'}</Tag>
    },
    {
      title: 'Hành động',
      width: 180,
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" ghost icon={<EditOutlined />} onClick={() => openModal(record)}>Sửa</Button>
          <Popconfirm title="Xóa khách hàng này?" onConfirm={() => handleDelete(record.maKH || record.MaKH)} okText="Có" cancelText="Không">
            <Button danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px 3%', background: '#f5f7fa', minHeight: 'calc(100vh - 76px)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <Title level={2} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
              <SolutionOutlined /> Quản lý Khách hàng
            </Title>
            <Text type="secondary">Danh sách đối tác, chủ tàu và khách hàng doanh nghiệp</Text>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => openModal()} 
            size="large"
            style={{ height: 45, borderRadius: 8, fontWeight: 600, background: 'linear-gradient(135deg, #1890ff, #0050b3)', border: 'none' }}
          >
            Thêm khách hàng
          </Button>
        </div>

        <Card bordered={false} bodyStyle={{ padding: 0 }} style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <Table
            columns={columns}
            dataSource={customers}
            rowKey={(r) => r.maKH || r.MaKH}
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </div>

      <Modal
        title={editingId ? "Cập nhật khách hàng" : "Thêm khách hàng mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnHidden
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSave} style={{ marginTop: 20 }}>
          <Form.Item name="tenKH" label="Tên khách hàng / Công ty" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
            <Input prefix={<UserOutlined />} placeholder="Nhập tên khách hàng..." size="large" />
          </Form.Item>

          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="mst" label="Mã số thuế" style={{ flex: 1 }}>
              <Input placeholder="Nhập MST..." />
            </Form.Item>
            <Form.Item name="loaiKhachHang" label="Loại khách hàng" style={{ flex: 1 }}>
              <Select placeholder="Chọn loại khách hàng">
                {customerTypes.map(t => (
                  <Select.Option key={t.maLoai} value={t.tenLoai}>
                    {t.tenLoai}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item name="diaChi" label="Địa chỉ">
            <Input prefix={<EnvironmentOutlined />} placeholder="Nhập địa chỉ..." />
          </Form.Item>

          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="soDienThoai" label="Số điện thoại" style={{ flex: 1 }}>
              <Input prefix={<PhoneOutlined />} placeholder="SĐT liên hệ..." />
            </Form.Item>
            <Form.Item name="email" label="Email" style={{ flex: 1 }}>
              <Input prefix={<MailOutlined />} placeholder="Email..." />
            </Form.Item>
          </div>

          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Button onClick={() => setIsModalOpen(false)} style={{ marginRight: 12 }}>Hủy</Button>
            <Button type="primary" htmlType="submit" size="large">Lưu thông tin</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageCustomers;
