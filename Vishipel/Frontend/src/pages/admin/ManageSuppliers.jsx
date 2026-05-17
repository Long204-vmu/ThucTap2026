import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Typography, Modal, Form, Input, Card, Row, Col } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined,
  ShopOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  UserOutlined,
  IdcardOutlined
} from '@ant-design/icons';
import { getAllSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../../services/supplierService';

const { Title, Text } = Typography;

const ManageSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await getAllSuppliers();
      setSuppliers(res.data);
    } catch (err) {
      message.error('Không thể tải danh sách nhà cung cấp');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const openModal = (record = null) => {
    if (record) {
      setEditingId(record.maNCC);
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
        maNCC: editingId || 0,
      };

      if (editingId) {
        await updateSupplier(editingId, dataToSubmit);
        message.success('Cập nhật thành công!');
      } else {
        await createSupplier(dataToSubmit);
        message.success('Thêm mới thành công!');
      }
      setIsModalOpen(false);
      fetchSuppliers();
    } catch (err) {
      console.error("Lỗi khi lưu nhà cung cấp:", err.response || err);
      let errorMsg = 'Có lỗi xảy ra khi lưu dữ liệu.';
      if (err.response?.data?.errors) {
        // Form validation errors from backend
        errorMsg = Object.values(err.response.data.errors).flat().join(', ');
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.response?.data) {
        errorMsg = typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data);
      }
      message.error(`Lỗi: ${errorMsg}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSupplier(id);
      message.success('Đã xóa thành công');
      fetchSuppliers();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Lỗi khi xóa nhà cung cấp!';
      message.error(errorMsg);
    }
  };

  const columns = [
    { 
      title: 'Nhà cung cấp', 
      dataIndex: 'tenNCC', 
      key: 'tenNCC',
      render: (text, record) => (
        <div>
          <Text strong style={{ fontSize: 16, color: '#1890ff' }}>{text}</Text>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>MST: {record.mst || 'N/A'}</div>
        </div>
      )
    },
    { 
      title: 'Liên hệ', 
      key: 'contact',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text size="small"><UserOutlined /> {record.nguoiLienHe || '—'}</Text>
          <Text size="small" type="secondary"><PhoneOutlined /> {record.soDienThoai || '—'}</Text>
          <Text size="small" type="secondary"><MailOutlined /> {record.email || '—'}</Text>
        </Space>
      )
    },
    { 
      title: 'Địa chỉ', 
      dataIndex: 'diaChi', 
      key: 'diaChi',
      ellipsis: true,
      render: (text) => <span><EnvironmentOutlined /> {text || '—'}</span>
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 220,
      align: 'center',
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', paddingRight: '16px' }}>
          <Button type="primary" ghost icon={<EditOutlined />} onClick={() => openModal(record)}>Sửa</Button>
          <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.maNCC)} okText="Có" cancelText="Không">
            <Button danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px 3%', background: '#f5f7fa', minHeight: 'calc(100vh - 76px)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <Title level={2} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
              <ShopOutlined /> Quản lý Nhà cung cấp
            </Title>
            <Text type="secondary">Quản lý danh sách các đối tác cung ứng thiết bị cho hệ thống</Text>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => openModal()} 
            size="large"
            style={{ height: 45, borderRadius: 8, fontWeight: 600, background: 'linear-gradient(135deg, #1890ff, #0050b3)', border: 'none' }}
          >
            Thêm nhà cung cấp
          </Button>
        </div>

        <Card bordered={false} bodyStyle={{ padding: 0 }} style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <Table
            columns={columns}
            dataSource={suppliers}
            rowKey="maNCC"
            loading={loading}
            pagination={{ pageSize: 10 }}
            locale={{ emptyText: 'Chưa có dữ liệu nhà cung cấp' }}
          />
        </Card>
      </div>

      <Modal
        title={editingId ? 'Cập nhật Nhà cung cấp' : 'Thêm Nhà cung cấp mới'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={700}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleSave} style={{ marginTop: 20 }}>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item name="tenNCC" label="Tên nhà cung cấp" rules={[{ required: true, message: 'Vui lòng nhập tên nhà cung cấp!' }]}>
                <Input prefix={<ShopOutlined />} placeholder="Nhập tên đầy đủ của nhà cung cấp..." size="large" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="mst" label="Mã số thuế">
                <Input prefix={<IdcardOutlined />} placeholder="Nhập MST..." size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="diaChi" label="Địa chỉ">
            <Input prefix={<EnvironmentOutlined />} placeholder="Địa chỉ trụ sở chính..." size="large" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="email" label="Email" rules={[{ type: 'email', message: 'Email không hợp lệ!' }]}>
                <Input prefix={<MailOutlined />} placeholder="example@domain.com" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="soDienThoai" label="Số điện thoại">
                <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại liên hệ..." size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="nguoiLienHe" label="Người đại diện / Liên hệ">
            <Input prefix={<UserOutlined />} placeholder="Tên người liên hệ trực tiếp..." size="large" />
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Button onClick={() => setIsModalOpen(false)} style={{ marginRight: 12 }} size="large">Hủy</Button>
            <Button type="primary" htmlType="submit" size="large">
              Lưu thông tin
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageSuppliers;
