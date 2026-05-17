import React, { useState, useEffect } from 'react';
import { Table, Tag, Typography, message, Modal, Descriptions, Button, Steps, Card, Space, Row, Col, Tabs, Form, Input, Divider } from 'antd';
import { EyeOutlined, DownloadOutlined, FilePdfOutlined, SolutionOutlined, FileTextOutlined, DollarCircleOutlined, InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import apiClient from '../services/apiClient';
import moment from 'moment';
import InvoiceDocument from '../components/common/InvoiceDocument';
import WarrantyDocument from '../components/common/WarrantyDocument';
import AcceptanceDocument from '../components/common/AcceptanceDocument';

const { Title, Text } = Typography;

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmForm] = Form.useForm();
  
  const [docModalVisible, setDocModalVisible] = useState(false);
  const [docType, setDocType] = useState(''); // 'invoice' | 'warranty' | 'acceptance'

  const formatPrice = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n || 0);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/api/Orders/my-orders');
      setOrders(res.data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (status) => {
    const steps = ['AwaitingConfirmation', 'Created', 'ContractDraft', 'ContractSigned', 'Delivering', 'Delivered_Accepted', 'InvoiceIssued', 'Completed'];
    const current = steps.indexOf(status);
    return current >= 0 ? current : 0;
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderCode',
      key: 'orderCode',
      render: (code, r) => <b>{code || `ĐH-${r.maDonHang}`}</b>
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
          Created: ['blue', 'Đã chốt đơn'],
          ContractDraft: ['blue', 'Đang soạn HĐ'],
          ContractSigned: ['green', 'Đã ký HĐ'],
          Processing: ['cyan', 'Đang lắp đặt'],
          Delivering: ['cyan', 'Đang giao hàng'],
          Delivered: ['geekblue', 'Chờ nghiệm thu'],
          Delivered_Accepted: ['volcano', 'Chờ thanh toán'],
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
          {record.contract?.status === 'Approved' && (
            <Button 
              type="primary" 
              style={{ background: '#52c41a', borderColor: '#52c41a' }}
              size="small" 
              onClick={() => handleSignContract(record.contract.maHopDong)}
            >
              Ký hợp đồng
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
      message.success("Xác nhận đơn hàng thành công!");
      setIsConfirmModalVisible(false);
      fetchOrders();
    } catch (error) {
      message.error("Lỗi khi xác nhận đơn hàng");
    } finally {
      setConfirming(false);
    }
  };

  const handleSignContract = async (contractId) => {
    try {
      await apiClient.put(`/api/Contracts/${contractId}/sign`);
      message.success("Ký hợp đồng thành công!");
      fetchOrders();
      setIsModalVisible(false);
    } catch (error) {
      message.error("Lỗi khi ký hợp đồng");
    }
  };

  const handleConfirmAcceptance = async () => {
    try {
      const bienBanId = selectedOrder.bienBanNghiemThus[0].maBienBan;
      await apiClient.put(`/api/Orders/acceptance/${bienBanId}/confirm`);
      message.success("Đã xác nhận nghiệm thu điện tử thành công! Hệ thống đã tạo Phiếu thu.");
      setDocModalVisible(false);
      fetchOrders();
      setIsModalVisible(false);
    } catch (err) {
      message.error("Lỗi xác nhận nghiệm thu");
    }
  };

  const handlePayReceipt = async (orderId) => {
    try {
      await apiClient.put(`/api/Orders/${orderId}/pay`);
      message.success("Thanh toán thành công! Hệ thống đã xuất hóa đơn và phiếu bảo hành.");
      fetchOrders();
      setIsModalVisible(false);
    } catch (err) {
      message.error("Lỗi thanh toán");
    }
  };

  const openDocument = (type) => {
    setDocType(type);
    setDocModalVisible(true);
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
        title={<span>Chi tiết đơn hàng {selectedOrder?.orderCode || `ĐH-${selectedOrder?.maDonHang}`}</span>}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>Đóng</Button>
        ]}
        width={900}
        destroyOnHidden
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
                { title: 'Thi công' },
                { title: 'Nghiệm thu' },
                { title: 'Hóa đơn' },
                { title: 'Hoàn thành' },
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
                      </Col>
                      <Col span={10}>
                        <Card title="Thông tin giao nhận" size="small">
                          <Descriptions column={1} size="small">
                            <Descriptions.Item label="Địa chỉ">{selectedOrder.shippingAddress || 'Chưa cập nhật'}</Descriptions.Item>
                            <Descriptions.Item label="Người nhận">{selectedOrder.receiverName || 'Chưa cập nhật'}</Descriptions.Item>
                            <Descriptions.Item label="SĐT">{selectedOrder.receiverPhone || 'Chưa cập nhật'}</Descriptions.Item>
                          </Descriptions>
                        </Card>
                        
                        <Card title="Bảo hành & Kỹ thuật" size="small" style={{ marginTop: 16 }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>Điều khoản bảo hành:</Text>
                          <p style={{ fontSize: 13, marginBottom: 8 }}>{selectedOrder.warrantyTerms || '12 Tháng tiêu chuẩn'}</p>
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
                      <Card 
                        title="1. Hợp đồng kinh tế" 
                        size="small" 
                        style={{ marginBottom: 16 }} 
                      >
                        {selectedOrder.contract ? (
                          <Descriptions column={2} bordered size="small">
                            <Descriptions.Item label="Số hợp đồng">{selectedOrder.contract.maHopDong}</Descriptions.Item>
                            <Descriptions.Item label="Ngày ký">{selectedOrder.contract.ngayKy ? moment(selectedOrder.contract.ngayKy).format('DD/MM/YYYY') : '---'}</Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                              <Tag color={selectedOrder.contract.status === 'Approved' ? 'processing' : 'success'}>
                                {selectedOrder.contract.status === 'Approved' ? 'Chờ bạn ký' : selectedOrder.contract.status}
                              </Tag>
                            </Descriptions.Item>
                          </Descriptions>
                        ) : (
                          <Text type="secondary">Đang trong quá trình soạn thảo.</Text>
                        )}
                      </Card>

                      <Card 
                        title="2. Biên bản nghiệm thu bàn giao" 
                        size="small" 
                        style={{ marginBottom: 16 }}
                        extra={
                          selectedOrder.bienBanNghiemThus && selectedOrder.bienBanNghiemThus.length > 0 ? (
                            <Button 
                              type="primary" 
                              size="small" 
                              onClick={() => openDocument('acceptance')}
                              style={selectedOrder.bienBanNghiemThus[0].customerConfirmed ? {} : { background: '#52c41a' }}
                            >
                              {selectedOrder.bienBanNghiemThus[0].customerConfirmed ? 'Xem Biên bản' : 'Xem & Xác nhận'}
                            </Button>
                          ) : null
                        }
                      >
                         {selectedOrder.bienBanNghiemThus && selectedOrder.bienBanNghiemThus.length > 0 ? (
                           <Descriptions column={2} bordered size="small">
                             <Descriptions.Item label="Ngày lập">{moment(selectedOrder.bienBanNghiemThus[0].ngayLap).format('DD/MM/YYYY')}</Descriptions.Item>
                             <Descriptions.Item label="Trạng thái">
                               {selectedOrder.bienBanNghiemThus[0].customerConfirmed ? <Tag color="success">Đã xác nhận điện tử</Tag> : <Tag color="warning">Chờ bạn xác nhận</Tag>}
                             </Descriptions.Item>
                           </Descriptions>
                         ) : <Text type="secondary">Bộ phận kỹ thuật chưa lập biên bản nghiệm thu.</Text>}
                      </Card>

                      <Card 
                        title="3. Hóa đơn & Phiếu bảo hành" 
                        size="small"
                        extra={
                          selectedOrder.status === 'Completed' || selectedOrder.status === 'InvoiceIssued' ? (
                            <Space>
                              <Button type="primary" size="small" onClick={() => openDocument('invoice')}>Xem Hóa đơn</Button>
                              <Button type="default" size="small" onClick={() => openDocument('warranty')}>Phiếu bảo hành</Button>
                            </Space>
                          ) : null
                        }
                      >
                        {selectedOrder.invoice ? (
                          <Descriptions column={2} bordered size="small">
                            <Descriptions.Item label="Mã hóa đơn">{selectedOrder.invoice.maHoaDon}</Descriptions.Item>
                            <Descriptions.Item label="Ngày xuất">{moment(selectedOrder.invoice.ngayXuat).format('DD/MM/YYYY')}</Descriptions.Item>
                          </Descriptions>
                        ) : (
                          <div style={{ textAlign: 'center', padding: 10 }}>
                            <Text type="secondary">Hóa đơn & Bảo hành sẽ được cấp sau khi bạn hoàn tất thanh toán.</Text>
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
                    <Card title="Yêu cầu thanh toán & Phiếu thu" size="small">
                      {!selectedOrder.phieuThus?.some(p => p.isPaid) && selectedOrder.phieuThus?.length > 0 && (
                        <div style={{ marginBottom: 16, padding: 12, background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 6 }}>
                          <Text strong style={{ color: '#d48806' }}>Hướng dẫn thanh toán chuyển khoản:</Text>
                          <Descriptions column={1} size="small" style={{ marginTop: 8 }}>
                            <Descriptions.Item label="Ngân hàng">Vietcombank - CN Hải Phòng</Descriptions.Item>
                            <Descriptions.Item label="Số tài khoản"><b>0031000123456</b></Descriptions.Item>
                            <Descriptions.Item label="Chủ tài khoản">CÔNG TY TNHH MTV THÔNG TIN ĐIỆN TỬ HÀNG HẢI VIỆT NAM</Descriptions.Item>
                            <Descriptions.Item label="Nội dung">Thanh toan don hang {selectedOrder.orderCode || `DH-${selectedOrder.maDonHang}`}</Descriptions.Item>
                          </Descriptions>
                        </div>
                      )}
                      <Table 
                        dataSource={selectedOrder.phieuThus || []} 
                        rowKey="maPhieuThu" 
                        pagination={false} 
                        size="middle"
                        columns={[
                          { title: 'Số phiếu', dataIndex: 'soPhieu', key: 'soPhieu' },
                          { title: 'Ngày lập', dataIndex: 'ngayThu', render: d => moment(d).format('DD/MM/YYYY') },
                          { title: 'Số tiền', dataIndex: 'soTien', render: v => <Text strong style={{ color: '#52c41a' }}>{formatPrice(v)}</Text>, align: 'right' },
                          { title: 'Trạng thái', dataIndex: 'isPaid', render: (v, r) => 
                            v ? <Tag color="success">Đã thanh toán</Tag> : 
                            <Tag color="warning">Chờ Kế toán xác nhận</Tag>
                          },
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

      {/* Modal View Documents */}
      <Modal
        title={docType === 'invoice' ? 'HÓA ĐƠN BÁN HÀNG' : docType === 'warranty' ? 'PHIẾU BẢO HÀNH' : 'BIÊN BẢN BÀN GIAO'}
        open={docModalVisible}
        onCancel={() => setDocModalVisible(false)}
        footer={null}
        width={950}
        destroyOnHidden
      >
        {docType === 'invoice' ? (
          <InvoiceDocument order={selectedOrder} />
        ) : docType === 'warranty' ? (
          <WarrantyDocument order={selectedOrder} acceptanceRecord={selectedOrder?.bienBanNghiemThus ? selectedOrder.bienBanNghiemThus[0] : null} />
        ) : (
          <AcceptanceDocument 
            order={selectedOrder} 
            acceptanceRecord={selectedOrder?.bienBanNghiemThus ? selectedOrder.bienBanNghiemThus[0] : null}
            isCustomerView={true}
            onConfirm={handleConfirmAcceptance}
          />
        )}
      </Modal>

    </div>
  );
};

export default MyOrders;
