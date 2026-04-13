import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Tag, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { deleteService, getServices } from '../../services/serviceService';

const { Title, Text } = Typography;

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 1. Hàm lấy danh sách dịch vụ từ API riêng
  const fetchServices = async () => {
    setLoading(true);
    try {
      // Gọi tới API Services mới mà bạn sẽ tạo ở Backend
      const res = await getServices();
      // Sắp xếp ID giảm dần để hiện các dịch vụ mới tạo lên đầu
      setServices(res.data.sort((a, b) => b.id - a.id));
    } catch (err) {
      message.error('Không thể tải danh sách dịch vụ');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // 2. Hàm Xóa dịch vụ
  const handleDelete = async (id) => {
    try {
      await deleteService(id);
      message.success('Đã xóa dịch vụ thành công');
      fetchServices(); // Tải lại dữ liệu sau khi xóa
    } catch (err) {
      message.error('Có lỗi xảy ra khi xóa dịch vụ');
    }
  };

  // 3. Cấu hình các cột của Bảng Dịch vụ
  const columns = [
    { 
      title: 'ID', 
      dataIndex: 'id', 
      key: 'id', 
      width: 60 
    },
    { 
      title: 'Tên dịch vụ kỹ thuật', 
      dataIndex: 'name', 
      key: 'name', 
      render: (text) => <span style={{ fontWeight: 600, color: '#001529' }}>{text}</span>
    },
    { 
      title: 'Danh mục', 
      key: 'category',
      render: (_, record) => (
        <Tag color="cyan" style={{ borderRadius: 4 }}>
          {record.category?.name || 'Dịch vụ'}
        </Tag>
      )
    },
    { 
      title: 'Phí dịch vụ', 
      dataIndex: 'priceDisplay', 
      key: 'priceDisplay',
      render: (price) => <span style={{ color: '#0057FF', fontWeight: 500 }}>{price || 'Liên hệ'}</span>
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Sẵn sàng' ? 'green' : 'orange'}>
          {status || 'Đang cập nhật'}
        </Tag>
      ) 
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            ghost 
            icon={<EditOutlined />} 
            onClick={() => navigate(`/admin/services/edit/${record.id}`)}
          >
            Sửa
          </Button>
          
          <Popconfirm 
            title="Bạn có chắc chắn muốn xóa dịch vụ này?" 
            onConfirm={() => handleDelete(record.id)} 
            okText="Xóa" 
            cancelText="Hủy" 
            placement="left"
          >
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
          <div>
            <Title level={3} style={{ margin: 0 }}>Quản lý Dịch vụ Kỹ thuật</Title>
            <Text type="secondary">Danh sách các gói dịch vụ kiểm định và lắp đặt trạm bờ</Text>
          </div>
          <Button 
            type="primary" 
            size="large" 
            icon={<PlusOutlined />} 
            onClick={() => navigate('/admin/services/add')} 
            style={{ borderRadius: 8, height: 45, fontWeight: 600 }}
          >
            Thêm Dịch Vụ Mới
          </Button>
        </div>
        
        <Table 
          columns={columns} 
          dataSource={services} 
          rowKey="id" 
          loading={loading} 
          pagination={{ pageSize: 8 }}
          locale={{ emptyText: 'Chưa có dịch vụ nào được tạo' }}
        />
      </div>
    </div>
  );
};

export default ManageServices;