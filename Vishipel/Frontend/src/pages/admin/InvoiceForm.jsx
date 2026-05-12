import React, { useState, useEffect, useRef } from 'react';
import { Typography, Form, Input, InputNumber, Button, Card, Divider, Table, Row, Col, Space, message, Tag } from 'antd';
import { FileProtectOutlined, PrinterOutlined, FilePdfOutlined, ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import moment from 'moment';

const { Title, Text } = Typography;
const { TextArea } = Input;

const formatPrice = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n || 0);

const InvoiceForm = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [order, setOrder] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const printRef = useRef();

  useEffect(() => {
    loadData();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role?.toLowerCase() === 'user') {
      setShowPreview(true);
    }
  }, [orderId]);

  const loadData = async () => {
    try {
      const res = await apiClient.get(`/api/Orders/${orderId}`);
      setOrder(res.data);
      if (res.data.invoice) {
        setInvoice(res.data.invoice);
        form.setFieldsValue(res.data.invoice);
      } else {
        // Mặc định điền thông tin từ đơn hàng/hợp đồng
        form.setFieldsValue({
          buyerName: res.data.customer?.fullName,
          buyerCompany: res.data.contract?.partyAName || res.data.customer?.fullName,
          buyerAddress: res.data.contract?.partyAAddress || res.data.customer?.address,
          buyerTaxCode: res.data.contract?.partyATaxCode,
          content: 'Cung cấp thiết bị theo đơn hàng ' + res.data.orderCode,
          paymentMethod: 'Chuyển khoản',
          vatRate: 10
        });
      }
    } catch (err) {
      message.error('Lỗi khi tải thông tin hóa đơn');
    } finally {
      setLoading(false);
    }
  };

  const onSave = async (values) => {
    try {
      setSubmitting(true);
      if (invoice) {
        await apiClient.put(`/api/Invoices/${invoice.id}`, { ...values, orderId: parseInt(orderId) });
        message.success('Cập nhật hóa đơn thành công!');
      } else {
        const res = await apiClient.post('/api/Invoices', { ...values, orderId: parseInt(orderId) });
        setInvoice(res.data);
        message.success('Tạo hóa đơn thành công!');
      }
      loadData();
    } catch (err) {
      message.error(err.response?.data?.message || 'Lỗi khi lưu hóa đơn');
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportPDF = async () => {
    const html2pdf = (await import('html2pdf.js')).default;
    const element = printRef.current;
    html2pdf().set({
      margin: 10,
      filename: `HoaDon_${invoice?.invoiceNumber || 'Draft'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).from(element).save();
  };

  if (loading) return <div style={{ padding: 50, textAlign: 'center' }}>Đang tải...</div>;
  if (!order) return <div style={{ padding: 50, textAlign: 'center' }}>Không tìm thấy đơn hàng</div>;

  const invoiceData = form.getFieldsValue(true);
  const subTotal = order.totalAmount || 0;
  const vatRate = invoiceData.vatRate || 0;
  const vatAmount = subTotal * vatRate / 100;
  const totalAmount = subTotal + vatAmount;

  return (
    <div style={{ padding: '24px', background: '#fff', borderRadius: 8, minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/sales')} />
          <Title level={3} style={{ margin: 0 }}>🧾 {invoice ? 'Chỉnh sửa' : 'Lập'} Hóa đơn — Đơn hàng {order.orderCode}</Title>
        </Space>
        {invoice && (
          <Space>
            <Tag color={invoice.status === 'Issued' ? 'success' : 'default'}>
              {invoice.status === 'Issued' ? 'Đã phát hành' : 'Bản nháp'}
            </Tag>
            <Button icon={<PrinterOutlined />} onClick={() => setShowPreview(!showPreview)}>
              {showPreview ? 'Ẩn xem trước' : 'Xem trước & In'}
            </Button>
          </Space>
        )}
      </div>

      {!showPreview ? (
        <Form form={form} layout="vertical" onFinish={onSave}>
          <Row gutter={24}>
            <Col span={16}>
              <Card title="Thông tin khách hàng trên hóa đơn" size="small" style={{ marginBottom: 16 }}>
                <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item name="recipientName" label="Kính gửi (Đại diện)"><Input /></Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="buyerName" label="Tên người mua hàng"><Input /></Form.Item>
                  </Col>
                </Row>
                <Form.Item name="buyerCompany" label="Đơn vị công tác (Công ty)" rules={[{ required: true }]}><Input /></Form.Item>
                <Form.Item name="buyerAddress" label="Địa chỉ khách hàng"><Input /></Form.Item>
                <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item name="buyerTaxCode" label="Mã số thuế / CMND"><Input /></Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="department" label="Phòng chuyên môn / Đơn vị"><Input /></Form.Item>
                  </Col>
                </Row>
              </Card>

              <Card title="Chi tiết hàng hóa" size="small">
                <Table 
                  dataSource={order.items} 
                  rowKey="id" 
                  pagination={false} 
                  size="small" 
                  bordered
                  columns={[
                    { title: 'STT', key: 'stt', width: 50, render: (_, __, i) => i + 1 },
                    { title: 'Tên hàng hóa, dịch vụ', dataIndex: 'productName' },
                    { title: 'Đơn giá', dataIndex: 'unitPrice', render: v => formatPrice(v) },
                    { title: 'Số lượng', dataIndex: 'quantity', align: 'center' },
                    { title: 'Thành tiền', dataIndex: 'totalPrice', render: v => formatPrice(v) }
                  ]}
                />
              </Card>
            </Col>

            <Col span={8}>
              <Card title="Thông tin thanh toán & Thuế" size="small">
                <Form.Item name="content" label="Nội dung hóa đơn"><TextArea rows={2} /></Form.Item>
                <Form.Item name="paymentMethod" label="Hình thức thanh toán">
                  <Input placeholder="Tiền mặt/Chuyển khoản..." />
                </Form.Item>
                <Form.Item name="bankAccount" label="Số tài khoản (nếu có)"><Input /></Form.Item>
                
                <Divider />
                
                <Form.Item name="vatRate" label="Thuế suất VAT (%)">
                  <InputNumber min={0} max={100} style={{ width: '100%' }} addonAfter="%" />
                </Form.Item>

                <div style={{ padding: '12px', background: '#fafafa', borderRadius: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text>Tổng tiền:</Text>
                    <Text strong>{formatPrice(subTotal)}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text>Tiền thuế VAT:</Text>
                    <Text strong>{formatPrice(vatAmount)}</Text>
                  </div>
                  <Divider style={{ margin: '8px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong>Thành tiền:</Text>
                    <Text strong style={{ color: '#cf1322', fontSize: 16 }}>{formatPrice(totalAmount)}</Text>
                  </div>
                </div>
              </Card>

              <div style={{ marginTop: 24 }}>
                {JSON.parse(localStorage.getItem('user') || '{}').role?.toLowerCase() !== 'user' && (
                  <Button type="primary" htmlType="submit" size="large" icon={<SaveOutlined />} block loading={submitting} disabled={invoice?.status === 'Issued'}>
                    {invoice ? 'Cập nhật hóa đơn' : 'Tạo hóa đơn'}
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </Form>
      ) : (
        /* ── PREVIEW HÓA ĐƠN ── */
        <div>
          <Space style={{ marginBottom: 16 }}>
            <Button type="primary" icon={<FilePdfOutlined />} onClick={handleExportPDF}>Xuất PDF</Button>
            <Button icon={<PrinterOutlined />} onClick={() => window.print()}>In hóa đơn</Button>
          </Space>
          <div ref={printRef} style={{ padding: '40px', border: '1px solid #d9d9d9', background: '#fff', maxWidth: 800, margin: '0 auto', fontFamily: '"Times New Roman", serif', color: '#000' }}>
            <Row>
              <Col span={14}>
                <div style={{ fontWeight: 700, fontSize: 10 }}>CÔNG TY TNHH MTV THÔNG TIN</div>
                <div style={{ fontWeight: 700, fontSize: 10 }}>ĐIỆN TỬ HÀNG HẢI VIỆT NAM</div>
                <div style={{ fontWeight: 700, fontSize: 10 }}>PHÒNG CHUYÊN MÔN/ ĐƠN VỊ: {invoiceData.department || '............'}</div>
              </Col>
              <Col span={10} style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: 10 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                <div style={{ fontWeight: 700, fontSize: 10 }}>Độc lập — Tự do — Hạnh phúc</div>
              </Col>
            </Row>

            <div style={{ textAlign: 'center', margin: '30px 0' }}>
              <Title level={2} style={{ margin: 0, fontWeight: 700, fontSize: 24 }}>HÓA ĐƠN BÁN HÀNG</Title>
              <div style={{ fontStyle: 'italic', fontSize: 11 }}>Số: {invoice?.invoiceNumber || '............'} &emsp; Ngày {moment(invoiceData.invoiceDate).format('DD')} tháng {moment(invoiceData.invoiceDate).format('MM')} năm {moment(invoiceData.invoiceDate).format('YYYY')}</div>
            </div>

            <div style={{ fontSize: 12, lineHeight: 2 }}>
              <div>Kính gửi: &emsp; {invoiceData.recipientName || 'Ông Tổng Giám đốc Công ty'}</div>
              <div>Tên tôi là: {invoiceData.buyerName || '....................................................................................'}</div>
              <div>Đơn vị công tác: {invoiceData.buyerCompany || '....................................................................................'}</div>
              <div>Đề nghị Công ty viết hóa đơn cho khách hàng {invoiceData.buyerCompany} theo các thông tin như sau:</div>
              <div style={{ paddingLeft: 20 }}>
                <div>- Địa chỉ: {invoiceData.buyerAddress || '....................................................................................'}</div>
                <div>- CMND/ Mã số thuế: {invoiceData.buyerTaxCode || '....................................................................................'}</div>
                <div>- Nội dung: {invoiceData.content || '....................................................................................'}</div>
                <div>- Hình thức thanh toán: {invoiceData.paymentMethod}</div>
                <div>- STK: {invoiceData.bankAccount || '....................................................................................'}</div>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20, fontSize: 12 }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #000', padding: 8 }}>STT</th>
                  <th style={{ border: '1px solid #000', padding: 8 }}>Tên hàng</th>
                  <th style={{ border: '1px solid #000', padding: 8 }}>Đơn giá (VND)</th>
                  <th style={{ border: '1px solid #000', padding: 8 }}>Số lượng</th>
                  <th style={{ border: '1px solid #000', padding: 8 }}>Thành tiền (VND)</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>{idx + 1}</td>
                    <td style={{ border: '1px solid #000', padding: 8 }}>{item.productName}</td>
                    <td style={{ border: '1px solid #000', padding: 8, textAlign: 'right' }}>{formatPrice(item.unitPrice)}</td>
                    <td style={{ border: '1px solid #000', padding: 8, textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ border: '1px solid #000', padding: 8, textAlign: 'right' }}>{formatPrice(item.totalPrice)}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={4} style={{ border: '1px solid #000', padding: 8, textAlign: 'right', fontWeight: 700 }}>Tổng:</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'right' }}>{formatPrice(subTotal)}</td>
                </tr>
                <tr>
                  <td colSpan={4} style={{ border: '1px solid #000', padding: 8, textAlign: 'right', fontWeight: 700 }}>Thuế VAT ({vatRate}%):</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'right' }}>{formatPrice(vatAmount)}</td>
                </tr>
                <tr>
                  <td colSpan={4} style={{ border: '1px solid #000', padding: 8, textAlign: 'right', fontWeight: 700 }}>Thành tiền:</td>
                  <td style={{ border: '1px solid #000', padding: 8, textAlign: 'right', fontWeight: 700 }}>{formatPrice(totalAmount)}</td>
                </tr>
              </tbody>
            </table>

            <div style={{ marginTop: 10, fontSize: 12 }}>
              <b>Bằng chữ:</b> <i>{invoice?.amountInWords || '....................................................................................'}</i>
            </div>

            <div style={{ marginTop: 40, textAlign: 'center' }}>
              <Text italic>Xin trân trọng cảm ơn</Text>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceForm;
