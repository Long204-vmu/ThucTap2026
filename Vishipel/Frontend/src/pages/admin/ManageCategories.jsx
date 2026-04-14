import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Tag, Typography, Modal, Form, Input, Select, Tabs } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { createCategory, deleteCategory, getAllCategories, updateCategory } from '../../services/categoryService';

const { Title, Text } = Typography;

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('Product'); // Mặc định mở Tab Thiết bị
  const [form] = Form.useForm();

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isManager = user?.role === 'Manager';

  // 1. Lấy danh sách danh mục (Lấy toàn bộ một lần)
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getAllCategories();
      setCategories(res.data);
    } catch (err) {
      message.error('Không thể tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  // Manager chỉ được quản lý danh mục Dịch vụ
  useEffect(() => {
    if (isManager) setActiveTab('Service');
  }, [isManager]);

  // 2. Mở hộp thoại Thêm/Sửa
  const openModal = (record = null) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue(record); // Nạp dữ liệu cũ vào form nếu là chế độ Sửa
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  // 3. Xử lý Lưu dữ liệu (Đã thêm CategoryType)
  const handleSave = async (values) => {
    try {
      // Gắn thêm CategoryType dựa vào Tab đang đứng
      const dataToSubmit = {
        ...values,
        categoryType: activeTab 
      };

      if (editingId) {
        await updateCategory(editingId, { id: editingId, ...dataToSubmit });
        message.success('Cập nhật danh mục thành công!');
      } else {
        await createCategory(dataToSubmit);
        message.success('Thêm danh mục mới thành công!');
      }
      setIsModalOpen(false);
      fetchCategories(); // Tải lại bảng
    } catch (err) {
      console.error(err);
      message.error('Có lỗi xảy ra khi lưu danh mục.');
    }
  };

  // 4. Xử lý Xóa
  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      message.success('Đã xóa danh mục thành công');
      fetchCategories();
    } catch (err) {
      message.error('Lỗi: Danh mục này có thể đang chứa Sản phẩm/Dịch vụ, không thể xóa!');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: 'Tên Danh mục', dataIndex: 'name', render: (text) => <strong>{text}</strong> },
    { title: 'Đường dẫn (Slug)', dataIndex: 'slug', render: (text) => <Text type="secondary">{text}</Text> },
    { 
      title: 'Màu hiển thị', 
      dataIndex: 'colorCode', 
      render: (color) => <Tag color={color || 'blue'}>{color || 'Mặc định'}</Tag>
    },
    {
      title: 'Hành động',
      width: 180,
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" ghost icon={<EditOutlined />} onClick={() => openModal(record)}>Sửa</Button>
          <Popconfirm title="Xóa danh mục này?" onConfirm={() => handleDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '32px 5%', background: '#f5f7fa', minHeight: '100vh', marginTop: 64 }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', background: '#fff', padding: 24, borderRadius: 12 }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <Title level={3} style={{ margin: 0 }}>Quản lý Hệ thống Danh mục</Title>
            <Text type="secondary">Phân loại cho cả Thiết bị và Dịch vụ</Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()} size="large">
            Thêm Danh Mục Mới
          </Button>
        </div>

        {/* COMPONENT TABS (Chìa khóa để chia đôi giao diện) */}
        <Tabs 
          activeKey={activeTab} 
          onChange={(key) => { if (!isManager) setActiveTab(key); }}
          size="large"
          items={[
            ...(isManager ? [] : [{ key: 'Product', label: <span style={{ fontWeight: 600 }}>📦 DANH MỤC THIẾT BỊ</span> }]),
            { key: 'Service', label: <span style={{ fontWeight: 600 }}>🛠️ DANH MỤC DỊCH VỤ</span> }
          ]}
        />
        
        {/* Table chỉ hiển thị dữ liệu đã được lọc theo activeTab */}
        <Table 
          columns={columns} 
          dataSource={categories.filter(c => c.categoryType === activeTab)} 
          rowKey="id" 
          loading={loading} 
          pagination={{ pageSize: 10 }} 
          locale={{ emptyText: `Chưa có danh mục nào cho ${activeTab === 'Product' ? 'Thiết bị' : 'Dịch vụ'}` }}
        />

        {/* HỘP THOẠI THÊM/SỬA NHANH (Đã có trường Slug) */}
        <Modal
          title={editingId ? "Sửa Danh Mục" : `Thêm Danh Mục ${activeTab === 'Product' ? 'Thiết Bị' : 'Dịch Vụ'}`}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleSave} style={{ marginTop: 20 }}>
            <Form.Item name="name" label="Tên Danh Mục" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
              <Input placeholder="VD: Dịch vụ Kiểm định, Radar hàng hải..." size="large" />
            </Form.Item>

            <Form.Item name="slug" label="Đường dẫn (Slug)" rules={[{ required: true, message: 'Vui lòng nhập Slug!' }]}>
              <Input placeholder="VD: dich-vu-kiem-dinh (Viết liền, không dấu)" size="large" />
            </Form.Item>

            <Form.Item name="colorCode" label="Màu sắc Tag hiển thị" initialValue="blue">
              <Select size="large">
                <Select.Option value="blue"><Tag color="blue">Xanh dương (Blue)</Tag></Select.Option>
                <Select.Option value="cyan"><Tag color="cyan">Xanh lơ (Cyan)</Tag></Select.Option>
                <Select.Option value="green"><Tag color="green">Xanh lá (Green)</Tag></Select.Option>
                <Select.Option value="orange"><Tag color="orange">Cam (Orange)</Tag></Select.Option>
                <Select.Option value="red"><Tag color="red">Đỏ (Red)</Tag></Select.Option>
                <Select.Option value="purple"><Tag color="purple">Tím (Purple)</Tag></Select.Option>
              </Select>
            </Form.Item>

            <div style={{ textAlign: 'right', marginTop: 24 }}>
              <Button onClick={() => setIsModalOpen(false)} style={{ marginRight: 12 }}>Hủy</Button>
              <Button type="primary" htmlType="submit">Lưu Danh Mục</Button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ManageCategories;