import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Tag, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { deleteProduct, getProducts } from '../../services/productService';

const { Title } = Typography;

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 1. Hàm lấy danh sách thiết bị
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      // Sắp xếp ID giảm dần (mới nhất lên đầu)
      setProducts(res.data.sort((a, b) => b.id - a.id));
    } catch (err) {
      message.error('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  // 2. Hàm Xóa thiết bị
  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      message.success('Đã xóa thiết bị thành công');
      fetchProducts(); // Tải lại bảng sau khi xóa
    } catch (err) {
      message.error('Có lỗi xảy ra khi xóa thiết bị');
    }
  };

  // 3. Cấu hình các cột của Bảng
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Tên thiết bị / Dịch vụ', dataIndex: 'name', key: 'name', fontWeight: 600 },
    { title: 'Model', dataIndex: 'model', key: 'model' },
    { 
      title: 'Danh mục', 
      key: 'category',
      render: (_, record) => <Tag color="blue">{record.category?.name || 'Chưa phân loại'}</Tag>
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Còn hàng' ? 'green' : (status === 'Hết hàng' ? 'red' : 'default')}>
          {status || 'N/A'}
        </Tag>
      ) 
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {/* Nút Sửa: Chuyển hướng sang trang Form kèm theo ID */}
          <Button type="primary" ghost icon={<EditOutlined />} onClick={() => navigate(`/admin/products/edit/${record.id}`)}>
            Sửa
          </Button>
          
          {/* Nút Xóa: Bọc trong Popconfirm để hỏi lại cho chắc chắn */}
          <Popconfirm title="Bạn có chắc chắn muốn xóa thiết bị này?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy" placement="left">
            <Button danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '32px 5%', background: '#f5f7fa', minHeight: '100vh', marginTop: 64 }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0 }}>Quản lý Thiết bị</Title>
          <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => navigate('/admin/products/add')} style={{ borderRadius: 8 }}>
            Thêm Mới
          </Button>
        </div>
        
        <Table columns={columns} dataSource={products} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
      </div>
    </div>
  );
};

export default ManageProducts;