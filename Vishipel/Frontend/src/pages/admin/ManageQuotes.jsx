import React, { useState, useEffect } from 'react';
import { Table, Tag, Typography, message, Modal, Descriptions, Button, Input, Form, InputNumber } from 'antd';
import { CheckCircleOutlined, FormOutlined } from '@ant-design/icons';
import apiClient from '../../services/apiClient';
import moment from 'moment';

const { Title, Text } = Typography;
const { TextArea } = Input;

const ManageQuotes = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  
  // State quản lý giá từng sản phẩm trong modal đang mở
  const [itemPrices, setItemPrices] = useState({}); // { productId: price }

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await apiClient.get('/api/QuoteRequests');
      setRequests(res.data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách yêu cầu báo giá");
    } finally {
      setLoading(false);
    }
  };

  const openReplyModal = (record) => {
    setSelectedRequest(record);
    
    // Khởi tạo giá từ dữ liệu cũ nếu có
    const initialPrices = {};
    record.items?.forEach(item => {
      initialPrices[item.id] = item.referencePrice || 0;
    });
    setItemPrices(initialPrices);

    form.setFieldsValue({
      adminReply: record.adminReply || '',
      totalQuotedPrice: record.totalQuotedPrice || 0
    });
    setIsModalVisible(true);
  };

  const calculateSubtotal = (prices) => {
    if (!selectedRequest?.items) return 0;
    return selectedRequest.items.reduce((sum, item) => {
      const price = prices[item.id] || 0;
      return sum + (price * item.quantity);
    }, 0);
  };

  const calculateTotal = (subtotal, tax, discount) => {
    const taxAmount = (subtotal * (tax || 0)) / 100;
    const discountAmount = (subtotal * (discount || 0)) / 100;
    return subtotal + taxAmount - discountAmount;
  };

  // Tính toán lại tổng tiền khi đơn giá thay đổi
  const handlePriceChange = (itemId, value) => {
    const newPrices = { ...itemPrices, [itemId]: value || 0 };
    setItemPrices(newPrices);
    
    const subtotal = calculateSubtotal(newPrices);
    const total = calculateTotal(subtotal, form.getFieldValue('tax'), form.getFieldValue('discount'));
    form.setFieldValue('totalQuotedPrice', total);
  };

  const handleReplySubmit = async (values) => {
    try {
      setSubmitting(true);
      
      // Chuẩn bị payload đầy đủ để thỏa mãn validation của Backend
      const payload = {
        adminReply: values.adminReply,
        totalQuotedPrice: values.totalQuotedPrice,
        items: selectedRequest.items.map(item => ({
          id: item.id, // Dùng ID bản ghi
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          referencePrice: itemPrices[item.id]
        }))
      };

      await apiClient.put(`/api/QuoteRequests/${selectedRequest.id}/reply`, payload);
      message.success('Đã gửi phản hồi báo giá cho khách hàng!');
      setIsModalVisible(false);
      fetchRequests();
    } catch (error) {
      message.error("Có lỗi xảy ra khi gửi phản hồi. Vui lòng kiểm tra lại nội dung.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>{record.user?.fullName}</div>
          <div style={{ color: '#8c8c8c', fontSize: 13 }}>{record.user?.email}</div>
        </div>
      )
    },
    {
      title: 'Số thiết bị',
      key: 'itemCount',
      render: (_, record) => <Tag color="blue">{record.items?.length || 0}</Tag>,
      align: 'center'
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalQuotedPrice',
      key: 'totalQuotedPrice',
      render: (val) => val ? <Text strong style={{ color: '#cf1322' }}>{formatCurrency(val)} đ</Text> : '---',
      align: 'right'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'processing';
        let text = 'Đang chờ';
        if (status === 'Quoted') { color = 'success'; text = 'Đã báo giá'; }
        if (status === 'Accepted') { color = 'gold'; text = 'Đã chấp nhận'; }
        if (status === 'Rejected') { color = 'error'; text = 'Đã từ chối'; }
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => moment(date).format('DD/MM/YYYY HH:mm')
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Button 
          type={record.status === 'Pending' ? 'primary' : 'default'} 
          size="small" 
          onClick={() => openReplyModal(record)} 
          icon={record.status === 'Pending' ? <FormOutlined /> : <CheckCircleOutlined />}
        >
          {record.status === 'Pending' ? 'Báo giá' : 'Xem/Sửa'}
        </Button>
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
      width: 90,
      align: 'center'
    },
    {
      title: 'Đơn giá (đ)',
      key: 'unitPrice',
      width: 150,
      render: (_, record) => (
        <InputNumber
          min={0}
          style={{ width: '100%' }}
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
          value={itemPrices[record.id]}
          onChange={(val) => handlePriceChange(record.id, val)}
          placeholder="Nhập giá"
        />
      )
    },
    {
      title: 'Thành tiền',
      key: 'total',
      width: 130,
      align: 'right',
      render: (_, record) => {
        const price = itemPrices[record.id] || 0;
        return <Text strong>{formatCurrency(price * record.quantity)}</Text>;
      }
    }
  ];

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ background: '#fff', padding: '24px', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <Title level={3} style={{ marginBottom: 24 }}>Quản lý Báo giá Thiết bị</Title>
        <Table 
          columns={columns} 
          dataSource={requests} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      <Modal
        title={`CHI TIẾT BÁO GIÁ #${selectedRequest?.id}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={1000}
        style={{ top: 40 }}
      >
        {selectedRequest && (
          <div style={{ marginTop: 20 }}>
            <Descriptions bordered size="small" column={2} style={{ marginBottom: 20 }}>
              <Descriptions.Item label="Khách hàng">{selectedRequest.user?.fullName}</Descriptions.Item>
              <Descriptions.Item label="Ngày yêu cầu">{moment(selectedRequest.createdAt).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
              <Descriptions.Item label="Thông tin bổ sung" span={2}>
                <div style={{ whiteSpace: 'pre-wrap', color: '#0958d9', fontWeight: 500 }}>
                  {selectedRequest.note || 'Không có ghi chú'}
                </div>
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 16 }}>1. Danh sách thiết bị & Đơn giá</div>
              <Table 
                columns={itemColumns} 
                dataSource={selectedRequest.items} 
                rowKey="id" 
                pagination={false} 
                size="middle"
                bordered
              />
            </div>

            <div style={{ background: '#fafafa', padding: 24, borderRadius: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 16, fontSize: 16 }}>2. Nội dung phản hồi & Tổng kết</div>
              <Form 
                form={form} 
                layout="vertical" 
                onFinish={handleReplySubmit}
                initialValues={{ tax: 0, discount: 0 }}
                onValuesChange={(changedValues, allValues) => {
                  const subtotal = calculateSubtotal(itemPrices);
                  const total = calculateTotal(subtotal, allValues.tax, allValues.discount);
                  form.setFieldValue('totalQuotedPrice', total);
                }}
              >
                <div style={{ display: 'flex', gap: 24 }}>
                  <div style={{ flex: 2 }}>
                    <Form.Item 
                      name="adminReply" 
                      label="Ghi chú / Điều khoản báo giá" 
                      rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                    >
                      <TextArea rows={12} placeholder="Nhập thời gian giao hàng, bảo hành, điều khoản thanh toán..." />
                    </Form.Item>
                  </div>
                  
                  <div style={{ flex: 1, background: '#fff', padding: 20, borderRadius: 8, border: '1px solid #f0f0f0' }}>
                    <div style={{ marginBottom: 16, borderBottom: '1px solid #f0f0f0', paddingBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <Text type="secondary">Tạm tính:</Text>
                        <Text strong style={{ fontSize: 16 }}>{formatCurrency(calculateSubtotal(itemPrices))} đ</Text>
                      </div>

                      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <Form.Item name="tax" label="Thuế (%)" style={{ flex: 1, marginBottom: 12 }}>
                          <InputNumber 
                            min={0}
                            max={100}
                            style={{ width: '100%' }}
                            addonAfter="%"
                          />
                        </Form.Item>
                        <div style={{ flex: 1, paddingTop: 32, textAlign: 'right' }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>+ {formatCurrency((selectedRequest.items.reduce((sum, item) => sum + ((itemPrices[item.productId] || 0) * item.quantity), 0) * (form.getFieldValue('tax') || 0)) / 100)} đ</Text>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <Form.Item name="discount" label="Khuyến mãi (%)" style={{ flex: 1, marginBottom: 12 }}>
                          <InputNumber 
                            min={0}
                            max={100}
                            style={{ width: '100%' }}
                            addonAfter="%"
                          />
                        </Form.Item>
                        <div style={{ flex: 1, paddingTop: 32, textAlign: 'right' }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>- {formatCurrency((selectedRequest.items.reduce((sum, item) => sum + ((itemPrices[item.productId] || 0) * item.quantity), 0) * (form.getFieldValue('discount') || 0)) / 100)} đ</Text>
                        </div>
                      </div>
                    </div>

                    <Form.Item 
                      name="totalQuotedPrice" 
                      label={<Text strong style={{ fontSize: 15 }}>TỔNG CỘNG CUỐI CÙNG (VNĐ)</Text>}
                    >
                      <InputNumber 
                        readOnly
                        style={{ width: '100%', fontSize: 24, color: '#cf1322', fontWeight: 'bold' }} 
                        size="large"
                        variant="borderless"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      />
                    </Form.Item>
                    
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      size="large" 
                      block 
                      loading={submitting} 
                      icon={<CheckCircleOutlined />}
                      style={{ height: 50, borderRadius: 8, marginTop: 10, fontSize: 16, fontWeight: 700 }}
                    >
                      XÁC NHẬN BÁO GIÁ
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageQuotes;
