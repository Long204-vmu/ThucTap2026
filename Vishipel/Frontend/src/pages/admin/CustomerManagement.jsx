import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Card, Modal, Form, Input, Select, Tag, Tooltip, Row, Col, Descriptions } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, BuildOutlined } from '@ant-design/icons';
import apiClient from '../../services/apiClient';

const { Option } = Select;
const { Search } = Input;

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [customerCategories, setCustomerCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchText, setSearchText] = useState('');
  
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [cusRes, catRes] = await Promise.all([
        apiClient.get('/api/KhachHang'),
        apiClient.get('/api/LoaiKhachHang')
      ]);
      setCustomers(cusRes.data || []);
      setCustomerCategories(catRes.data || []);
    } catch (err) {
      message.error('Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  };

  const filteredCustomers = customers.filter(c => 
    c.tenKH?.toLowerCase().includes(searchText) || 
    c.soDienThoai?.includes(searchText) || 
    c.mst?.includes(searchText) || 
    c.email?.toLowerCase().includes(searchText)
  );

  const handleView = (record) => {
    setSelectedCustomer(record);
    setIsViewModalVisible(true);
  };

  const handleAdd = () => {
    form.resetFields();
    setSelectedCustomer(null);
    setIsEditModalVisible(true);
  };

  const handleEdit = (record) => {
    setSelectedCustomer(record);
    form.setFieldsValue({
      tenKH: record.tenKH,
      loaiKhachHang: record.loaiKhachHang,
      mst: record.mst,
      diaChi: record.diaChi,
      soDienThoai: record.soDienThoai,
      email: record.email,
    });
    setIsEditModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/api/KhachHang/${id}`);
      message.success('Xóa khách hàng thành công!');
      loadData();
    } catch (err) {
      message.error('Không thể xóa khách hàng này. Khách hàng có thể đã phát sinh đơn hàng.');
    }
  };

  const handleSave = async (values) => {
    try {
      if (selectedCustomer) {
        await apiClient.put(`/api/KhachHang/${selectedCustomer.maKH}`, { maKH: selectedCustomer.maKH, ...values });
        message.success('Cập nhật khách hàng thành công!');
      } else {
        await apiClient.post('/api/KhachHang', values);
        message.success('Thêm khách hàng thành công!');
      }
      setIsEditModalVisible(false);
      loadData();
    } catch (err) {
      message.error('Lỗi khi lưu thông tin khách hàng');
    }
  };

  const columns = [
    { title: 'Tên Khách Hàng', dataIndex: 'tenKH', key: 'tenKH', render: (text, record) => (
      <span>
        {record.loaiKhachHang?.toLowerCase().includes('công ty') || record.loaiKhachHang?.toLowerCase().includes('doanh nghiệp') 
          ? <BuildOutlined style={{ marginRight: 8, color: '#1677ff' }} /> 
          : <UserOutlined style={{ marginRight: 8, color: '#52c41a' }} />}
        <b>{text}</b>
      </span>
    )},
    { title: 'Loại', dataIndex: 'loaiKhachHang', key: 'loaiKhachHang', render: (val) => {
      if (!val) return <Tag>Chưa phân loại</Tag>;
      const isCompany = val.toLowerCase().includes('công ty') || val.toLowerCase().includes('doanh nghiệp');
      return <Tag color={isCompany ? 'blue' : 'green'}>{val}</Tag>;
    }},
    { title: 'SĐT', dataIndex: 'soDienThoai', key: 'soDienThoai' },
    { title: 'Mã Số Thuế', dataIndex: 'mst', key: 'mst', render: val => val || '—' },
    { title: 'Địa chỉ', dataIndex: 'diaChi', key: 'diaChi', ellipsis: true },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Xem chi tiết">
            <Button size="small" type="primary" ghost icon={<EyeOutlined />} onClick={() => handleView(record)} />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button size="small" danger icon={<DeleteOutlined />} onClick={() => {
              Modal.confirm({
                title: 'Xóa khách hàng?',
                content: 'Bạn có chắc chắn muốn xóa khách hàng này?',
                onOk: () => handleDelete(record.maKH),
              });
            }} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title="Quản lý Thông tin Khách hàng (CRM)" bordered={false} style={{ borderRadius: '8px' }}>
        <Row justify="space-between" style={{ marginBottom: 16 }}>
          <Col>
            <Search 
              placeholder="Tìm kiếm theo Tên, SĐT, MST, Email..." 
              onSearch={handleSearch} 
              onChange={e => handleSearch(e.target.value)}
              style={{ width: 400 }} 
              allowClear
            />
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Thêm Khách Hàng
            </Button>
          </Col>
        </Row>

        <Table 
          columns={columns} 
          dataSource={filteredCustomers} 
          rowKey="maKH" 
          loading={loading}
          pagination={{ pageSize: 15 }}
        />
      </Card>

      {/* View Detail Modal */}
      <Modal
        title={<span><UserOutlined /> Chi tiết Khách Hàng</span>}
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            Đóng
          </Button>,
          <Button key="edit" type="primary" onClick={() => {
            setIsViewModalVisible(false);
            handleEdit(selectedCustomer);
          }}>
            Chỉnh sửa
          </Button>
        ]}
        width={700}
        destroyOnHidden
      >
        {selectedCustomer && (
          <Descriptions bordered column={2} style={{ marginTop: 16 }}>
            <Descriptions.Item label="Tên Khách Hàng" span={2}><b>{selectedCustomer.tenKH}</b></Descriptions.Item>
            <Descriptions.Item label="Loại Khách Hàng">
              <Tag color="geekblue">{selectedCustomer.loaiKhachHang || 'Chưa phân loại'}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Mã Số Thuế (MST)"><b>{selectedCustomer.mst || 'Không có'}</b></Descriptions.Item>
            <Descriptions.Item label="Số Điện Thoại"><b>{selectedCustomer.soDienThoai || '—'}</b></Descriptions.Item>
            <Descriptions.Item label="Email">{selectedCustomer.email || '—'}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ" span={2}>{selectedCustomer.diaChi || '—'}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Add / Edit Form Modal */}
      <Modal
        title={selectedCustomer ? 'Cập nhật Thông tin Khách hàng' : 'Thêm Khách Hàng Mới'}
        open={isEditModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsEditModalVisible(false)}
        width={600}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleSave} style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item name="tenKH" label="Tên Khách Hàng / Công ty" rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}>
                <Input placeholder="Nhập tên..." />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="loaiKhachHang" label="Loại" rules={[{ required: true, message: 'Chọn loại' }]}>
                <Select placeholder="Chọn loại khách hàng" allowClear>
                  {customerCategories.map(cat => (
                    <Option key={cat.maLoai} value={cat.tenLoai}>{cat.tenLoai}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="soDienThoai" label="Số Điện Thoại">
                <Input placeholder="Nhập SĐT liên hệ..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="mst" label="Mã Số Thuế (nếu có)">
                <Input placeholder="Nhập MST..." />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="email" label="Email">
            <Input type="email" placeholder="Nhập email..." />
          </Form.Item>

          <Form.Item name="diaChi" label="Địa chỉ giao dịch">
            <Input.TextArea rows={2} placeholder="Nhập địa chỉ đầy đủ..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerManagement;
