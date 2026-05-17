import React, { useState, useEffect } from 'react';
import { Typography, Tabs, Table, Tag, Button, Card, Row, Col, Statistic, message, Modal, Space, Tooltip, Input, Select } from 'antd';
import { FileTextOutlined, CarOutlined, DollarOutlined, EyeOutlined, SendOutlined, CheckOutlined, CloseOutlined, SignatureOutlined, BarChartOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import moment from 'moment';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const formatPrice = (n) => n != null ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n) : '—';

const SalesDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState({ receipts: [], vouchers: [] });
  const [loading, setLoading] = useState(false);
  
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [ordRes, conRes, invRes, payRes, vouchRes] = await Promise.all([
        apiClient.get('/api/Orders'),
        apiClient.get('/api/Contracts'),
        apiClient.get('/api/Invoices'),
        apiClient.get('/api/Payments/receipts'),
        apiClient.get('/api/Payments/vouchers')
      ]);
      setOrders(ordRes.data || []);
      setContracts(conRes.data || []);
      setInvoices(invRes.data || []);
      setPayments({ receipts: payRes.data || [], vouchers: vouchRes.data || [] });
    } catch (err) {
      message.error('Lỗi tải dữ liệu Dashboard');
    } finally {
      setLoading(false);
    }
  };

  // ── Thao tác Đơn hàng ──
  const handleUpdateOrderStatus = async () => {
    try {
      await apiClient.put(`/api/Orders/${selectedOrder.maDonHang}/status`, { status: newStatus, note: statusNote });
      message.success('Đã cập nhật trạng thái đơn hàng!');
      setStatusModalVisible(false);
      setStatusNote('');
      loadAll();
    } catch (err) {
      message.error(err.response?.data?.message || 'Lỗi cập nhật trạng thái');
    }
  };

  const orderColumns = [
    { title: 'Mã ĐH', dataIndex: 'orderCode', render: (v, r) => <b>{v || `ĐH-${r.maDonHang}`}</b> },
    { title: 'Khách hàng', dataIndex: 'khachHang', render: k => k?.tenKH || '—' },
    { title: 'Tổng tiền', dataIndex: 'tongGiaTri', render: v => formatPrice(v) },
    { title: 'Trạng thái', dataIndex: 'status', render: s => {
      const map = { 
        Created: ['default', 'Vừa tạo'], 
        Confirmed: ['warning', 'Chốt đơn'], 
        ContractDraft: ['processing', 'Đang soạn HĐ'],
        ContractSigned: ['processing', 'Đã ký HĐ'],
        Processing: ['processing', 'Đang xử lý (Kho/KT)'],
        Delivered_Accepted: ['success', 'Đã nghiệm thu'],
        InvoiceIssued: ['success', 'Đã xuất HĐ'],
        Completed: ['success', 'Hoàn thành']
      };
      const [c, t] = map[s] || ['default', s];
      return <Tag color={c}>{t}</Tag>;
    }},
    { title: 'Ngày tạo', dataIndex: 'ngayDat', render: d => moment(d).format('DD/MM/YY') },
    { title: 'Thao tác', key: 'action', render: (_, r) => (
      <Space>
        <Button size="small" icon={<EyeOutlined />} onClick={() => navigate(`/admin/orders/create/${r.quoteRequestId}?view=${r.maDonHang}`)}>Xem</Button>
        <Button size="small" icon={<EditOutlined />} onClick={() => { setSelectedOrder(r); setNewStatus(r.status); setStatusModalVisible(true); }}>Cập nhật</Button>
        
        {/* Hợp đồng */}
        {(r.status === 'Confirmed' || r.status === 'Created') && !r.contract && (
          <Button type="primary" ghost size="small" icon={<FileTextOutlined />} onClick={() => navigate(`/admin/contracts/create/${r.maDonHang}`)}>Lập HĐ</Button>
        )}

        {/* Xuất kho */}
        {['ContractSigned', 'Processing'].includes(r.status) && (
          <Tooltip title="Tạo phiếu xuất kho"><Button size="small" icon={<CarOutlined />} onClick={() => navigate(`/admin/delivery/create/${r.maDonHang}`)}>Xuất kho</Button></Tooltip>
        )}

        {/* Hóa đơn */}
        {r.status === 'Delivered_Accepted' && !r.invoice && (
          <Tooltip title="Lập hóa đơn tài chính"><Button size="small" type="primary" icon={<DollarOutlined />} onClick={() => navigate(`/admin/invoices/create/${r.maDonHang}`)}>Xuất HĐ</Button></Tooltip>
        )}
      </Space>
    )}
  ];

  // ── Thao tác Hợp đồng ──
  const submitContract = async (id) => { try { await apiClient.put(`/api/Contracts/${id}/submit`); message.success('Đã gửi duyệt!'); loadAll(); } catch(e) { message.error('Lỗi gửi duyệt'); } };
  const approveContract = async (id) => { try { await apiClient.put(`/api/Contracts/${id}/approve`); message.success('Đã duyệt hợp đồng!'); loadAll(); } catch(e) { message.error('Lỗi duyệt'); } };
  const rejectContract = async (id) => { try { await apiClient.put(`/api/Contracts/${id}/reject`, { reason: 'Cần chỉnh sửa' }); message.info('Đã từ chối, HĐ trả về nháp.'); loadAll(); } catch(e) { message.error('Lỗi từ chối'); } };
  const signContract = async (id) => { try { await apiClient.put(`/api/Contracts/${id}/sign`); message.success('Hợp đồng đã được ký kết!'); loadAll(); } catch(e) { message.error('Lỗi ký kết'); } };
  const issueInvoice = async (id) => { try { await apiClient.put(`/api/Invoices/${id}/issue`); message.success('Đã phát hành hóa đơn!'); loadAll(); } catch(e) { message.error('Lỗi phát hành HĐ'); } };

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
        <Button size="small" icon={<EyeOutlined />} onClick={() => navigate(`/admin/contracts/create/${r.maDonHang}?view=${r.maHopDong}`)}>Xem</Button>
        {r.status === 'Draft' && <Button size="small" type="primary" icon={<SendOutlined />} onClick={() => submitContract(r.maHopDong)}>Gửi duyệt</Button>}
        {r.status === 'PendingApproval' && (user?.role === 'Admin' || user?.role === 'Manager') && (
          <>
            <Button size="small" type="primary" style={{ background: '#52c41a' }} icon={<CheckOutlined />} onClick={() => approveContract(r.maHopDong)}>Duyệt</Button>
            <Button size="small" danger icon={<CloseOutlined />} onClick={() => rejectContract(r.maHopDong)}>Từ chối</Button>
          </>
        )}
        {r.status === 'Approved' && user?.role === 'User' && <Button size="small" type="primary" icon={<SignatureOutlined />} onClick={() => signContract(r.maHopDong)}>Khách hàng Ký</Button>}
      </Space>
    )}
  ];

  const invoiceColumns = [
    { title: 'Số HĐ', dataIndex: 'invoiceNumber', render: v => <b>{v}</b> },
    { title: 'Khách hàng', dataIndex: 'buyerName' },
    { title: 'Tổng tiền', dataIndex: 'totalAmount', render: v => formatPrice(v) },
    { title: 'Trạng thái', dataIndex: 'status', render: s => <Tag color={s === 'Issued' ? 'success' : 'default'}>{s === 'Issued' ? 'Đã phát hành' : 'Nháp'}</Tag> },
    { title: 'Ngày', dataIndex: 'invoiceDate', render: d => moment(d).format('DD/MM/YY') },
    { title: 'Thao tác', key: 'action', render: (_, r) => (
      <Space>
        <Button size="small" icon={<EyeOutlined />} onClick={() => navigate(`/admin/invoices/create/${r.maDonHang}?view=${r.maHoaDon}`)}>Xem</Button>
        {r.status === 'Draft' && <Button size="small" type="primary" onClick={() => issueInvoice(r.maHoaDon)}>Phát hành</Button>}
      </Space>
    )}
  ];

  const tabItems = [
    { key: 'orders', label: <span><FileTextOutlined /> Đơn hàng ({orders.length})</span>, children: <Table columns={orderColumns} dataSource={orders} rowKey="maDonHang" loading={loading} pagination={{ pageSize: 10 }} /> },
    { key: 'contracts', label: <span><FileTextOutlined /> Hợp đồng ({contracts.filter(c => c.status === 'PendingApproval').length} chờ duyệt)</span>, children: <Table columns={contractColumns} dataSource={contracts} rowKey="maHopDong" loading={loading} pagination={{ pageSize: 10 }} /> },
    { key: 'invoices', label: <span><DollarOutlined /> Hóa đơn ({invoices.length})</span>, children: <Table columns={invoiceColumns} dataSource={invoices} rowKey="maHoaDon" loading={loading} pagination={{ pageSize: 10 }} /> },
    { key: 'debts', label: <span><BarChartOutlined /> Quản lý Phiếu thu ({payments.receipts.filter(r => !r.isPaid).length} chờ duyệt)</span>, children: <DebtTab receipts={payments.receipts} orders={orders} onReload={loadAll} /> },
  ];

  const pendingContractsCount = contracts.filter(c => c.status === 'PendingApproval').length;
  const processingOrdersCount = orders.filter(o => o.status === 'Processing').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.tongGiaTri || 0), 0);
  const totalCollected = payments.receipts.reduce((sum, r) => sum + r.soTien, 0);

  return (
    <div style={{ padding: '24px', minHeight: '80vh' }}>
      <Card style={{ borderRadius: 12, minHeight: 720 }} styles={{ body: { padding: 24 } }}>
        <Title level={3} style={{ marginBottom: 24 }}>📊 Dashboard Kinh doanh</Title>

        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}><Card><Statistic title="HĐ chờ duyệt" value={pendingContractsCount} styles={{ content: { color: '#faad14' } }} /></Card></Col>
          <Col span={6}><Card><Statistic title="Đang xử lý (Kho/KT)" value={processingOrdersCount} styles={{ content: { color: '#1677ff' } }} /></Card></Col>
          <Col span={6}><Card><Statistic title="Doanh thu tạm tính" value={totalRevenue} styles={{ content: { color: '#cf1322' } }} formatter={v => formatPrice(v)} /></Card></Col>
          <Col span={6}><Card><Statistic title="Đã thu tiền" value={totalCollected} formatter={v => formatPrice(v)} styles={{ content: { color: '#52c41a' } }} /></Card></Col>
        </Row>

        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} size="large" />
      </Card>

      <Modal title="Cập nhật Trạng thái Đơn hàng" open={statusModalVisible} onOk={handleUpdateOrderStatus} onCancel={() => setStatusModalVisible(false)}>
        <p>Chọn trạng thái mới cho Đơn hàng <b>{selectedOrder?.orderCode || `ĐH-${selectedOrder?.maDonHang}`}</b>:</p>
        <Select value={newStatus} onChange={setNewStatus} style={{ width: '100%', marginBottom: 16 }}>
          <Option value="Created">Vừa tạo</Option>
          <Option value="Confirmed">Chốt đơn</Option>
          <Option value="ContractDraft">Đang soạn HĐ</Option>
          <Option value="ContractSigned">Đã ký HĐ</Option>
          <Option value="Processing">Đang xử lý (Kho/KT)</Option>
          <Option value="Delivered_Accepted">Đã nghiệm thu</Option>
          <Option value="InvoiceIssued">Đã xuất HĐ</Option>
          <Option value="Completed">Hoàn thành</Option>
          <Option value="Cancelled">Đã hủy</Option>
        </Select>
        <TextArea rows={3} placeholder="Ghi chú nội bộ..." value={statusNote} onChange={e => setStatusNote(e.target.value)} />
      </Modal>
    </div>
  );
};

const DebtTab = ({ receipts, orders, onReload }) => {
  const handleConfirmReceipt = async (id) => {
    try {
      await apiClient.put(`/api/Payments/receipts/${id}/confirm`);
      message.success('Đã xác nhận thanh toán! Hệ thống đã tự động xuất Hóa đơn & Bảo hành.');
      if (onReload) onReload();
    } catch (err) {
      message.error(err.response?.data?.message || 'Lỗi xác nhận thanh toán');
    }
  };

  const columns = [
    { title: 'Mã phiếu', dataIndex: 'maPhieuThu', render: v => <b>PT-{v}</b> },
    { title: 'Đơn hàng', dataIndex: ['donDatHang', 'orderCode'], render: (v, r) => <b>{v || (r.maDonHang ? `ĐH-${r.maDonHang}` : '—')}</b> },
    { title: 'Khách hàng', dataIndex: ['khachHang', 'tenKH'], render: v => v || '—' },
    { title: 'Ngày lập', dataIndex: 'ngayThu', render: d => moment(d).format('DD/MM/YYYY HH:mm') },
    { title: 'Số tiền', dataIndex: 'soTien', render: v => <span style={{ color: '#cf1322', fontWeight: 'bold' }}>{formatPrice(v)}</span> },
    { title: 'Trạng thái', dataIndex: 'isPaid', render: v => v ? <Tag color="success">Đã thu tiền</Tag> : <Tag color="warning">Chờ xác nhận</Tag> },
    { title: 'Thao tác', key: 'action', render: (_, r) => !r.isPaid && (
      <Button size="small" type="primary" style={{ background: '#52c41a' }} icon={<CheckOutlined />} onClick={() => handleConfirmReceipt(r.maPhieuThu)}>
        Xác nhận Đã thu
      </Button>
    )},
  ];

  return (
    <Card size="small" title="Danh sách Phiếu thu chờ kế toán duyệt">
      <Table columns={columns} dataSource={receipts} rowKey="maPhieuThu" pagination={{ pageSize: 10 }} />
    </Card>
  );
};

export default SalesDashboard;
