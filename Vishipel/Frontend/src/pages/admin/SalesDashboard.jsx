import React, { useState, useEffect } from 'react';
import { Typography, Tabs, Table, Tag, Button, Card, Row, Col, Statistic, message, Modal, Space, Tooltip } from 'antd';
import { ShoppingCartOutlined, FileTextOutlined, CarOutlined, DollarOutlined, PlusOutlined, EyeOutlined, CheckCircleOutlined, SendOutlined, EditOutlined, DashboardOutlined, ToolOutlined, BarChartOutlined, LockOutlined, AuditOutlined, ShoppingOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import moment from 'moment';

const { Title } = Typography;

const formatPrice = (n) => n != null ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n) : '—';

const SalesDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('quotes');
  const [quotes, setQuotes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [qRes, oRes, cRes, iRes] = await Promise.all([
        apiClient.get('/api/QuoteRequests'),
        apiClient.get('/api/Orders'),
        apiClient.get('/api/Contracts').catch(() => ({ data: [] })),
        apiClient.get('/api/Invoices').catch(() => ({ data: [] })),
      ]);
      setQuotes(qRes.data);
      setOrders(oRes.data);
      setContracts(cRes.data);
      setInvoices(iRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── Thẻ thống kê ──
  const acceptedQuotes = quotes.filter(q => q.status === 'Accepted');
  const pendingContracts = contracts.filter(c => c.status === 'PendingApproval');
  const activeOrders = orders.filter(o => !['Completed', 'Created'].includes(o.status));

  // ── Tab 1: Báo giá đã xác nhận (chờ tạo đơn hàng) ──
  const quoteColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Khách hàng', key: 'customer', render: (_, r) => <div><div style={{ fontWeight: 600 }}>{r.user?.fullName}</div><div style={{ color: '#8c8c8c', fontSize: 12 }}>{r.user?.email}</div></div> },
    { title: 'Thiết bị', key: 'items', render: (_, r) => r.items?.length || 0, align: 'center' },
    { title: 'Giá báo', dataIndex: 'totalQuotedPrice', render: v => formatPrice(v) },
    { title: 'Trạng thái', dataIndex: 'status', render: s => {
      const map = { Pending: ['processing', 'Chờ báo giá'], Quoted: ['warning', 'Đã báo giá'], Accepted: ['success', 'Đã xác nhận'], Rejected: ['error', 'Từ chối'] };
      const [c, t] = map[s] || ['default', s];
      return <Tag color={c}>{t}</Tag>;
    }},
    { title: 'Ngày', dataIndex: 'createdAt', render: d => moment(d).format('DD/MM/YY') },
    { title: 'Thao tác', key: 'action', render: (_, r) => (
      <Space>
        {r.status === 'Accepted' && !orders.some(o => o.quoteRequestId === r.id) && (
          <Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => navigate(`/admin/orders/create/${r.id}`)}>Tạo Đơn hàng</Button>
        )}
        {orders.some(o => o.quoteRequestId === r.id) && <Tag color="green">Đã tạo ĐH</Tag>}
      </Space>
    )}
  ];

  // ── Tab 2: Đơn hàng ──
  const orderColumns = [
    { title: 'Mã ĐH', dataIndex: 'orderCode', key: 'code', render: v => <b>{v}</b> },
    { title: 'Khách hàng', key: 'cust', render: (_, r) => r.customer?.fullName },
    { title: 'Tổng tiền', dataIndex: 'totalAmount', render: v => formatPrice(v) },
    { title: 'Trạng thái', dataIndex: 'status', render: s => {
      const map = { Created: 'blue', ContractDraft: 'orange', ContractSigned: 'green', Delivering: 'cyan', Delivered: 'geekblue', InvoiceIssued: 'purple', Completed: 'success' };
      return <Tag color={map[s] || 'default'}>{s}</Tag>;
    }},
    { title: 'Ngày tạo', dataIndex: 'createdAt', render: d => moment(d).format('DD/MM/YY') },
    { title: 'Thao tác', key: 'action', render: (_, r) => (
      <Space>
        <Button size="small" icon={<EyeOutlined />} onClick={() => navigate(`/admin/orders/create/${r.quoteRequestId}?view=${r.id}`)}>Xem</Button>
        {/* Hợp đồng & Xuất kho */}
        {r.status === 'Created' && !r.contract && (
          <Button type="primary" size="small" icon={<FileTextOutlined />} onClick={() => navigate(`/admin/contracts/create/${r.id}`)}>Lập HĐ</Button>
        )}
        {r.contract?.status === 'Signed' && !r.deliveryOrder && (
          <Tooltip title="Tạo phiếu xuất kho"><Button size="small" icon={<CarOutlined />} onClick={() => navigate(`/admin/delivery/create/${r.id}`)}>Xuất kho</Button></Tooltip>
        )}

        {/* Cập nhật trạng thái Giao hàng */}
        {r.deliveryOrder?.status === 'Pending' && (
          <Tooltip title="Bắt đầu giao hàng"><Button size="small" type="primary" icon={<CarOutlined />} onClick={() => handleUpdateDeliveryStatus(r.deliveryOrder.id, 'deliver')}>Giao ngay</Button></Tooltip>
        )}
        {r.deliveryOrder?.status === 'Delivering' && (
          <Tooltip title="Xác nhận khách đã nhận hàng"><Button size="small" type="primary" ghost icon={<CheckCircleOutlined />} onClick={() => handleUpdateDeliveryStatus(r.deliveryOrder.id, 'confirm')}>Đã giao</Button></Tooltip>
        )}

        {/* Hóa đơn */}
        {['Delivering', 'Delivered'].includes(r.status) && !r.invoice && (
          <Tooltip title="Lập hóa đơn tài chính"><Button size="small" icon={<DollarOutlined />} onClick={() => navigate(`/admin/invoices/create/${r.id}`)}>Xuất HĐ</Button></Tooltip>
        )}
      </Space>
    )}
  ];

  // ── Tab 3: Hợp đồng ──
  const contractColumns = [
    { title: 'Số HĐ', dataIndex: 'contractNumber', render: v => <b>{v}</b> },
    { title: 'Khách hàng', dataIndex: 'partyAName' },
    { title: 'Tổng tiền', dataIndex: 'totalAmount', render: v => formatPrice(v) },
    { title: 'Trạng thái', dataIndex: 'status', render: s => {
      const map = { Draft: ['default', 'Nháp'], PendingApproval: ['warning', 'Chờ duyệt'], Approved: ['processing', 'Đã duyệt'], Signed: ['success', 'Đã ký'] };
      const [c, t] = map[s] || ['default', s];
      return <Tag color={c}>{t}</Tag>;
    }},
    { title: 'Thao tác', key: 'action', render: (_, r) => (
      <Space>
        <Button size="small" icon={<EyeOutlined />} onClick={() => navigate(`/admin/contracts/create/${r.orderId}?view=${r.id}`)}>Xem</Button>
        {r.status === 'Draft' && <Button size="small" type="primary" icon={<SendOutlined />} onClick={() => submitContract(r.id)}>Gửi duyệt</Button>}
        {r.status === 'PendingApproval' && (user.role === 'Admin' || user.role === 'Manager') && (
          <>
            <Button size="small" type="primary" style={{ background: '#52c41a' }} icon={<CheckCircleOutlined />} onClick={() => approveContract(r.id)}>Duyệt</Button>
            <Button size="small" danger onClick={() => rejectContract(r.id)}>Từ chối</Button>
          </>
        )}
        {r.status === 'Approved' && <Button size="small" type="primary" icon={<EditOutlined />} onClick={() => signContract(r.id)}>Ký kết</Button>}
      </Space>
    )}
  ];

  // ── Tab 4: Hóa đơn ──
  const invoiceColumns = [
    { title: 'Số HĐ', dataIndex: 'invoiceNumber', render: v => <b>{v}</b> },
    { title: 'Khách hàng', dataIndex: 'buyerName' },
    { title: 'Tổng tiền', dataIndex: 'totalAmount', render: v => formatPrice(v) },
    { title: 'Trạng thái', dataIndex: 'status', render: s => <Tag color={s === 'Issued' ? 'success' : 'default'}>{s === 'Issued' ? 'Đã phát hành' : 'Nháp'}</Tag> },
    { title: 'Ngày', dataIndex: 'invoiceDate', render: d => moment(d).format('DD/MM/YY') },
    { title: 'Thao tác', key: 'action', render: (_, r) => (
      <Space>
        <Button size="small" icon={<EyeOutlined />} onClick={() => navigate(`/admin/invoices/create/${r.orderId}?view=${r.id}`)}>Xem</Button>
        {r.status === 'Draft' && <Button size="small" type="primary" onClick={() => issueInvoice(r.id)}>Phát hành</Button>}
      </Space>
    )}
  ];

  // ── Actions ──
  const handleUpdateDeliveryStatus = async (deliveryId, action) => {
    try {
      await apiClient.put(`/api/DeliveryOrders/${deliveryId}/${action}`);
      message.success(`Đã cập nhật trạng thái giao hàng!`);
      loadAll();
    } catch (err) {
      message.error(err.response?.data?.message || 'Lỗi cập nhật giao hàng');
    }
  };

  const submitContract = async (id) => { await apiClient.put(`/api/Contracts/${id}/submit`); message.success('Đã gửi duyệt!'); loadAll(); };
  const approveContract = async (id) => { await apiClient.put(`/api/Contracts/${id}/approve`); message.success('Đã duyệt hợp đồng!'); loadAll(); };
  const rejectContract = async (id) => { await apiClient.put(`/api/Contracts/${id}/reject`, { reason: 'Cần chỉnh sửa' }); message.info('Đã từ chối, HĐ trả về nháp.'); loadAll(); };
  const signContract = async (id) => { await apiClient.put(`/api/Contracts/${id}/sign`); message.success('Hợp đồng đã được ký kết!'); loadAll(); };
  const issueInvoice = async (id) => { await apiClient.put(`/api/Invoices/${id}/issue`); message.success('Đã phát hành hóa đơn!'); loadAll(); };

  const tabItems = [
    { key: 'quotes', label: <span><ShoppingCartOutlined /> Báo giá ({acceptedQuotes.length} chờ)</span>, children: <Table columns={quoteColumns} dataSource={quotes} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} /> },
    { key: 'orders', label: <span><FileTextOutlined /> Đơn hàng ({orders.length})</span>, children: <Table columns={orderColumns} dataSource={orders} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} /> },
    { key: 'contracts', label: <span><FileTextOutlined /> Hợp đồng ({pendingContracts.length} chờ duyệt)</span>, children: <Table columns={contractColumns} dataSource={contracts} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} /> },
    { key: 'invoices', label: <span><DollarOutlined /> Hóa đơn ({invoices.length})</span>, children: <Table columns={invoiceColumns} dataSource={invoices} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} /> },
  ];

  return (
    <div style={{ padding: '24px', minHeight: '80vh' }}>
      <Card style={{ borderRadius: 12, minHeight: 720 }} bodyStyle={{ padding: 24 }}>
        <Title level={3} style={{ marginBottom: 24 }}>📊 Dashboard Kinh doanh</Title>

        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}><Card bordered={false} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: 12 }}><Statistic title={<span style={{ color: '#fff' }}>Báo giá chờ tạo ĐH</span>} value={acceptedQuotes.length} valueStyle={{ color: '#fff', fontWeight: 700 }} /></Card></Col>
          <Col xs={24} sm={12} lg={6}><Card bordered={false} style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', borderRadius: 12 }}><Statistic title={<span style={{ color: '#fff' }}>HĐ chờ duyệt</span>} value={pendingContracts.length} valueStyle={{ color: '#fff', fontWeight: 700 }} /></Card></Col>
          <Col xs={24} sm={12} lg={6}><Card bordered={false} style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', borderRadius: 12 }}><Statistic title={<span style={{ color: '#fff' }}>Đơn đang xử lý</span>} value={activeOrders.length} valueStyle={{ color: '#fff', fontWeight: 700 }} /></Card></Col>
          <Col xs={24} sm={12} lg={6}><Card bordered={false} style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', borderRadius: 12 }}><Statistic title={<span style={{ color: '#fff' }}>Tổng doanh thu</span>} value={orders.filter(o => o.status === 'Completed').reduce((s, o) => s + o.totalAmount, 0)} formatter={v => formatPrice(v)} valueStyle={{ color: '#fff', fontWeight: 700 }} /></Card></Col>
        </Row>

        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} size="large" />
      </Card>
    </div>
  );
};

export default SalesDashboard;
