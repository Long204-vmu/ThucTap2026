import React, { useState, useEffect } from 'react';
import { Typography, Table, Card, Button, Modal, Form, Input, DatePicker, Select, Space, Tag, message, Row, Col, Tabs } from 'antd';
import { ToolOutlined, CheckCircleOutlined, FileDoneOutlined, EditOutlined, UserOutlined, EyeOutlined, UnorderedListOutlined } from '@ant-design/icons';
import apiClient from '../../services/apiClient';
import moment from 'moment';
import AcceptanceDocument from '../../components/common/AcceptanceDocument';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const TechnicalManagement = () => {
  const [orders, setOrders] = useState([]);
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [planModalVisible, setPlanModalVisible] = useState(false);
  const [acceptanceModalVisible, setAcceptanceModalVisible] = useState(false);
  const [viewDocumentVisible, setViewDocumentVisible] = useState(false);
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedAcceptance, setSelectedAcceptance] = useState(null);

  const [planForm] = Form.useForm();
  const [acceptanceForm] = Form.useForm();

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdminOrManager = ['Admin', 'Manager', 'Technical'].includes(currentUser.role);
  // Simulate Customer View if role is User or Admin (for testing)
  const isCustomerView = ['User', 'Admin'].includes(currentUser.role); 

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersRes, recordsRes] = await Promise.all([
        apiClient.get('/api/Technical/orders'),
        apiClient.get('/api/Technical/acceptance')
      ]);
      setOrders(ordersRes.data);
      setRecords(recordsRes.data);
      
      if (isAdminOrManager) {
        const usersRes = await apiClient.get('/api/Technical/users');
        setUsers(usersRes.data);
      }
    } catch (err) {
      message.error('Lỗi tải dữ liệu kỹ thuật');
    } finally {
      setLoading(false);
    }
  };

  const openPlanModal = (order) => {
    setSelectedOrder(order);
    planForm.setFieldsValue({
      assigneeId: order.assigneeId,
      deadline: order.deadline ? moment(order.deadline) : null,
      technicalNotes: order.technicalNotes
    });
    setPlanModalVisible(true);
  };

  const submitPlan = async (values) => {
    try {
      const payload = {
        assigneeId: values.assigneeId,
        deadline: values.deadline ? values.deadline.format('YYYY-MM-DDTHH:mm:ss') : null,
        technicalNotes: values.technicalNotes
      };
      await apiClient.put(`/api/Technical/orders/${selectedOrder.maDonHang}/plan`, payload);
      message.success('Cập nhật kế hoạch lắp đặt thành công');
      setPlanModalVisible(false);
      loadData();
    } catch (err) {
      message.error('Lỗi cập nhật kế hoạch');
    }
  };

  const openAcceptanceModal = (order) => {
    setSelectedOrder(order);
    acceptanceForm.resetFields();
    // Default values
    acceptanceForm.setFieldsValue({
      diaDiem: order.shippingAddress,
      daiDienBenA: order.khachHang?.tenKH,
      danhGiaChung: 'Tốt',
      thoiGianBatDau: moment().subtract(2, 'hours'),
      thoiGianKetThuc: moment()
    });
    setAcceptanceModalVisible(true);
  };

  const submitAcceptance = async (values) => {
    try {
      const payload = {
        orderId: selectedOrder.maDonHang,
        ...values,
        thoiGianBatDau: values.thoiGianBatDau ? values.thoiGianBatDau.format('YYYY-MM-DDTHH:mm:ss') : null,
        thoiGianKetThuc: values.thoiGianKetThuc ? values.thoiGianKetThuc.format('YYYY-MM-DDTHH:mm:ss') : null,
      };
      await apiClient.post('/api/Technical/acceptance', payload);
      message.success('Đã lập biên bản nghiệm thu. Vui lòng yêu cầu khách hàng xác nhận.');
      setAcceptanceModalVisible(false);
      loadData();
    } catch (err) {
      message.error('Lỗi lập biên bản nghiệm thu');
    }
  };

  const openViewDocument = (order, acceptanceRecord) => {
    setSelectedOrder(order);
    setSelectedAcceptance(acceptanceRecord);
    setViewDocumentVisible(true);
  };

  const confirmAcceptance = async () => {
    try {
      await apiClient.put(`/api/Technical/acceptance/${selectedAcceptance.maBienBan}/confirm`);
      message.success('Đã xác nhận nghiệm thu thành công!');
      setViewDocumentVisible(false);
      loadData();
    } catch (err) {
      message.error('Lỗi xác nhận nghiệm thu');
    }
  };

  const orderColumns = [
    { title: 'Mã ĐH', dataIndex: 'orderCode', render: (v, r) => <b>{v || `ĐH-${r.maDonHang}`}</b> },
    { title: 'Khách hàng', dataIndex: 'khachHang', render: k => k?.tenKH || '—' },
    { title: 'Trạng thái', dataIndex: 'status', render: s => {
      const map = {
        Confirmed: ['warning', 'Chốt đơn'],
        ContractSigned: ['processing', 'Đã ký HĐ'],
        Processing: ['processing', 'Đang xử lý (Lắp đặt)'],
        Delivering: ['processing', 'Đang giao hàng'],
        Delivered_Accepted: ['success', 'Đã nghiệm thu']
      };
      const [c, t] = map[s] || ['default', s];
      return <Tag color={c}>{t}</Tag>;
    }},
    { title: 'Hạn chót', dataIndex: 'deadline', render: d => d ? moment(d).format('DD/MM/YYYY') : '—' },
    { title: 'Biên bản NT', dataIndex: 'bienBanNghiemThus', render: b => {
      if (!b || b.length === 0) return <Tag>Chưa lập</Tag>;
      const last = b[0];
      return last.customerConfirmed ? <Tag color="success">Đã xác nhận</Tag> : <Tag color="warning">Chờ xác nhận</Tag>;
    }},
    { title: 'Thao tác', key: 'action', render: (_, r) => {
      const hasRecord = r.bienBanNghiemThus && r.bienBanNghiemThus.length > 0;
      const isAccepted = r.status === 'Delivered_Accepted';

      return (
        <Space>
          {!isAccepted && isAdminOrManager && (
            <Button size="small" icon={<EditOutlined />} onClick={() => openPlanModal(r)}>Kế hoạch</Button>
          )}
          
          {!hasRecord && isAdminOrManager && (
            <Button size="small" type="primary" ghost icon={<FileDoneOutlined />} onClick={() => openAcceptanceModal(r)}>Lập BBNT</Button>
          )}
          
          {hasRecord && (
             <Button 
                size="small" 
                type={r.bienBanNghiemThus[0].customerConfirmed ? "default" : "primary"} 
                style={!r.bienBanNghiemThus[0].customerConfirmed ? { background: '#faad14', borderColor: '#faad14' } : {}} 
                icon={<EyeOutlined />} 
                onClick={() => openViewDocument(r, r.bienBanNghiemThus[0])}
             >
                Xem Biên Bản
             </Button>
          )}
        </Space>
      );
    }}
  ];

  const recordColumns = [
    { title: 'Mã BBNT', dataIndex: 'maBienBan', render: v => <b>BBNT-{v}</b> },
    { title: 'Đơn hàng', dataIndex: ['donDatHang', 'orderCode'], render: (v, r) => <b>{v || `ĐH-${r.maDonHang}`}</b> },
    { title: 'Khách hàng', dataIndex: ['donDatHang', 'khachHang', 'tenKH'], render: v => v || '—' },
    { title: 'Ngày lập', dataIndex: 'ngayLap', render: v => moment(v).format('DD/MM/YYYY HH:mm') },
    { title: 'Người lập', dataIndex: ['nguoiLap', 'hoTen'], render: v => v || '—' },
    { title: 'Đánh giá', dataIndex: 'danhGiaChung', render: v => v || '—' },
    { title: 'Xác nhận', dataIndex: 'customerConfirmed', render: (v, r) => v ? 
      <Tag color="success">Đã xác nhận ({moment(r.ngayXacNhan).format('DD/MM')})</Tag> : 
      <Tag color="warning">Chờ xác nhận</Tag> 
    },
    { title: 'Thao tác', key: 'action', render: (_, r) => (
      <Button 
        size="small" 
        icon={<EyeOutlined />} 
        onClick={() => openViewDocument(r.donDatHang, r)}
      >
        Xem Chi Tiết
      </Button>
    )}
  ];

  return (
    <div style={{ padding: '24px', minHeight: '80vh' }}>
      <Card style={{ borderRadius: 12 }}>
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: '1',
              label: <span><ToolOutlined /> Đơn Hàng Cần Lắp Đặt</span>,
              children: (
                <Table 
                  columns={orderColumns} 
                  dataSource={orders} 
                  rowKey="maDonHang" 
                  loading={loading}
                  pagination={{ pageSize: 10 }}
                />
              )
            },
            {
              key: '2',
              label: <span><UnorderedListOutlined /> Danh Sách Biên Bản</span>,
              children: (
                <Table 
                  columns={recordColumns} 
                  dataSource={records} 
                  rowKey="maBienBan" 
                  loading={loading}
                  pagination={{ pageSize: 10 }}
                />
              )
            }
          ]}
        />
      </Card>

      {/* Modal Lập Kế Hoạch */}
      <Modal title="5.2.1 Lập Kế hoạch Lắp đặt" open={planModalVisible} onOk={() => planForm.submit()} onCancel={() => setPlanModalVisible(false)} destroyOnHidden>
        <Form form={planForm} layout="vertical" onFinish={submitPlan}>
          <Form.Item name="assigneeId" label="Kỹ thuật viên phụ trách" rules={[{ required: true, message: 'Chọn kỹ thuật viên' }]}>
            <Select placeholder="Chọn người phụ trách">
              {users.map(u => <Option key={u.maTaiKhoan} value={u.maTaiKhoan}>{u.hoTen}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="deadline" label="Hạn chót hoàn thành" rules={[{ required: true, message: 'Chọn hạn chót' }]}>
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY HH:mm" showTime />
          </Form.Item>
          <Form.Item name="technicalNotes" label="Ghi chú kỹ thuật (Cấu hình, thông số,...)">
            <TextArea rows={4} placeholder="Nhập các yêu cầu kỹ thuật cần chú ý khi lắp đặt" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Lập Biên Bản Nghiệm Thu (Chi tiết) */}
      <Modal title="5.2.2 Lập Biên bản Nghiệm thu Bàn giao" open={acceptanceModalVisible} onOk={() => acceptanceForm.submit()} onCancel={() => setAcceptanceModalVisible(false)} width={700} destroyOnHidden>
        <Form form={acceptanceForm} layout="vertical" onFinish={submitAcceptance}>
          
          <Form.Item name="diaDiem" label="Địa điểm nghiệm thu">
            <Input placeholder="Tại tàu / Công ty..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="daiDienBenA" label="Đại diện bên Mua (Bên A)">
                <Input placeholder="Tên đại diện" />
              </Form.Item>
              <Form.Item name="chucVuBenA" label="Chức vụ bên A">
                <Input placeholder="Chức vụ" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="daiDienBenB" label="Đại diện bên Cung cấp (Bên B)">
                <Input placeholder="Tên đại diện Vishipel" />
              </Form.Item>
              <Form.Item name="chucVuBenB" label="Chức vụ bên B">
                <Input placeholder="Kỹ thuật viên / Trưởng trạm" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="thoiGianBatDau" label="Thời gian bắt đầu">
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY HH:mm" showTime />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="thoiGianKetThuc" label="Thời gian kết thúc">
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY HH:mm" showTime />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="noiDungDichVu" label="Nội dung dịch vụ lắp đặt">
            <TextArea rows={2} placeholder="Mô tả công việc lắp đặt, cấu hình,..." />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
               <Form.Item name="danhGiaChung" label="Tình trạng hoạt động (Đánh giá)">
                <Select>
                  <Option value="Tốt">Tốt</Option>
                  <Option value="Bình thường">Bình thường</Option>
                  <Option value="Có sự cố">Có sự cố</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
               <Form.Item name="ghiChuKiemTra" label="Ghi chú khác">
                <Input placeholder="Ghi chú kiểm tra thêm..." />
              </Form.Item>
            </Col>
          </Row>
          
        </Form>
      </Modal>

      {/* Modal Xem tài liệu in ấn và Xác nhận */}
      <Modal 
        title="Biên Bản Nghiệm Thu Bàn Giao" 
        open={viewDocumentVisible} 
        onCancel={() => setViewDocumentVisible(false)} 
        width={950} 
        footer={null}
        destroyOnHidden
      >
        <AcceptanceDocument 
          order={selectedOrder} 
          acceptanceRecord={selectedAcceptance} 
          isCustomerView={isCustomerView}
          onConfirm={confirmAcceptance}
        />
      </Modal>

    </div>
  );
};

export default TechnicalManagement;
