import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Button, Space, Popconfirm, message, Tag, Typography, Modal, Form, Input, Card } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined,
  AppstoreOutlined,
  ShopOutlined,
  HomeOutlined,
  DeploymentUnitOutlined,
  UsergroupAddOutlined,
  CreditCardOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { createCategory, deleteCategory, getAllCategories, updateCategory } from '../../services/categoryService';

const { Title, Text } = Typography;

const CATEGORY_TYPES_MAP = {
  'LoaiThietBi': { label: 'Loại thiết bị', icon: <AppstoreOutlined />, color: 'blue' },
  'NhaCungCap': { label: 'Nhà cung cấp', icon: <ShopOutlined />, color: 'orange' },
  'Kho': { label: 'Danh mục kho', icon: <HomeOutlined />, color: 'green' },
  'DonViTinh': { label: 'Đơn vị tính', icon: <DeploymentUnitOutlined />, color: 'cyan' },
  'LoaiKhachHang': { label: 'Loại khách hàng', icon: <UsergroupAddOutlined />, color: 'purple' },
  'PhuongThucThanhToan': { label: 'Phương thức thanh toán', icon: <CreditCardOutlined />, color: 'red' },
  'LoaiHopDong': { label: 'Loại hợp đồng', icon: <FileTextOutlined />, color: 'gold' },
};

const ManageCategories = () => {
  const { type } = useParams();
  const activeType = type || 'LoaiThietBi';
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  const currentTypeInfo = CATEGORY_TYPES_MAP[activeType] || CATEGORY_TYPES_MAP['LoaiThietBi'];

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getAllCategories(activeType);
      setCategories(res.data);
    } catch (err) {
      message.error('Không thể tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, [activeType]);

  const openModal = (record = null) => {
    if (record) {
      setEditingId(record.maLoai);
      form.setFieldsValue({
        name: record.tenLoai,
        moTa: record.moTa,
      });
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleSave = async (values) => {
    try {
      const dataToSubmit = {
        maLoai: editingId || 0,
        tenLoai: values.name,
        moTa: values.moTa,
      };

      if (editingId) {
        await updateCategory(activeType, editingId, dataToSubmit);
        message.success('Cập nhật thành công!');
      } else {
        await createCategory(activeType, dataToSubmit);
        message.success('Thêm mới thành công!');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      message.error('Có lỗi xảy ra khi lưu dữ liệu.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(activeType, id);
      message.success('Đã xóa thành công');
      fetchCategories();
    } catch (err) {
      message.error('Lỗi: Mục này có thể đang được sử dụng ở nơi khác!');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'maLoai', width: 80 },
    { title: 'Tên danh mục', dataIndex: 'tenLoai', render: (text) => <Text strong style={{ fontSize: 15 }}>{text}</Text> },
    { title: 'Mô tả', dataIndex: 'moTa', render: (text) => <Text type="secondary">{text || '—'}</Text> },
    {
      title: 'Hành động',
      width: 200,
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" ghost icon={<EditOutlined />} onClick={() => openModal(record)}>Sửa</Button>
          <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.maLoai)} okText="Có" cancelText="Không">
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
              {currentTypeInfo.icon} {currentTypeInfo.label}
            </Title>
            <Text type="secondary">Quản lý danh sách các {currentTypeInfo.label.toLowerCase()} trong hệ thống</Text>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => openModal()} 
            size="large"
            style={{ height: 45, borderRadius: 8, fontWeight: 600, background: 'linear-gradient(135deg, #1890ff, #0050b3)', border: 'none' }}
          >
            Thêm mới
          </Button>
        </div>

        <Card bordered={false} bodyStyle={{ padding: 0 }} style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <Table
            columns={columns}
            dataSource={categories}
            rowKey="maLoai"
            loading={loading}
            pagination={{ pageSize: 10 }}
            locale={{ emptyText: `Chưa có dữ liệu ${currentTypeInfo.label.toLowerCase()}` }}
          />
        </Card>
      </div>

      <Modal
        title={editingId ? `Cập nhật ${currentTypeInfo.label}` : `Thêm ${currentTypeInfo.label}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleSave} style={{ marginTop: 20 }}>
          <Form.Item name="name" label={`Tên ${currentTypeInfo.label.toLowerCase()}`} rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
            <Input placeholder={`Nhập tên ${currentTypeInfo.label.toLowerCase()}...`} size="large" />
          </Form.Item>

          <Form.Item name="moTa" label="Mô tả">
            <Input.TextArea placeholder="Nhập mô tả chi tiết cho loại thiết bị này..." rows={4} />
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Button onClick={() => setIsModalOpen(false)} style={{ marginRight: 12 }}>Hủy</Button>
            <Button type="primary" htmlType="submit" size="large">Lưu thông tin</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageCategories;
