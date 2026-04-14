import React, { useState, useEffect } from 'react';
import { Table, Typography, message, Select, Tag, Button, Modal, Form, Input } from 'antd';
import { EditOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import apiClient from '../../services/apiClient';

const { Title, Text } = Typography;
const { TextArea } = Input;

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [form] = Form.useForm();

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/api/ServiceRequests');
      setRequests(res.data);
    } catch (err) {
      if (err.response?.status === 403) {
        message.error('Bạn không có quyền truy cập dữ liệu này!');
      } else {
        message.error('Không thể tải danh sách yêu cầu.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Đổi trạng thái nhanh
  const handleStatusChange = async (id, newStatus) => {
    // Lưu ý: Tạm thời update giao diện. Khi bạn viết API PUT cho Backend, bạn sẽ mở khóa dòng axios dưới đây
    const updated = requests.map(req => req.id === id ? { ...req, status: newStatus } : req);
    setRequests(updated);
    message.success(`Đã cập nhật trạng thái thành: ${newStatus}`);
    // await apiClient.put(`/api/ServiceRequests/${id}/status`, { status: newStatus });
  };

  // Mở popup ghi chú nội bộ
  const openNoteModal = (record) => {
    setEditingRequest(record);
    form.setFieldsValue({ adminNote: record.adminNote });
    setIsModalOpen(true);
  };

  const handleSaveNote = (values) => {
    const updated = requests.map(req => req.id === editingRequest.id ? { ...req, adminNote: values.adminNote } : req);
    setRequests(updated);
    message.success('Đã lưu ghi chú!');
    setIsModalOpen(false);
    // await apiClient.put(`/api/ServiceRequests/${editingRequest.id}/note`, { note: values.adminNote });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { 
      title: 'Ngày gửi', 
      dataIndex: 'createdAt', 
      width: 150, 
      render: (text) => new Date(text).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) 
    },
    { 
      title: 'Khách hàng', 
      key: 'customer',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 15, color: '#001529' }}>{record.customerName}</div>
          <div style={{ color: '#0057FF', marginTop: 4 }}><PhoneOutlined /> {record.phone}</div>
          {record.email && <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}><MailOutlined /> {record.email}</div>}
        </div>
      )
    },
    { 
      title: 'Yêu cầu / Ghi chú Sales', 
      dataIndex: 'adminNote',
      render: (text) => <div style={{ whiteSpace: 'pre-line', fontSize: 13, background: '#fffbe6', padding: 8, borderRadius: 6, border: '1px solid #ffe58f' }}>{text || 'Chưa có ghi chú...'}</div>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 160,
      render: (status, record) => (
        <Select 
          value={status || 'Mới'} 
          style={{ width: '100%' }} 
          onChange={(val) => handleStatusChange(record.id, val)}
          options={[
            { value: 'Mới', label: <Tag color="red">Mới</Tag> },
            { value: 'Đã liên hệ', label: <Tag color="orange">Đã liên hệ</Tag> },
            { value: 'Đang xử lý', label: <Tag color="blue">Đang xử lý</Tag> },
            { value: 'Đã chốt đơn', label: <Tag color="green">Đã chốt đơn</Tag> },
            { value: 'Hủy / Từ chối', label: <Tag color="default">Hủy / Từ chối</Tag> },
          ]}
        />
      ),
    },
    {
      title: 'Thao tác',
      width: 110,
      render: (_, record) => (
        <Button type="dashed" icon={<EditOutlined />} onClick={() => openNoteModal(record)}>Ghi chú</Button>
      )
    }
  ];

  return (
    <div style={{ padding: '32px 5%', background: '#f5f7fa', minHeight: '100vh', marginTop: 64 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={3} style={{ margin: 0, color: '#001529' }}>Quản lý Yêu cầu (Sales Portal)</Title>
            <Text type="secondary">Tiếp nhận và xử lý các form yêu cầu tư vấn từ khách hàng</Text>
          </div>
        </div>
        
        <Table 
          columns={columns} 
          dataSource={requests} 
          rowKey="id" 
          loading={loading} 
          pagination={{ pageSize: 10 }} 
          bordered={false}
        />

        <Modal
          title={`Ghi chú cho Yêu cầu #${editingRequest?.id}`}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onOk={() => form.submit()}
          okText="Lưu ghi chú"
          cancelText="Hủy"
        >
          <Form form={form} layout="vertical" onFinish={handleSaveNote}>
            <Form.Item name="adminNote" label="Cập nhật tình hình chăm sóc khách hàng:">
              <TextArea rows={5} placeholder="Ví dụ: Đã gọi điện lúc 10h sáng, khách hẹn chiều mai gửi báo giá hệ thống Radar..." />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ManageRequests;