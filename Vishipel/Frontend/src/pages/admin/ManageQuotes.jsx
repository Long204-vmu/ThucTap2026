import React, { useState, useEffect } from 'react';
import { Table, Tag, Typography, message, Modal, Descriptions, Button, Input, Form, InputNumber } from 'antd';
import { CheckCircleOutlined, FormOutlined } from '@ant-design/icons';
import apiClient from '../../services/apiClient';
import moment from 'moment';

const { Title } = Typography;
const { TextArea } = Input;

const ManageQuotes = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await apiClient.get('/api/QuoteRequests');
      setRequests(res.data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách yêu cầu báo giá");
    } finally {
      setLoading(false);
    }
  };

  const openReplyModal = (record) => {
    setSelectedRequest(record);
    form.setFieldsValue({
      adminReply: record.adminReply || '',
      totalQuotedPrice: record.totalQuotedPrice || null
    });
    setIsModalVisible(true);
  };

  const handleReplySubmit = async (values) => {
    try {
      setSubmitting(true);
      await apiClient.put(`/api/QuoteRequests/${selectedRequest.id}/reply`, values);
      message.success('Đã gửi phản hồi báo giá cho khách hàng!');
      setIsModalVisible(false);
      fetchRequests(); // Tải lại danh sách
    } catch (error) {
      message.error("Có lỗi xảy ra khi gửi phản hồi");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>{record.user?.fullName}</div>
          <div style={{ color: '#8c8c8c', fontSize: 13 }}>{record.user?.email}</div>
        </div>
      )
    },
    {
      title: 'Số thiết bị',
      key: 'itemCount',
      render: (_, record) => record.items?.length || 0,
      align: 'center'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        return <Tag color={status === 'Pending' ? 'processing' : 'success'}>
           {status === 'Pending' ? 'Đang chờ' : 'Đã báo giá'}
        </Tag>;
      }
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => moment(date).format('DD/MM/YYYY HH:mm')
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Button 
          type={record.status === 'Pending' ? 'primary' : 'default'} 
          size="small" 
          onClick={() => openReplyModal(record)} 
          icon={record.status === 'Pending' ? <FormOutlined /> : <CheckCircleOutlined />}
        >
          {record.status === 'Pending' ? 'Phản hồi ngay' : 'Sửa báo giá'}
        </Button>
      )
    }
  ];

  const itemColumns = [
    {
      title: 'ID Thiết bị',
      dataIndex: 'productId',
      key: 'productId',
      width: 100
    },
    {
      title: 'Tên thiết bị',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'SL',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
      align: 'center'
    }
  ];

  return (
    <div style={{ padding: '24px', background: '#fff', borderRadius: 8, minHeight: '80vh' }}>
      <Title level={3} style={{ marginBottom: 24 }}>Quản lý Yêu cầu Báo giá</Title>
      <Table 
        columns={columns} 
        dataSource={requests} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 15 }}
      />

      <Modal
        title={`Phản hồi Yêu cầu #${selectedRequest?.id} - ${selectedRequest?.user?.fullName}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedRequest && (
          <div style={{ display: 'flex', gap: 32, marginTop: 20 }}>
            {/* Cột trái: Thông tin khách hàng & thiết bị */}
            <div style={{ flex: 1 }}>
              <div style={{ background: '#fafafa', padding: 16, borderRadius: 8, marginBottom: 16 }}>
                <div style={{ marginBottom: 8 }}><strong>Ghi chú của khách:</strong></div>
                <div style={{ color: '#0050b3' }}>{selectedRequest.note || <i>(Không có ghi chú)</i>}</div>
              </div>
              
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Danh sách thiết bị:</div>
              <Table 
                columns={itemColumns} 
                dataSource={selectedRequest.items} 
                rowKey="id" 
                pagination={false} 
                size="small"
                bordered
              />
            </div>

            {/* Cột phải: Form nhập báo giá */}
            <div style={{ flex: 1, borderLeft: '1px solid #f0f0f0', paddingLeft: 32 }}>
              <h3 style={{ color: '#001529', marginTop: 0 }}>Soạn Báo Giá</h3>
              <Form form={form} layout="vertical" onFinish={handleReplySubmit}>
                <Form.Item 
                  name="adminReply" 
                  label="Nội dung phản hồi / Điều khoản" 
                  rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                >
                  <TextArea rows={6} placeholder="Nhập nội dung báo giá, thời gian giao hàng, điều kiện thanh toán..." />
                </Form.Item>

                <Form.Item 
                  name="totalQuotedPrice" 
                  label="Tổng giá trị báo giá (VNĐ)"
                >
                  <InputNumber 
                    style={{ width: '100%' }} 
                    size="large"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    placeholder="Ví dụ: 15000000"
                  />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" size="large" block loading={submitting} icon={<CheckCircleOutlined />}>
                    Gửi Phản Hồi Cho Khách
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageQuotes;
