import React, { useState, useEffect, useRef } from 'react';
import { Typography, Form, Input, Button, message, Card, Divider, Table, Space, Tag, Row, Col } from 'antd';
import { SaveOutlined, SendOutlined, PrinterOutlined, FilePdfOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';

const { Title } = Typography;
const { TextArea } = Input;

const formatPrice = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n || 0);

const ContractForm = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [order, setOrder] = useState(null);
  const [contract, setContract] = useState(null);
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
      const orderData = res.data;
      
      // Map chiTietDonHangs to items
      orderData.items = orderData.chiTietDonHangs?.map(ct => ({
        id: ct.maThietBi,
        productName: ct.thietBi?.tenThietBi || 'Thiết bị',
        unit: ct.thietBi?.donViTinh?.tenDVT || 'Cái',
        quantity: ct.soLuong,
        unitPrice: ct.donGia,
        totalPrice: ct.soLuong * ct.donGia
      })) || [];
      
      setOrder(orderData);
      if (res.data.contract) {
        setContract(res.data.contract);
        form.setFieldsValue(res.data.contract);
      } else {
        form.setFieldsValue({
          partyAName: res.data.customer?.fullName || '',
          partyAPhone: res.data.customer?.phone || '',
          partyBName: 'Công ty TNHH MTV Thông tin Điện tử Hàng hải Việt Nam',
          subject: 'Cung cấp thiết bị',
          discountPercent: 0,
        });
      }
    } catch (err) {
      message.error('Lỗi tải dữ liệu đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values) => {
    try {
      setSubmitting(true);
      if (contract) {
        await apiClient.put(`/api/Contracts/${contract.maHopDong}`, { ...values, orderId: parseInt(orderId) });
        message.success('Đã cập nhật hợp đồng!');
      } else {
        const res = await apiClient.post('/api/Contracts', { ...values, orderId: parseInt(orderId) });
        setContract(res.data);
        message.success('Đã tạo hợp đồng thành công!');
      }
      loadData();
    } catch (err) {
      message.error(err.response?.data?.message || 'Lỗi lưu hợp đồng');
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportPDF = async () => {
    const html2pdf = (await import('html2pdf.js')).default;
    const element = printRef.current;
    html2pdf().set({
      margin: 10, filename: `HopDong_${contract?.contractNumber || 'draft'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).from(element).save();
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Đang tải...</div>;
  if (!order) return <div style={{ padding: 40, textAlign: 'center' }}>Không tìm thấy đơn hàng</div>;

  const contractData = form.getFieldsValue(true);
  const totalAfterDiscount = (order.tongGiaTri || 0) * (1 - (contractData.discountPercent || 0) / 100);

  return (
    <div style={{ padding: '24px', background: '#fff', borderRadius: 8, minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>📄 {contract ? 'Chỉnh sửa' : 'Lập'} Hợp đồng — Đơn hàng {order.orderCode}</Title>
        {contract && <Space>
          <Tag color={contract.status === 'Signed' ? 'success' : contract.status === 'Approved' ? 'processing' : contract.status === 'PendingApproval' ? 'warning' : 'default'}>{contract.status}</Tag>
          <Button icon={<PrinterOutlined />} onClick={() => setShowPreview(!showPreview)}>{showPreview ? 'Ẩn xem trước' : 'Xem trước & In'}</Button>
        </Space>}
      </div>

      {!showPreview ? (
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Row gutter={24}>
            <Col span={12}>
              <Card title="BÊN A — Khách hàng" size="small" style={{ marginBottom: 16 }}>
                <Form.Item name="partyAName" label="Tên công ty / cá nhân" rules={[{ required: true }]}><Input /></Form.Item>
                <Row gutter={12}>
                  <Col span={12}><Form.Item name="partyAAddress" label="Địa chỉ"><Input /></Form.Item></Col>
                  <Col span={12}><Form.Item name="partyAPhone" label="Điện thoại"><Input /></Form.Item></Col>
                </Row>
                <Row gutter={12}>
                  <Col span={12}><Form.Item name="partyAFax" label="Fax"><Input /></Form.Item></Col>
                  <Col span={12}><Form.Item name="partyATaxCode" label="Mã số thuế"><Input /></Form.Item></Col>
                </Row>
                <Row gutter={12}>
                  <Col span={12}><Form.Item name="partyABankAccount" label="Số TK"><Input /></Form.Item></Col>
                  <Col span={12}><Form.Item name="partyABank" label="Ngân hàng"><Input /></Form.Item></Col>
                </Row>
                <Row gutter={12}>
                  <Col span={12}><Form.Item name="partyARepresentative" label="Người đại diện"><Input /></Form.Item></Col>
                  <Col span={12}><Form.Item name="partyAPosition" label="Chức vụ"><Input /></Form.Item></Col>
                </Row>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="BÊN B — VISHIPEL" size="small" style={{ marginBottom: 16 }}>
                <Form.Item name="partyBName" label="Tên công ty"><Input /></Form.Item>
                <Row gutter={12}>
                  <Col span={12}><Form.Item name="partyBAddress" label="Địa chỉ"><Input /></Form.Item></Col>
                  <Col span={12}><Form.Item name="partyBPhone" label="Điện thoại"><Input /></Form.Item></Col>
                </Row>
                <Row gutter={12}>
                  <Col span={12}><Form.Item name="partyBFax" label="Fax"><Input /></Form.Item></Col>
                  <Col span={12}><Form.Item name="partyBTaxCode" label="Mã số thuế"><Input /></Form.Item></Col>
                </Row>
                <Row gutter={12}>
                  <Col span={12}><Form.Item name="partyBBankAccount" label="Số TK"><Input /></Form.Item></Col>
                  <Col span={12}><Form.Item name="partyBBank" label="Ngân hàng"><Input /></Form.Item></Col>
                </Row>
                <Row gutter={12}>
                  <Col span={12}><Form.Item name="partyBRepresentative" label="Người đại diện"><Input /></Form.Item></Col>
                  <Col span={12}><Form.Item name="partyBPosition" label="Chức vụ"><Input /></Form.Item></Col>
                </Row>
              </Card>
            </Col>
          </Row>

          <Card title="Nội dung hợp đồng" size="small" style={{ marginBottom: 16 }}>
            <Form.Item name="subject" label="Về việc"><Input placeholder="Cung cấp thiết bị..." /></Form.Item>
            <Form.Item name="paymentTerms" label="Điều khoản thanh toán"><TextArea rows={2} /></Form.Item>
            <Form.Item name="deliveryTerms" label="Điều khoản giao hàng"><TextArea rows={2} /></Form.Item>
            <Form.Item name="warrantyTerms" label="Điều khoản bảo hành"><TextArea rows={2} /></Form.Item>
            <Form.Item name="additionalTerms" label="Điều khoản bổ sung"><TextArea rows={2} /></Form.Item>
            <Form.Item name="discountPercent" label="Chiết khấu (%)"><Input type="number" style={{ width: 150 }} addonAfter="%" /></Form.Item>
          </Card>

          <Card title="Danh sách thiết bị" size="small" style={{ marginBottom: 16 }}>
            <Table dataSource={order.items} rowKey="id" pagination={false} size="small" bordered
              columns={[
                { title: 'STT', key: 'stt', width: 50, render: (_, __, i) => i + 1 },
                { title: 'Chủng loại thiết bị', dataIndex: 'productName' },
                { title: 'ĐVT', dataIndex: 'unit', width: 80 },
                { title: 'Số lượng', dataIndex: 'quantity', width: 80, align: 'center' },
                { title: 'Đơn giá (VND)', dataIndex: 'unitPrice', width: 140, render: v => formatPrice(v) },
                { title: 'Thành tiền (VND)', dataIndex: 'totalPrice', width: 140, render: v => <b>{formatPrice(v)}</b> },
              ]}
              summary={() => (
                <Table.Summary.Row><Table.Summary.Cell colSpan={5} align="right"><b>TỔNG CỘNG:</b></Table.Summary.Cell><Table.Summary.Cell><b style={{ color: '#cf1322' }}>{formatPrice(order.tongGiaTri)}</b></Table.Summary.Cell></Table.Summary.Row>
              )}
            />
          </Card>

          {JSON.parse(localStorage.getItem('user') || '{}').role?.toLowerCase() !== 'user' && (
            <Space>
              <Button type="primary" htmlType="submit" size="large" icon={<SaveOutlined />} loading={submitting} disabled={contract?.status === 'Signed'}>{contract ? 'Cập nhật' : 'Tạo Hợp đồng'}</Button>
              <Button onClick={() => navigate('/admin/sales')}>Quay lại Dashboard</Button>
            </Space>
          )}
        </Form>
      ) : (
        /* ── PREVIEW HỢP ĐỒNG ── */
        <div>
          <Space style={{ marginBottom: 16 }}>
            <Button type="primary" icon={<FilePdfOutlined />} onClick={handleExportPDF}>Xuất PDF</Button>
            <Button icon={<PrinterOutlined />} onClick={() => window.print()}>In</Button>
          </Space>
          <div ref={printRef} style={{ padding: '40px', border: '1px solid #d9d9d9', borderRadius: 4, background: '#fff', maxWidth: 800, margin: '0 auto', fontFamily: '"Times New Roman", serif' }}>
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
              <div style={{ fontSize: 11, fontWeight: 700 }}><u>Độc lập — Tự do — Hạnh phúc</u></div>
            </div>
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>HỢP ĐỒNG MUA BÁN</div>
              <div style={{ fontSize: 12 }}>Số: {contract?.contractNumber || '...'}</div>
              <div style={{ fontSize: 11, fontStyle: 'italic' }}>(Vv: {contractData.subject || 'Cung cấp thiết bị'})</div>
            </div>
            <div style={{ fontSize: 11, lineHeight: 1.8, marginBottom: 16 }}>
              <p>- Căn cứ Bộ luật Dân sự nước Cộng hòa xã hội chủ nghĩa Việt Nam số 91/2015/QH13 ngày 24/11/2015;</p>
              <p>- Căn cứ nhu cầu và khả năng đáp ứng của hai bên.</p>
            </div>
            <div style={{ fontSize: 11, lineHeight: 2 }}>
              <p><b>Bên A:</b> {contractData.partyAName}</p>
              <p>Địa chỉ: {contractData.partyAAddress || '...'} &emsp; Điện thoại: {contractData.partyAPhone || '...'}</p>
              <p>Số TK: {contractData.partyABankAccount || '...'} &emsp; Ngân hàng: {contractData.partyABank || '...'}</p>
              <p>Mã số thuế: {contractData.partyATaxCode || '...'}</p>
              <p>Người đại diện: <b>Ông/Bà {contractData.partyARepresentative || '...'}</b> &emsp; Chức vụ: {contractData.partyAPosition || '...'}</p>
              <br />
              <p><b>Bên B:</b> {contractData.partyBName}</p>
              <p>Địa chỉ: {contractData.partyBAddress || '...'} &emsp; Điện thoại: {contractData.partyBPhone || '...'}</p>
              <p>Số TK: {contractData.partyBBankAccount || '...'} &emsp; Ngân hàng: {contractData.partyBBank || '...'}</p>
              <p>Mã số thuế: {contractData.partyBTaxCode || '...'}</p>
              <p>Người đại diện: <b>Ông/Bà {contractData.partyBRepresentative || '...'}</b> &emsp; Chức vụ: {contractData.partyBPosition || '...'}</p>
            </div>
            <Divider />
            <p style={{ fontSize: 11, fontStyle: 'italic', fontWeight: 700 }}>Sau khi trao đổi, hai bên nhất trí thỏa thuận ký kết Hợp đồng với các điều khoản sau:</p>
            <p style={{ fontSize: 11 }}><b>Điều 1:</b> Đối tượng hợp đồng</p>
            <p style={{ fontSize: 11 }}>Bên B cung cấp cho Bên A thiết bị và các dịch vụ đi kèm với chi tiết giá cả như sau:</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, marginTop: 8 }}>
              <thead><tr style={{ background: '#f0f0f0' }}>
                <th style={{ border: '1px solid #000', padding: 4 }}>STT</th>
                <th style={{ border: '1px solid #000', padding: 4 }}>Chủng loại thiết bị</th>
                <th style={{ border: '1px solid #000', padding: 4 }}>ĐVT</th>
                <th style={{ border: '1px solid #000', padding: 4 }}>Số lượng</th>
                <th style={{ border: '1px solid #000', padding: 4 }}>Đơn giá (VND)</th>
                <th style={{ border: '1px solid #000', padding: 4 }}>Thành tiền (VND)</th>
              </tr></thead>
              <tbody>
                {order.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ border: '1px solid #000', padding: 4, textAlign: 'center' }}>{idx + 1}</td>
                    <td style={{ border: '1px solid #000', padding: 4 }}>{item.productName}</td>
                    <td style={{ border: '1px solid #000', padding: 4, textAlign: 'center' }}>{item.unit}</td>
                    <td style={{ border: '1px solid #000', padding: 4, textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ border: '1px solid #000', padding: 4, textAlign: 'right' }}>{formatPrice(item.unitPrice)}</td>
                    <td style={{ border: '1px solid #000', padding: 4, textAlign: 'right' }}>{formatPrice(item.totalPrice)}</td>
                  </tr>
                ))}
                <tr><td colSpan={5} style={{ border: '1px solid #000', padding: 4, textAlign: 'right' }}><b>TỔNG CỘNG:</b></td><td style={{ border: '1px solid #000', padding: 4, textAlign: 'right' }}><b>{formatPrice(totalAfterDiscount)}</b></td></tr>
              </tbody>
            </table>
            <div style={{ marginTop: 40, display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
              <div style={{ textAlign: 'center' }}><b>ĐẠI DIỆN BÊN A</b><br /><i>(Ký, ghi rõ họ tên)</i></div>
              <div style={{ textAlign: 'center' }}><b>ĐẠI DIỆN BÊN B</b><br /><i>(Ký, đóng dấu)</i></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractForm;
