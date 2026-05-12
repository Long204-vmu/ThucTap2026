import React, { useState, useEffect } from 'react';
import { Typography, Form, Input, InputNumber, Select, Table, Button, message, Card, Divider, Space, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';

const { Title } = Typography;
const { TextArea } = Input;

const CreateOrder = () => {
  const { quoteId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [quote, setQuote] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentPhases, setPaymentPhases] = useState([
    { phaseName: 'Tạm ứng', phaseOrder: 1, percentage: 30, dueDate: null, note: '' },
    { phaseName: 'Giao hàng', phaseOrder: 2, percentage: 50, dueDate: null, note: '' },
    { phaseName: 'Nghiệm thu', phaseOrder: 3, percentage: 20, dueDate: null, note: '' },
  ]);

  useEffect(() => { loadQuote(); }, [quoteId]);

  const loadQuote = async () => {
    try {
      const res = await apiClient.get('/api/QuoteRequests/my-requests');
      // Fallback: load all quotes for admin
      const allRes = await apiClient.get('/api/QuoteRequests');
      const q = allRes.data.find(r => r.id === parseInt(quoteId));
      if (q) {
        setQuote(q);
        setItems(q.items?.map((item, idx) => ({
          key: idx,
          productId: item.productId,
          productName: item.productName,
          unit: 'Cái',
          quantity: item.quantity,
          unitPrice: item.referencePrice || 0,
          totalPrice: (item.referencePrice || 0) * item.quantity,
          serialNumbersJson: '',
          installLocation: '',
        })) || []);
      } else {
        message.error('Không tìm thấy báo giá');
      }
    } catch (err) {
      message.error('Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const updateItem = (key, field, value) => {
    setItems(prev => prev.map(item => {
      if (item.key !== key) return item;
      const updated = { ...item, [field]: value };
      if (field === 'quantity' || field === 'unitPrice') {
        updated.totalPrice = (updated.quantity || 0) * (updated.unitPrice || 0);
      }
      return updated;
    }));
  };

  const totalAmount = items.reduce((sum, i) => sum + (i.totalPrice || 0), 0);
  const formatPrice = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const payload = {
        quoteRequestId: parseInt(quoteId),
        paymentMethod: form.getFieldValue('paymentMethod') || 'HợpĐồng',
        note: form.getFieldValue('note'),
        items: items.map(i => ({
          productId: i.productId,
          productName: i.productName,
          unit: i.unit,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          serialNumbersJson: i.serialNumbersJson || null,
          installLocation: i.installLocation || null,
        })),
        paymentSchedules: paymentPhases.map(p => ({
          phaseName: p.phaseName,
          phaseOrder: p.phaseOrder,
          percentage: p.percentage,
          dueDate: p.dueDate || null,
          note: p.note || null,
        })),
      };

      await apiClient.post('/api/Orders', payload);
      message.success('Tạo đơn hàng thành công!');
      navigate('/admin/sales');
    } catch (err) {
      message.error(err.response?.data?.message || 'Lỗi tạo đơn hàng');
    } finally {
      setSubmitting(false);
    }
  };

  const itemColumns = [
    { title: 'Tên thiết bị', dataIndex: 'productName', width: 200 },
    { title: 'ĐVT', dataIndex: 'unit', width: 80, render: (v, r) => <Input size="small" value={v} onChange={e => updateItem(r.key, 'unit', e.target.value)} /> },
    { title: 'SL', dataIndex: 'quantity', width: 80, render: (v, r) => <InputNumber size="small" min={1} value={v} onChange={val => updateItem(r.key, 'quantity', val)} /> },
    { title: 'Đơn giá (VNĐ)', dataIndex: 'unitPrice', width: 160, render: (v, r) => <InputNumber size="small" min={0} value={v} onChange={val => updateItem(r.key, 'unitPrice', val)} formatter={val => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={val => val.replace(/,/g, '')} style={{ width: '100%' }} /> },
    { title: 'Thành tiền', dataIndex: 'totalPrice', width: 140, render: v => <b style={{ color: '#cf1322' }}>{formatPrice(v)}</b> },
    { title: 'Serial Numbers', dataIndex: 'serialNumbersJson', width: 160, render: (v, r) => <Input size="small" placeholder='["SN001"]' value={v} onChange={e => updateItem(r.key, 'serialNumbersJson', e.target.value)} /> },
    { title: 'Vị trí lắp đặt', dataIndex: 'installLocation', width: 140, render: (v, r) => <Input size="small" value={v} onChange={e => updateItem(r.key, 'installLocation', e.target.value)} /> },
  ];

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Đang tải...</div>;
  if (!quote) return <div style={{ padding: 40, textAlign: 'center' }}>Không tìm thấy báo giá</div>;

  return (
    <div style={{ padding: '24px', background: '#fff', borderRadius: 8, minHeight: '80vh' }}>
      <Title level={3}>📦 Tạo Đơn hàng từ Báo giá #{quoteId}</Title>
      <Tag color="blue" style={{ marginBottom: 16 }}>Khách hàng: {quote.user?.fullName} — {quote.user?.email}</Tag>

      <Form form={form} layout="vertical" initialValues={{ paymentMethod: 'HợpĐồng' }}>
        <Card title="Danh sách thiết bị" size="small" style={{ marginBottom: 16 }}>
          <Table columns={itemColumns} dataSource={items} rowKey="key" pagination={false} size="small" bordered scroll={{ x: 1000 }} />
          <Divider />
          <div style={{ textAlign: 'right', fontSize: 18 }}>
            <b>TỔNG CỘNG: </b><span style={{ color: '#cf1322', fontWeight: 700 }}>{formatPrice(totalAmount)}</span>
          </div>
        </Card>

        <Card title="Lịch thanh toán theo đợt" size="small" style={{ marginBottom: 16 }}>
          <Table
            dataSource={paymentPhases}
            rowKey="phaseOrder"
            pagination={false}
            size="small"
            bordered
            columns={[
              { title: 'Đợt', dataIndex: 'phaseName', width: 120 },
              { title: '% Thanh toán', dataIndex: 'percentage', width: 120, render: (v, _, idx) => <InputNumber min={0} max={100} value={v} onChange={val => { const nw = [...paymentPhases]; nw[idx].percentage = val; setPaymentPhases(nw); }} addonAfter="%" /> },
              { title: 'Số tiền', key: 'amount', render: (_, r) => formatPrice(totalAmount * r.percentage / 100) },
              { title: 'Ghi chú', dataIndex: 'note', render: (v, _, idx) => <Input value={v} onChange={e => { const nw = [...paymentPhases]; nw[idx].note = e.target.value; setPaymentPhases(nw); }} /> },
            ]}
          />
        </Card>

        <Space>
          <Form.Item name="paymentMethod" label="Phương thức">
            <Select style={{ width: 200 }}>
              <Select.Option value="HợpĐồng">Hợp đồng</Select.Option>
              <Select.Option value="TrựcTiếp">Trực tiếp</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <TextArea rows={2} style={{ width: 400 }} />
          </Form.Item>
        </Space>

        <Divider />
        <Button type="primary" size="large" icon={<SaveOutlined />} onClick={handleSubmit} loading={submitting} style={{ height: 48, fontWeight: 600 }}>
          Tạo Đơn hàng
        </Button>
      </Form>
    </div>
  );
};

export default CreateOrder;
