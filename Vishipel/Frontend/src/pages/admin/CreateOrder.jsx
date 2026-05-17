import React, { useState, useEffect } from 'react';
import { Typography, Form, Input, InputNumber, Select, Table, Button, message, Card, Divider, Space, Tag, Tabs, Row, Col, DatePicker, Checkbox } from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined, ShoppingCartOutlined, CarOutlined, DollarOutlined, ToolOutlined } from '@ant-design/icons';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import moment from 'moment';

const { Title, Text } = Typography;
const { TextArea } = Input;

const CreateOrder = () => {
  const { quoteId } = useParams();
  const location = useLocation();
  const viewOrderId = new URLSearchParams(location.search).get('view');
  const isViewMode = !!viewOrderId;

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [quote, setQuote] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [users, setUsers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [paymentPhases, setPaymentPhases] = useState([
    { phaseName: 'Tạm ứng', phaseOrder: 1, percentage: 30, dueDate: null, note: '' },
    { phaseName: 'Giao hàng', phaseOrder: 2, percentage: 50, dueDate: null, note: '' },
    { phaseName: 'Nghiệm thu', phaseOrder: 3, percentage: 20, dueDate: null, note: '' },
  ]);

  useEffect(() => { 
    if (isViewMode) {
      loadOrderDetails();
    } else {
      loadQuote(); 
    }
    loadAuxData();
  }, [quoteId, viewOrderId]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/api/Orders/${viewOrderId}`);
      const o = res.data;
      if (o) {
        setQuote({ user: o.khachHang || o.taiKhoan, id: o.quoteRequestId }); // Mock quote info for UI
        setItems(o.chiTietDonHangs?.map((item, idx) => ({
          key: idx,
          productId: item.maThietBi,
          productName: item.thietBi?.tenThietBi || 'Thiết bị',
          quantity: item.soLuong,
          unitPrice: item.donGia,
          totalPrice: item.soLuong * item.donGia,
        })) || []);
        
        form.setFieldsValue({
          shippingAddress: o.shippingAddress,
          shippingMethod: o.shippingMethod,
          shippingCost: o.shippingCost,
          expectedDeliveryDate: o.expectedDeliveryDate ? moment(o.expectedDeliveryDate) : null,
          receiverName: o.receiverName,
          receiverPhone: o.receiverPhone,
          billingInfo: o.billingInfo,
          paymentMethod: o.paymentMethod,
          isDepositPaid: o.isDepositPaid,
          warehouseId: o.warehouseId,
          assigneeId: o.assigneeId,
          deadline: o.deadline ? moment(o.deadline) : null,
          warrantyTerms: o.warrantyTerms,
          technicalNotes: o.technicalNotes,
        });

        if (o.paymentSchedules && o.paymentSchedules.length > 0) {
          setPaymentPhases(o.paymentSchedules);
        }
      }
    } catch (err) {
      message.error('Lỗi tải dữ liệu đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const loadAuxData = async () => {
    try {
      const [uRes, wRes, cRes] = await Promise.all([
        apiClient.get('/api/TaiKhoan'),
        apiClient.get('/api/Kho'),
        apiClient.get('/api/LoaiKhachHang')
      ]);
      setUsers(uRes.data);
      setWarehouses(wRes.data);
      setCustomers(cRes.data);
    } catch (err) {
      console.error('Error loading aux data', err);
    }
  };

  const loadQuote = async () => {
    try {
      setLoading(true);
      // Gọi trực tiếp API chi tiết báo giá để lấy dữ liệu mới nhất
      const res = await apiClient.get(`/api/QuoteRequests/${quoteId}`);
      const q = res.data;
      if (q) {
        setQuote(q);
        setItems(q.items?.map((item, idx) => ({
          key: idx,
          id: item.id, // Lưu ID của bản ghi item
          productId: item.productId,
          productName: item.productName,
          unit: 'Cái',
          quantity: item.quantity,
          unitPrice: item.referencePrice || 0,
          totalPrice: (item.referencePrice || 0) * item.quantity,
          serialNumbersJson: '',
          installLocation: '',
        })) || []);
        
        // Parse note to pre-fill shipping info
        if (q.note) {
          const vesselMatch = q.note.match(/\[Tàu\/Dự án: (.*?)\]/);
          const portMatch = q.note.match(/\[Cảng giao: (.*?)\]/);
          if (vesselMatch) form.setFieldValue('technicalNotes', `Dành cho tàu: ${vesselMatch[1]}`);
          if (portMatch) form.setFieldValue('shippingAddress', portMatch[1]);
        }
      } else {
        message.error('Không tìm thấy báo giá');
      }
    } catch (err) {
      message.error('Lỗi tải dữ liệu báo giá chi tiết');
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

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      const payload = {
        ...values,
        quoteRequestId: parseInt(quoteId) || 0,
        shippingCost: values.shippingCost || 0,
        items: items.map(i => ({
          productId: i.productId,
          soLuong: i.quantity,
          unitPrice: i.unitPrice
        })),
        paymentSchedules: paymentPhases.map(p => ({
          phaseName: p.phaseName,
          phaseOrder: p.phaseOrder,
          percentage: p.percentage,
          note: p.note || null,
        })),
      };

      if (isViewMode) {
        await apiClient.put(`/api/Orders/${viewOrderId}`, payload);
        message.success('Cập nhật thông tin đơn hàng thành công!');
      } else {
        await apiClient.post('/api/Orders', payload);
        message.success('Tạo đơn hàng thành công!');
        navigate('/admin/sales');
      }
    } catch (err) {
      message.error(err.response?.data?.message || (isViewMode ? 'Lỗi cập nhật đơn hàng' : 'Lỗi tạo đơn hàng'));
    } finally {
      setSubmitting(false);
    }
  };

  const itemColumns = [
    { title: 'Tên thiết bị', dataIndex: 'productName', width: 220 },
    { title: 'SL', dataIndex: 'quantity', width: 80, render: (v, r) => <InputNumber size="small" min={1} value={v} onChange={val => updateItem(r.key, 'quantity', val)} /> },
    { title: 'Đơn giá (VNĐ)', dataIndex: 'unitPrice', width: 160, render: (v, r) => <InputNumber size="small" min={0} value={v} onChange={val => updateItem(r.key, 'unitPrice', val)} formatter={val => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={val => val.replace(/,/g, '')} style={{ width: '100%' }} /> },
    { title: 'Thành tiền', dataIndex: 'totalPrice', width: 140, render: v => <b style={{ color: '#cf1322' }}>{formatPrice(v)}</b> },
  ];

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Đang tải dữ liệu...</div>;
  if (!quote) return <div style={{ padding: 40, textAlign: 'center' }}>Không tìm thấy báo giá</div>;

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            {isViewMode ? `📦 Chi tiết Đơn Hàng #${viewOrderId}` : '📦 Lập Đơn Hàng Mới'}
          </Title>
          <Text type="secondary">Nguồn: Báo giá #{quoteId || 'N/A'} - Khách hàng: <b>{quote?.user?.fullName || 'Không rõ'}</b></Text>
        </div>
        <Space>
          <Button onClick={() => navigate(-1)}>Quay lại</Button>
          {!isViewMode && (
            <Button type="primary" size="large" icon={<SaveOutlined />} onClick={() => form.submit()} loading={submitting} style={{ height: 45, fontWeight: 600 }}>
              XÁC NHẬN TẠO ĐƠN
            </Button>
          )}
          {isViewMode && (
             <Button type="primary" size="large" icon={<SaveOutlined />} onClick={() => form.submit()} loading={submitting} style={{ height: 45, fontWeight: 600 }}>
               CẬP NHẬT THÔNG TIN
             </Button>
          )}
        </Space>
      </div>

      <Form 
        form={form} 
        layout="vertical" 
        onFinish={handleSubmit}
        initialValues={{ 
          paymentMethod: 'Chuyển khoản',
          shippingMethod: 'Giao tận nơi',
          isDepositPaid: false
        }}
      >
        <Tabs
          type="card"
          items={[
            {
              key: '1',
              label: <span><ShoppingCartOutlined /> Thiết bị & Giá</span>,
              children: (
                <Card bordered={false}>
                  <Table columns={itemColumns} dataSource={items} rowKey="key" pagination={false} size="middle" bordered />
                  <div style={{ marginTop: 24, textAlign: 'right', background: '#fff1f0', padding: '16px 24px', borderRadius: 8 }}>
                    <Text style={{ fontSize: 16 }}>Tổng tiền hàng:</Text>
                    <Title level={3} style={{ margin: '4px 0 0', color: '#cf1322' }}>{formatPrice(totalAmount)}</Title>
                  </div>
                </Card>
              )
            },
            {
              key: '2',
              label: <span><CarOutlined /> Logistics & Giao nhận</span>,
              children: (
                <Card bordered={false}>
                  <Row gutter={24}>
                    <Col span={8}>
                      <Form.Item name="customerType" label="Phân loại khách hàng" rules={[{ required: true, message: 'Vui lòng chọn loại khách hàng!' }]}>
                        <Select placeholder="Chọn loại khách hàng">
                          {customers.map(c => (
                            <Select.Option key={c.maLoai} value={c.tenLoai}>
                              {c.tenLoai}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={16}>
                      <Form.Item name="shippingAddress" label="Địa chỉ giao hàng thực tế" rules={[{ required: true }]}>
                        <Input placeholder="VD: Cầu cảng số 3, Cảng Hải Phòng..." />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name="shippingMethod" label="Phương thức vận chuyển">
                        <Select>
                          <Select.Option value="Giao tận nơi">Giao hàng tận nơi (Vishipel)</Select.Option>
                          <Select.Option value="Khách tự lấy">Khách hàng tự lấy tại kho</Select.Option>
                          <Select.Option value="Chành xe">Gửi chành xe / Bên thứ 3</Select.Option>
                          <Select.Option value="ViettelPost">Viettel Post / EMS</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name="shippingCost" label="Chi phí vận chuyển (VNĐ)">
                        <InputNumber style={{ width: '100%' }} min={0} formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name="expectedDeliveryDate" label="Thời gian giao hàng dự kiến">
                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                      </Form.Item>
                    </Col>
                    <Col span={8}></Col>
                    <Col span={8}>
                      <Form.Item name="receiverName" label="Người nhận hàng">
                        <Input placeholder="Tên người nhận tại điểm giao" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name="receiverPhone" label="Số điện thoại nhận hàng">
                        <Input placeholder="Số điện thoại liên hệ" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              )
            },
            {
              key: '3',
              label: <span><DollarOutlined /> Thanh toán & Tài chính</span>,
              children: (
                <Card bordered={false}>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item name="billingInfo" label="Thông tin xuất hóa đơn (VAT)">
                        <TextArea rows={4} placeholder="Tên công ty, Mã số thuế, Địa chỉ hóa đơn..." />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="paymentMethod" label="Hình thức thanh toán chính">
                        <Select>
                          <Select.Option value="Chuyển khoản">Chuyển khoản ngân hàng</Select.Option>
                          <Select.Option value="Tiền mặt">Tiền mặt</Select.Option>
                          <Select.Option value="Hợp đồng">Theo điều khoản hợp đồng</Select.Option>
                        </Select>
                      </Form.Item>
                      <Form.Item name="isDepositPaid" valuePropName="checked">
                        <Checkbox><Text strong style={{ color: '#52c41a' }}>Đã nhận tiền đặt cọc / tạm ứng</Text></Checkbox>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Divider orientation="left">Tiến độ thanh toán chi tiết (Milestones)</Divider>
                  <Table
                    dataSource={paymentPhases}
                    rowKey="phaseOrder"
                    pagination={false}
                    size="small"
                    bordered
                    columns={[
                      { title: 'Đợt', dataIndex: 'phaseName', width: 150 },
                      { title: '% Thanh toán', dataIndex: 'percentage', width: 150, render: (v, _, idx) => <InputNumber min={0} max={100} value={v} onChange={val => { const nw = [...paymentPhases]; nw[idx].percentage = val; setPaymentPhases(nw); }} addonAfter="%" /> },
                      { title: 'Số tiền tương ứng', key: 'amount', render: (_, r) => <Text strong>{formatPrice(totalAmount * r.percentage / 100)}</Text> },
                      { title: 'Ghi chú thời hạn', dataIndex: 'note', render: (v, _, idx) => <Input placeholder="VD: Ngay sau khi ký" value={v} onChange={e => { const nw = [...paymentPhases]; nw[idx].note = e.target.value; setPaymentPhases(nw); }} /> },
                    ]}
                  />
                </Card>
              )
            },
            {
              key: '4',
              label: <span><ToolOutlined /> Vận hành & Kỹ thuật</span>,
              children: (
                <Card bordered={false}>
                  <Row gutter={24}>
                    <Col span={8}>
                      <Form.Item name="warehouseId" label="Kho xuất hàng">
                        <Select placeholder="Chọn kho">
                          {warehouses.map(w => (
                            <Select.Option key={w.maLoai} value={w.maLoai}>
                              {w.tenLoai}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name="assigneeId" label="Nhân viên phụ trách (Sales/Ops)">
                        <Select placeholder="Chọn nhân viên">
                          {users.map(u => (
                            <Select.Option key={u.maTaiKhoan} value={u.maTaiKhoan}>
                              {u.hoTen}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name="deadline" label="Hạn hoàn thành đơn (Deadline)">
                        <DatePicker style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="warrantyTerms" label="Điều khoản bảo hành">
                        <TextArea rows={4} placeholder="VD: Bảo hành 12 tháng tại tàu, không bao gồm lỗi do sét đánh..." />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="technicalNotes" label="Ghi chú kỹ thuật / Lắp đặt">
                        <TextArea rows={4} placeholder="Thông tin cấu hình, vị trí lắp đặt trên cabin, yêu cầu kỹ thuật đặc biệt..." />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              )
            }
          ]}
        />
      </Form>
    </div>
  );
};

export default CreateOrder;
