import React, { useState, useEffect } from 'react';
import { Table, Tag, Typography, message, Modal, Descriptions, Button, Steps, Card, Space, Row, Col } from 'antd';
import { EyeOutlined, DownloadOutlined, FilePdfOutlined } from '@ant-design/icons';
import apiClient from '../services/apiClient';
import moment from 'moment';

const { Title, Text } = Typography;

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const formatPrice = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n || 0);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await apiClient.get('/api/Orders/my-orders');
      setOrders(res.data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (status) => {
    const steps = ['Created', 'ContractDraft', 'ContractSigned', 'Delivering', 'Delivered', 'InvoiceIssued', 'Completed'];
    const current = steps.indexOf(status);
    return current >= 0 ? current : 0;
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderCode',
      key: 'orderCode',
      render: (code) => <b>{code}</b>
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => moment(date).format('DD/MM/YYYY')
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => <span style={{ color: '#cf1322', fontWeight: 600 }}>{formatPrice(amount)}</span>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const map = {
          Created: ['blue', 'Đã tạo đơn'],
          ContractDraft: ['orange', 'Đang soạn HĐ'],
          ContractSigned: ['green', 'Đã ký HĐ'],
          Delivering: ['cyan', 'Đang giao hàng'],
          Delivered: ['geekblue', 'Đã giao hàng'],
          InvoiceIssued: ['purple', 'Đã xuất hóa đơn'],
          Completed: ['success', 'Hoàn thành']
        };
        const [color, text] = map[status] || ['default', status];
        return <Tag color={color} style={{ fontWeight: 600 }}>{text}</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => { setSelectedOrder(record); setIsModalVisible(true); }} icon={<EyeOutlined />}>Chi tiết</Button>
      )
    }
  ];

  return (
    <div style={{ padding: '40px 5%', marginTop: 68, minHeight: '80vh', background: '#f5f7fa' }}>
      <div style={{ background: '#fff', padding: '32px 24px', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', maxWidth: 1200, margin: '0 auto' }}>
        <Title level={3} style={{ marginBottom: 24 }}>Đơn hàng của tôi</Title>
        <Table 
          columns={columns} 
          dataSource={orders} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      <Modal
        title={<span>Chi tiết đơn hàng {selectedOrder?.orderCode}</span>}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>Đóng</Button>
        ]}
        width={900}
      >
        {selectedOrder && (
          <div style={{ marginTop: 20 }}>
            <Steps
              current={getStepStatus(selectedOrder.status)}
              size="small"
              items={[
                { title: 'Tạo đơn' },
                { title: 'Soạn HĐ' },
                { title: 'Ký HĐ' },
                { title: 'Giao hàng' },
                { title: 'Nhận hàng' },
                { title: 'Hóa đơn' },
                { title: 'Xong' },
              ]}
              style={{ marginBottom: 32 }}
            />

            <Row gutter={24}>
              <Col span={14}>
                <Card title="Danh sách thiết bị" size="small" bordered={false} bodyStyle={{ padding: 0 }}>
                  <Table 
                    dataSource={selectedOrder.items} 
                    rowKey="id" 
                    pagination={false} 
                    size="small"
                    columns={[
                      { title: 'Tên hàng', dataIndex: 'productName' },
                      { title: 'SL', dataIndex: 'quantity', width: 60, align: 'center' },
                      { title: 'Thành tiền', dataIndex: 'totalPrice', render: v => formatPrice(v), align: 'right' },
                    ]}
                  />
                  <div style={{ padding: 16, textAlign: 'right' }}>
                    <Text strong>Tổng thanh toán: </Text>
                    <Text strong style={{ color: '#cf1322', fontSize: 18 }}>{formatPrice(selectedOrder.totalAmount)}</Text>
                  </div>
                </Card>
              </Col>
              <Col span={10}>
                <Card title="Chứng từ điện tử" size="small">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div style={{ padding: '12px', border: '1px solid #f0f0f0', borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span><FilePdfOutlined style={{ color: '#ff4d4f' }} /> Hợp đồng kinh tế</span>
                      {selectedOrder.contract ? (
                        <Button type="link" size="small" icon={<DownloadOutlined />} href={`/admin/contracts/create/${selectedOrder.id}?view=${selectedOrder.contract.id}`}>Xem/Tải</Button>
                      ) : <Text type="secondary" italic>Chưa có</Text>}
                    </div>
                    <div style={{ padding: '12px', border: '1px solid #f0f0f0', borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span><FilePdfOutlined style={{ color: '#ff4d4f' }} /> Hóa đơn tài chính</span>
                      {selectedOrder.invoice ? (
                        <Button type="link" size="small" icon={<DownloadOutlined />} href={`/admin/invoices/create/${selectedOrder.id}?view=${selectedOrder.invoice.id}`}>Xem/Tải</Button>
                      ) : <Text type="secondary" italic>Chưa có</Text>}
                    </div>
                  </Space>
                </Card>

                {selectedOrder.paymentSchedules?.length > 0 && (
                  <Card title="Lịch thanh toán" size="small" style={{ marginTop: 16 }}>
                    <Table 
                      dataSource={selectedOrder.paymentSchedules} 
                      rowKey="id" 
                      pagination={false} 
                      size="small"
                      columns={[
                        { title: 'Đợt', dataIndex: 'phaseName' },
                        { title: 'Số tiền', dataIndex: 'amount', render: v => formatPrice(v) },
                        { title: 'Trạng thái', dataIndex: 'status', render: s => <Tag color={s === 'Paid' ? 'success' : 'warning'}>{s}</Tag> }
                      ]}
                    />
                  </Card>
                )}
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyOrders;
