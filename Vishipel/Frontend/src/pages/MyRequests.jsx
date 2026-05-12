import React, { useState, useEffect } from 'react';
import { Table, Tag, Typography, message, Modal, Descriptions, Button, Input, Space } from 'antd';
import { EyeOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import apiClient from '../services/apiClient';
import moment from 'moment';

const { Title } = Typography;
const { TextArea } = Input;

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const formatPrice = (n) => n != null ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n) : 'Đang cập nhật';

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await apiClient.get('/api/QuoteRequests/my-requests');
      setRequests(res.data);
    } catch (error) {
      message.error("Lỗi khi tải lịch sử yêu cầu");
    } finally {
      setLoading(false);
    }
  };

  const showDetails = (record) => {
    setSelectedRequest(record);
    setIsModalVisible(true);
  };

  const handleAccept = async () => {
    try {
      setActionLoading(true);
      await apiClient.put(`/api/QuoteRequests/${selectedRequest.id}/accept`);
      message.success('Bạn đã xác nhận báo giá thành công!');
      setIsModalVisible(false);
      fetchRequests();
    } catch (err) {
      message.error(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setActionLoading(true);
      await apiClient.put(`/api/QuoteRequests/${selectedRequest.id}/reject`, { reason: rejectReason });
      message.success('Bạn đã từ chối báo giá.');
      setRejectModalVisible(false);
      setIsModalVisible(false);
      setRejectReason('');
      fetchRequests();
    } catch (err) {
      message.error(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusTag = (status) => {
    const map = {
      Pending:  { color: 'processing', text: 'Đang chờ Sale' },
      Quoted:   { color: 'warning',    text: '💰 Đã có Báo Giá' },
      Accepted: { color: 'success',    text: '✅ Đã xác nhận' },
      Rejected: { color: 'error',      text: '❌ Đã từ chối' },
    };
    const info = map[status] || { color: 'default', text: status };
    return <Tag color={info.color} style={{ fontWeight: 600 }}>{info.text}</Tag>;
  };

  const columns = [
    {
      title: 'Mã YC',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <b>#{id}</b>
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => moment(date).format('DD/MM/YYYY HH:mm')
    },
    {
      title: 'Số thiết bị',
      key: 'itemCount',
      render: (_, record) => record.items?.length || 0
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status)
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => showDetails(record)} icon={<EyeOutlined />}>Xem chi tiết</Button>
      )
    }
  ];

  const itemColumns = [
    {
      title: 'Tên thiết bị',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      align: 'center'
    }
  ];

  return (
    <div style={{ padding: '40px 5%', marginTop: 68, minHeight: '80vh', background: '#f5f7fa' }}>
      <div style={{ background: '#fff', padding: '32px 24px', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', maxWidth: 1200, margin: '0 auto' }}>
        <Title level={3} style={{ marginBottom: 24, color: '#001529' }}>Lịch sử Yêu cầu Báo giá</Title>
        <Table 
          columns={columns} 
          dataSource={requests} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      <Modal
        title={<span style={{ fontSize: 18 }}>Chi tiết Yêu cầu #{selectedRequest?.id}</span>}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={
          <Space>
            {selectedRequest?.status === 'Quoted' && (
              <>
                <Button 
                  type="primary" 
                  icon={<CheckCircleOutlined />} 
                  onClick={handleAccept} 
                  loading={actionLoading}
                  style={{ background: '#52c41a', borderColor: '#52c41a' }}
                >
                  ✅ Xác nhận Báo giá
                </Button>
                <Button 
                  danger 
                  icon={<CloseCircleOutlined />} 
                  onClick={() => setRejectModalVisible(true)}
                >
                  ❌ Từ chối
                </Button>
              </>
            )}
            <Button onClick={() => setIsModalVisible(false)}>Đóng</Button>
          </Space>
        }
        width={750}
      >
        {selectedRequest && (
          <div style={{ marginTop: 20 }}>
            {selectedRequest.status === 'Quoted' && (
              <div style={{ padding: 20, background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 8, marginBottom: 24 }}>
                <div style={{ fontSize: 14, color: '#d48806', fontWeight: 600, marginBottom: 8 }}>💰 BÁO GIÁ TỪ VISHIPEL — VUI LÒNG XÁC NHẬN:</div>
                <div style={{ fontSize: 15, color: '#000', whiteSpace: 'pre-wrap', marginBottom: 12 }}>
                  {selectedRequest.adminReply || 'Chúng tôi xin gửi báo giá chi tiết cho yêu cầu của bạn.'}
                </div>
                {selectedRequest.totalQuotedPrice && (
                   <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderTop: '1px dashed #ffe58f', paddingTop: 12 }}>
                     <span style={{ fontWeight: 500, color: '#555' }}>Tổng chi phí ước tính:</span>
                     <span style={{ fontSize: 20, fontWeight: 'bold', color: '#cf1322' }}>{formatPrice(selectedRequest.totalQuotedPrice)}</span>
                   </div>
                )}
              </div>
            )}

            {selectedRequest.status === 'Accepted' && (
              <div style={{ padding: 20, background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 8, marginBottom: 24 }}>
                <div style={{ fontSize: 14, color: '#389e0d', fontWeight: 600 }}>✅ Bạn đã xác nhận báo giá này. Đơn hàng sẽ được xử lý sớm.</div>
                {selectedRequest.totalQuotedPrice && (
                   <div style={{ marginTop: 8, fontSize: 16, fontWeight: 'bold', color: '#cf1322' }}>{formatPrice(selectedRequest.totalQuotedPrice)}</div>
                )}
              </div>
            )}

            {selectedRequest.status === 'Rejected' && (
              <div style={{ padding: 20, background: '#fff2f0', border: '1px solid #ffccc7', borderRadius: 8, marginBottom: 24 }}>
                <div style={{ fontSize: 14, color: '#cf1322', fontWeight: 600 }}>❌ Bạn đã từ chối báo giá này.</div>
                {selectedRequest.rejectionReason && (
                  <div style={{ marginTop: 8, color: '#666' }}>Lý do: {selectedRequest.rejectionReason}</div>
                )}
              </div>
            )}
          
            <Descriptions bordered column={1} size="small" style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Ngày gửi">{moment(selectedRequest.createdAt).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
              <Descriptions.Item label="Ghi chú của bạn">{selectedRequest.note || 'Không có ghi chú'}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái hiện tại">{getStatusTag(selectedRequest.status)}</Descriptions.Item>
            </Descriptions>

            <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 15 }}>Danh sách thiết bị yêu cầu:</div>
            <Table 
              columns={itemColumns} 
              dataSource={selectedRequest.items} 
              rowKey="id" 
              pagination={false} 
              size="small"
              bordered
            />
          </div>
        )}
      </Modal>

      {/* Modal từ chối - nhập lý do */}
      <Modal
        title="Từ chối báo giá"
        open={rejectModalVisible}
        onCancel={() => { setRejectModalVisible(false); setRejectReason(''); }}
        onOk={handleReject}
        okText="Xác nhận từ chối"
        okButtonProps={{ danger: true, loading: actionLoading }}
        cancelText="Hủy"
      >
        <p style={{ marginBottom: 12 }}>Vui lòng nhập lý do từ chối (không bắt buộc):</p>
        <TextArea 
          rows={3} 
          placeholder="VD: Giá chưa phù hợp, cần thương lượng thêm..." 
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default MyRequests;
