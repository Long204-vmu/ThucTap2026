import React, { useState, useEffect } from 'react';
import { Table, Tag, Typography, message, Modal, Descriptions, Button, Steps, Card, Space, Row, Col, Tabs, Form, Input, Divider } from 'antd';
import { EyeOutlined, DownloadOutlined, FilePdfOutlined, SolutionOutlined, FileTextOutlined, DollarCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import apiClient from '../services/apiClient';
import moment from 'moment';

const { Title, Text } = Typography;

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmForm] = Form.useForm();

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
    const steps = ['AwaitingConfirmation', 'Created', 'ContractDraft', 'ContractSigned', 'Delivering', 'Delivered', 'InvoiceIssued', 'Completed'];
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
      dataIndex: 'ngayDat',
      key: 'ngayDat',
      render: (date) => moment(date).format('DD/MM/YYYY')
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'tongGiaTri',
      key: 'tongGiaTri',
      render: (amount) => <span style={{ color: '#cf1322', fontWeight: 600 }}>{formatPrice(amount)}</span>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const map = {
          AwaitingConfirmation: ['orange', 'Chờ bạn xác nhận'],
          Created: ['blue', 'Đã xác nhận'],
          ContractDraft: ['blue', 'Đang soạn HĐ'],
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
        <Space>
          {record.status === 'AwaitingConfirmation' && (
            <Button 
              type="primary" 
              size="small" 
              onClick={() => { 
                setSelectedOrder(record); 
                setIsConfirmModalVisible(true);
                confirmForm.setFieldsValue({
                  shippingAddress: record.shippingAddress,
                  receiverName: record.receiverName,
                  receiverPhone: record.receiverPhone
                });
              }}
            >
              Xác nhận & Hoàn thiện
            </Button>
          )}
          <Button type="link" onClick={() => { setSelectedOrder(record); setIsModalVisible(true); }} icon={<EyeOutlined />}>
            Chi tiết
          </Button>
        </Space>
      )
    }
  ];

  const handleConfirmOrder = async (values) => {
    try {
      setConfirming(true);
      const id = selectedOrder.maDonHang || selectedOrder.MaDonHang;
      await apiClient.put(`/api/Orders/${id}/customer-confirm`, values);
      message.success("Xác nhận đơn hàng thành công! Đơn hàng đã được chuyển sang trạng thái xử lý.");
      setIsConfirmModalVisible(false);
      fetchOrders();
    } catch (error) {
      message.error("Lỗi khi xác nhận đơn hàng");
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div style={{ padding: '40px 5%', minHeight: '80vh', background: '#f5f7fa' }}>
      <div style={{ background: '#fff', padding: '32px 24px', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', maxWidth: 1200, margin: '0 auto' }}>
        <Title level={3} style={{ marginBottom: 24 }}>Đơn hàng của tôi</Title>
        <Table 
          columns={columns} 
          dataSource={orders} 
          rowKey="maDonHang" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      {/* Modal Chi tiết đơn hàng */}
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
                { title: 'Chờ XN' },
                { title: 'Đã tạo' },
                { title: 'Soạn HĐ' },
                { title: 'Ký HĐ' },
                { title: 'Giao hàng' },
                { title: 'Nhận hàng' },
                { title: 'Hóa đơn' },
                { title: 'Xong' },
              ]}
              style={{ marginBottom: 32 }}
            />

            <Tabs
              defaultActiveKey="1"
              items={[
                {
                  key: '1',
                  label: <span><InfoCircleOutlined /> Thông tin chung</span>,
                  children: (
                    <Row gutter={24}>
                      <Col span={14}>
                        <Card title="Danh sách thiết bị" size="small" variant="borderless" styles={{ body: { padding: 0 } }}>
                          <Table 
                            dataSource={selectedOrder.chiTietDonHangs} 
                            rowKey="maChiTiet" 
                            pagination={false} 
                            size="small"
                            columns={[
                              { title: 'Tên hàng', dataIndex: 'productName', render: (_, r) => r.thietBi?.tenThietBi || r.productName },
                              { title: 'SL', dataIndex: 'soLuong', width: 60, align: 'center' },
                              { title: 'Thành tiền', key: 'total', render: (_, r) => formatPrice(r.soLuong * r.donGia), align: 'right' },
                            ]}
                          />
                          <div style={{ padding: 16, textAlign: 'right', borderTop: '1px solid #f0f0f0' }}>
                            <div style={{ marginBottom: 4 }}>
                              <Text type="secondary">Phí vận chuyển: </Text>
                              <Text strong>{formatPrice(selectedOrder.shippingCost || 0)}</Text>
                            </div>
                            <div>
                              <Text strong>Tổng thanh toán: </Text>
                              <Text strong style={{ color: '#cf1322', fontSize: 18 }}>{formatPrice(selectedOrder.tongGiaTri)}</Text>
                            </div>
                          </div>
                        </Card>
                        
                        <Card title="Thông tin giao nhận" size="small" style={{ marginTop: 16 }}>
                          <Descriptions column={1} size="small">
                            <Descriptions.Item label="Địa chỉ">{selectedOrder.shippingAddress || 'Chưa cập nhật'}</Descriptions.Item>
                            <Descriptions.Item label="Người nhận">{selectedOrder.receiverName || 'Chưa cập nhật'}</Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại">{selectedOrder.receiverPhone || 'Chưa cập nhật'}</Descriptions.Item>
                            <Descriptions.Item label="Phương thức">{selectedOrder.shippingMethod}</Descriptions.Item>
                          </Descriptions>
                        </Card>
                      </Col>
                      <Col span={10}>
                        <Card title="Tiến độ thanh toán" size="small">
                          {selectedOrder.paymentSchedules?.length > 0 ? (
                            <Table 
                              dataSource={selectedOrder.paymentSchedules} 
                              rowKey="maKeHoach" 
                              pagination={false} 
                              size="small"
                              columns={[
                                { title: 'Đợt', dataIndex: 'phaseName' },
                                { title: '%', dataIndex: 'percentage', render: v => `${v}%` },
                                { title: 'Tình trạng', dataIndex: 'status', render: s => <Tag color={s === 'Paid' ? 'success' : 'warning'}>{s}</Tag> }
                              ]}
                            />
                          ) : <Text type="secondary">Chưa có kế hoạch thanh toán</Text>}
                        </Card>
                        
                        <Card title="Bảo hành & Kỹ thuật" size="small" style={{ marginTop: 16 }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>Điều khoản bảo hành:</Text>
                          <p style={{ fontSize: 13, marginBottom: 8 }}>{selectedOrder.warrantyTerms || 'Theo quy định tiêu chuẩn'}</p>
                          <Text type="secondary" style={{ fontSize: 12 }}>Ghi chú kỹ thuật:</Text>
                          <p style={{ fontSize: 13 }}>{selectedOrder.technicalNotes || 'Không có'}</p>
                        </Card>
                      </Col>
                    </Row>
                  )
                },
                {
                  key: '2',
                  label: <span><SolutionOutlined /> Hồ sơ chứng từ</span>,
                  children: (
                    <div style={{ padding: '0 8px' }}>
                      <Card title="1. Hợp đồng kinh tế" size="small" style={{ marginBottom: 16 }} extra={selectedOrder.contract && <Button size="small" icon={<DownloadOutlined />}>Tải bản ký</Button>}>
                        {selectedOrder.contract ? (
                          <Descriptions column={2} bordered size="small">
                            <Descriptions.Item label="Số hợp đồng">{selectedOrder.contract.maHopDong}</Descriptions.Item>
                            <Descriptions.Item label="Ngày ký">{selectedOrder.contract.ngayKy ? moment(selectedOrder.contract.ngayKy).format('DD/MM/YYYY') : '---'}</Descriptions.Item>
                            <Descriptions.Item label="Giá trị HĐ">{formatPrice(selectedOrder.contract.giaTriHopDong)}</Descriptions.Item>
                            <Descriptions.Item label="Trạng thái"><Tag color="green">{selectedOrder.contract.status}</Tag></Descriptions.Item>
                            <Descriptions.Item label="Nội dung" span={2}>{selectedOrder.contract.noiDungTomTat || 'Cung cấp thiết bị hàng hải'}</Descriptions.Item>
                          </Descriptions>
                        ) : (
                          <div style={{ textAlign: 'center', padding: 20, background: '#fafafa' }}>
                            <Text type="secondary">Đơn hàng đang trong quá trình soạn thảo hợp đồng.</Text>
                          </div>
                        )}
                      </Card>

                      <Card title="2. Hóa đơn điện tử (VAT)" size="small">
                        {selectedOrder.invoice ? (
                          <Descriptions column={2} bordered size="small">
                            <Descriptions.Item label="Mã tra cứu">{selectedOrder.invoice.maHoaDon}</Descriptions.Item>
                            <Descriptions.Item label="Ngày xuất">{moment(selectedOrder.invoice.ngayXuat).format('DD/MM/YYYY')}</Descriptions.Item>
                            <Descriptions.Item label="Thuế suất">{selectedOrder.invoice.thueSuat}%</Descriptions.Item>
                            <Descriptions.Item label="Tổng tiền VAT">{formatPrice(selectedOrder.invoice.totalAmount)}</Descriptions.Item>
                            <Descriptions.Item label="Trạng thái" span={2}><Tag color="blue">{selectedOrder.invoice.status}</Tag></Descriptions.Item>
                          </Descriptions>
                        ) : (
                          <div style={{ textAlign: 'center', padding: 20, background: '#fafafa' }}>
                            <Text type="secondary">Hóa đơn sẽ được xuất sau khi hoàn thành giao hàng.</Text>
                          </div>
                        )}
                      </Card>
                    </div>
                  )
                },
                {
                  key: '3',
                  label: <span><DollarCircleOutlined /> Lịch sử thanh toán</span>,
                  children: (
                    <Card title="Danh sách phiếu thu" size="small">
                      <Table 
                        dataSource={selectedOrder.contract?.phieuThus || []} 
                        rowKey="maPhieuThu" 
                        pagination={false} 
                        size="middle"
                        columns={[
                          { title: 'Số phiếu', dataIndex: 'soPhieu', key: 'soPhieu' },
                          { title: 'Ngày thu', dataIndex: 'ngayThu', render: d => moment(d).format('DD/MM/YYYY') },
                          { title: 'Số tiền', dataIndex: 'soTien', render: v => <Text strong style={{ color: '#52c41a' }}>{formatPrice(v)}</Text>, align: 'right' },
                          { title: 'Hình thức', dataIndex: 'hinhThucThanhToan' },
                        ]}
                        locale={{ emptyText: 'Chưa có dữ liệu thanh toán' }}
                      />
                    </Card>
                  )
                }
              ]}
            />
          </div>
        )}
      </Modal>

      {/* Modal Xác nhận đơn hàng (Cho phép khách hàng sửa thông tin) */}
      <Modal
        title="Xác nhận đơn hàng & Hoàn thiện thông tin"
        open={isConfirmModalVisible}
        onCancel={() => setIsConfirmModalVisible(false)}
        onOk={() => confirmForm.submit()}
        confirmLoading={confirming}
        okText="Xác nhận & Đặt hàng"
        cancelText="Hủy"
        width={600}
      >
        <div style={{ marginBottom: 20 }}>
          <Text>Vui lòng kiểm tra lại thông tin nhận hàng và xác nhận để chúng tôi bắt đầu triển khai đơn hàng.</Text>
        </div>
        <Form
          form={confirmForm}
          layout="vertical"
          onFinish={handleConfirmOrder}
        >
          <Form.Item name="shippingAddress" label="Địa chỉ giao hàng" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
            <Input placeholder="Số nhà, tên đường, cảng, tàu..." />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="receiverName" label="Người nhận hàng" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                <Input placeholder="Tên người nhận" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="receiverPhone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
                <Input placeholder="SĐT liên hệ" />
              </Form.Item>
            </Col>
          </Row>
          <Divider />
          <div style={{ background: '#fafafa', padding: 16, borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>Tổng giá trị đơn hàng:</Text>
              <Text strong style={{ fontSize: 18, color: '#cf1322' }}>{formatPrice(selectedOrder?.tongGiaTri)}</Text>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default MyOrders;
