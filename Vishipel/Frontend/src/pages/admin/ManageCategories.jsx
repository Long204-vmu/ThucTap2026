import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Tag, Typography, Modal, Form, Input, Select } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { createCategory, deleteCategory, getAllCategories, updateCategory } from '../../services/categoryService';

const { Title, Text } = Typography;

const CATEGORY_TYPE_PRODUCT = 'Product';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

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

  const openModal = (record = null) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue(record);
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleSave = async (values) => {
    try {
      const dataToSubmit = {
        ...values,
        categoryType: CATEGORY_TYPE_PRODUCT,
      };

      if (editingId) {
        await updateCategory(editingId, { id: editingId, ...dataToSubmit });
        message.success('Cập nhật danh mục thành công!');
      } else {
        await createCategory(dataToSubmit);
        message.success('Thêm danh mục mới thành công!');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      console.error(err);
      message.error('Có lỗi xảy ra khi lưu danh mục.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      message.success('Đã xóa danh mục thành công');
      fetchCategories();
    } catch (err) {
      message.error('Lỗi: Danh mục này có thể đang chứa sản phẩm, không thể xóa!');
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

  const productCategories = categories.filter(c => (c.categoryType || CATEGORY_TYPE_PRODUCT) === CATEGORY_TYPE_PRODUCT);

  return (
    <div style={{ padding: '32px 5%', background: '#f5f7fa', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', background: '#fff', padding: 24, borderRadius: 12 }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <Title level={3} style={{ margin: 0 }}>Quản lý danh mục thiết bị</Title>
            <Text type="secondary">Phân loại hiển thị cho cửa hàng thiết bị</Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()} size="large">
            Thêm danh mục
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={productCategories}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: 'Chưa có danh mục thiết bị nào' }}
        />

        <Modal
          title={editingId ? 'Sửa danh mục' : 'Thêm danh mục thiết bị'}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleSave} style={{ marginTop: 20 }}>
            <Form.Item name="name" label="Tên danh mục" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
              <Input placeholder="VD: Radar hàng hải, Thiết bị AIS..." size="large" />
            </Form.Item>

            <Form.Item name="slug" label="Đường dẫn (Slug)" rules={[{ required: true, message: 'Vui lòng nhập Slug!' }]}>
              <Input placeholder="VD: radar-hang-hai (Viết liền, không dấu)" size="large" />
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
              <Button type="primary" htmlType="submit">Lưu danh mục</Button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ManageCategories;
