import React, { useEffect, useState } from 'react';
import {
  Card, Table, Typography, Button, Form, Select, Input,
  InputNumber, Space, Divider, message, Tag, Descriptions, Row, Col, Modal, Tooltip, Alert
} from 'antd';
import {
  PlusOutlined, MinusCircleOutlined, ExportOutlined,
  EyeOutlined, ReloadOutlined, FileAddOutlined, LinkOutlined
} from '@ant-design/icons';
import { getProducts } from '../../../services/productService';
import {
  getWarehouseExports, createWarehouseExport,
  getWarehouseOptions, getContracts
} from '../../../services/warehouseService';
import apiClient from '../../../services/apiClient';

const { Title, Text } = Typography;

const WarehouseExport = () => {
  const [exportHistory, setExportHistory] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [detailRecord, setDetailRecord] = useState(null);
  const [form] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const [warehouseRes, productRes, exportRes] = await Promise.all([
        getWarehouseOptions(),
        getProducts(),
        getWarehouseExports(),
      ]);
      setWarehouses(warehouseRes.data || []);
      setProducts(productRes.data || []);
      setExportHistory(exportRes.data || []);
    } catch {
      message.error('Không thể tải dữ liệu kho.');
    } finally {
      setLoading(false);
    }

    // Lấy hợp đồng riêng — không block nếu API chưa có
    try {
      const contractRes = await getContracts();
      setContracts(contractRes.data || []);
    } catch {
      // Bỏ qua nếu lỗi
    }
  };

  useEffect(() => { loadData(); }, []);

  const productOptions = products.map(p => ({
    label: `[${p.maThietBi}] ${p.tenThietBi}`,
    value: p.maThietBi,
  }));

  const warehouseOptions = warehouses.map(w => ({
    label: w.tenKho || w.tenLoai,
    value: w.maKho || w.maLoai,
  }));

  const contractOptions = contracts.map(c => {
    const customerName = c.donDatHang?.khachHang?.tenKH || c.partyAName || '';
    return {
      label: `${c.maHopDong}${customerName ? ' — ' + customerName : ''}${c.ngayKy ? ' (' + new Date(c.ngayKy).toLocaleDateString('vi-VN') + ')' : ''}`,
      value: c.maHopDong,
    };
  });

  const handleContractChange = (maHopDong) => {
    if (!maHopDong) {
      // Clear fields if deselected
      form.setFieldsValue({
        lyDoXuat: '',
        items: [{ maThietBi: null, soLuong: 1, donGiaBan: 0 }]
      });
      return;
    }

    const selectedContract = contracts.find(c => c.maHopDong === maHopDong);
    if (selectedContract) {
      const customerName = selectedContract.donDatHang?.khachHang?.tenKH || selectedContract.partyAName || '';
      const lyDo = `Xuất kho giao hàng theo hợp đồng ${maHopDong}${customerName ? ' — ' + customerName : ''}`;
      
      const orderItems = selectedContract.donDatHang?.chiTietDonHangs || [];
      if (orderItems.length > 0) {
        const formItems = orderItems.map(item => ({
          maThietBi: item.maThietBi,
          soLuong: item.soLuong,
          donGiaBan: item.donGia || 0
        }));

        form.setFieldsValue({
          lyDoXuat: lyDo,
          items: formItems
        });
        message.success(`Đã tự động điền danh sách thiết bị (${orderItems.length} loại) từ hợp đồng ${maHopDong}!`);
      } else {
        form.setFieldsValue({
          lyDoXuat: lyDo,
          items: [{ maThietBi: null, soLuong: 1, donGiaBan: 0 }]
        });
        message.warning(`Hợp đồng ${maHopDong} không có chi tiết thiết bị nào.`);
      }
    }
  };

  const handleSubmit = async (values) => {
    if (!values.items?.length) {
      message.warning('Vui lòng thêm ít nhất một mặt hàng.');
      return;
    }
    setSubmitting(true);
    try {
      await createWarehouseExport({
        maKho: values.maKho,
        maHopDong: values.maHopDong || null,
        lyDoXuat: values.lyDoXuat,
        items: values.items.map(i => ({
          maThietBi: i.maThietBi,
          soLuong: i.soLuong,
          donGiaBan: i.donGiaBan || 0,
        })),
      });
      message.success('Phiếu xuất kho đã tạo thành công!');
      form.resetFields();
      loadData();
    } catch (err) {
      message.error(err.response?.data?.message || 'Tạo phiếu xuất thất bại.');
    } finally {
      setSubmitting(false);
    }
  };

  const totalValue = (record) =>
    record.items?.reduce((sum, i) => sum + (i.soLuong * i.donGiaBan), 0) || 0;

  const columns = [
    {
      title: 'Mã phiếu',
      dataIndex: 'maPhieuXuat',
      key: 'maPhieuXuat',
      width: 100,
      render: (val) => <Tag color="orange">PX-{val}</Tag>,
    },
    {
      title: 'Ngày xuất',
      dataIndex: 'ngayXuat',
      key: 'ngayXuat',
      width: 170,
      render: (val) => val ? new Date(val).toLocaleString('vi-VN') : '—',
      sorter: (a, b) => new Date(a.ngayXuat) - new Date(b.ngayXuat),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Kho xuất',
      dataIndex: 'kho',
      key: 'kho',
      width: 160,
      render: (val) => <Text strong>{val || '—'}</Text>,
    },
    {
      title: 'Hợp đồng liên kết',
      dataIndex: 'maHopDong',
      key: 'maHopDong',
      render: (val) => val
        ? <Tag color="geekblue" icon={<LinkOutlined />}>{val}</Tag>
        : <Text type="secondary">—</Text>,
    },
    {
      title: 'Lý do xuất',
      dataIndex: 'lyDoXuat',
      ellipsis: true,
      render: (val) => val || '—',
    },
    {
      title: 'Số mặt hàng',
      key: 'soMatHang',
      width: 110,
      align: 'center',
      render: (_, record) => <Tag>{record.items?.length || 0} loại</Tag>,
    },
    {
      title: 'Tổng giá trị',
      key: 'tongGiaTri',
      width: 150,
      align: 'right',
      render: (_, record) => (
        <Text strong style={{ color: '#fa8c16' }}>
          {totalValue(record).toLocaleString('vi-VN')} ₫
        </Text>
      ),
    },
    {
      title: '',
      key: 'action',
      width: 70,
      render: (_, record) => (
        <Tooltip title="Xem chi tiết">
          <Button icon={<EyeOutlined />} type="text" onClick={() => setDetailRecord(record)} />
        </Tooltip>
      ),
    },
  ];

  return (
    <div style={{ padding: '32px 5%', background: '#f5f7fa', minHeight: 'calc(100vh - 76px)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <Title level={3} style={{ margin: 0 }}>
              <ExportOutlined style={{ marginRight: 8, color: '#fa8c16' }} />
              Phiếu Xuất Kho
            </Title>
            <Text type="secondary">Tạo phiếu xuất hàng, liên kết với hợp đồng bán hàng</Text>
          </div>
          <Button icon={<ReloadOutlined />} onClick={loadData} loading={loading}>Làm mới</Button>
        </div>

        <Alert
          type="info"
          showIcon
          title="Lưu ý: Phiếu xuất có thể liên kết với hợp đồng từ phân hệ Bán hàng để theo dõi giao hàng."
          style={{ marginBottom: 20, borderRadius: 8 }}
        />

        {/* Form tạo phiếu xuất */}
        <Card
          variant="borderless"
          style={{ borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
          title={<span><FileAddOutlined style={{ marginRight: 8 }} />Tạo phiếu xuất mới</span>}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}
            initialValues={{ items: [{ maThietBi: null, soLuong: 1, donGiaBan: 0 }] }}>
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item name="maKho" label="Kho xuất" rules={[{ required: true, message: 'Vui lòng chọn kho' }]}>
                  <Select options={warehouseOptions} placeholder="Chọn kho xuất" showSearch optionFilterProp="label" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="maHopDong" label="Hợp đồng liên kết (nếu có)">
                  <Select
                    options={contractOptions}
                    placeholder="Chọn hợp đồng..."
                    allowClear showSearch optionFilterProp="label"
                    notFoundContent="Không có hợp đồng phù hợp"
                    onChange={handleContractChange}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="lyDoXuat" label="Lý do xuất">
                  <Input placeholder="Vd: Giao hàng theo hợp đồng, bàn giao kỹ thuật..." />
                </Form.Item>
              </Col>
            </Row>

            <Divider titlePlacement="left">Danh sách thiết bị xuất</Divider>

            <Form.List name="items">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <Space key={field.key} align="start" wrap style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                      <Form.Item
                        name={[field.name, 'maThietBi']}
                        rules={[{ required: true, message: 'Chọn thiết bị' }]}
                        style={{ minWidth: 280, flex: 1, marginBottom: 0 }}
                        label={field.name === 0 ? 'Thiết bị' : ''}
                      >
                        <Select options={productOptions} placeholder="Chọn thiết bị" showSearch optionFilterProp="label" />
                      </Form.Item>

                      <Form.Item
                        name={[field.name, 'soLuong']}
                        rules={[{ required: true, message: 'Nhập SL' }]}
                        style={{ width: 120, marginBottom: 0 }}
                        label={field.name === 0 ? 'Số lượng' : ''}
                      >
                        <InputNumber min={1} style={{ width: '100%' }} />
                      </Form.Item>

                      <Form.Item
                        name={[field.name, 'donGiaBan']}
                        style={{ width: 180, marginBottom: 0 }}
                        label={field.name === 0 ? 'Đơn giá bán (₫)' : ''}
                      >
                        <InputNumber
                          min={0} style={{ width: '100%' }}
                          formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={v => v?.replace(/\D/g, '') || ''}
                          placeholder="Đơn giá bán"
                        />
                      </Form.Item>

                      <div style={{ paddingTop: field.name === 0 ? 30 : 0 }}>
                        <MinusCircleOutlined
                          onClick={() => remove(field.name)}
                          style={{ color: '#ff4d4f', fontSize: 18, cursor: 'pointer' }}
                        />
                      </div>
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" block icon={<PlusOutlined />} onClick={() => add()}>
                      Thêm mặt hàng
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <div style={{ textAlign: 'right' }}>
              <Button type="primary" danger htmlType="submit" loading={submitting} size="large" icon={<ExportOutlined />}>
                Lưu phiếu xuất
              </Button>
            </div>
          </Form>
        </Card>

        {/* Lịch sử */}
        <Card
          bordered={false}
          style={{ borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
          title="Lịch sử phiếu xuất kho"
        >
          <Table
            rowKey="maPhieuXuat"
            columns={columns}
            dataSource={exportHistory}
            loading={loading}
            pagination={{ pageSize: 10, showTotal: t => `Tổng ${t} phiếu` }}
            scroll={{ x: 950 }}
          />
        </Card>

        {/* Modal chi tiết */}
        <Modal
          open={!!detailRecord}
          title={`Chi tiết phiếu xuất PX-${detailRecord?.maPhieuXuat}`}
          onCancel={() => setDetailRecord(null)}
          footer={<Button onClick={() => setDetailRecord(null)}>Đóng</Button>}
          width={700}
        >
          {detailRecord && (
            <>
              <Descriptions bordered column={2} size="small" style={{ marginBottom: 16 }}>
                <Descriptions.Item label="Mã phiếu">PX-{detailRecord.maPhieuXuat}</Descriptions.Item>
                <Descriptions.Item label="Ngày xuất">{new Date(detailRecord.ngayXuat).toLocaleString('vi-VN')}</Descriptions.Item>
                <Descriptions.Item label="Kho xuất">{detailRecord.kho || '—'}</Descriptions.Item>
                <Descriptions.Item label="Hợp đồng">{detailRecord.maHopDong || '—'}</Descriptions.Item>
                <Descriptions.Item label="Lý do xuất" span={2}>{detailRecord.lyDoXuat || '—'}</Descriptions.Item>
              </Descriptions>
              <Table
                rowKey="maThietBi"
                dataSource={detailRecord.items || []}
                pagination={false}
                size="small"
                columns={[
                  { title: 'Thiết bị', dataIndex: 'thietBi', render: (v, r) => <span>{v} <Text type="secondary">(#{r.maThietBi})</Text></span> },
                  { title: 'Số lượng', dataIndex: 'soLuong', align: 'center', width: 90 },
                  { title: 'Đơn giá bán', dataIndex: 'donGiaBan', align: 'right', width: 150, render: v => `${(v || 0).toLocaleString('vi-VN')} ₫` },
                  { title: 'Thành tiền', align: 'right', width: 160, render: (_, r) => <Text strong style={{ color: '#fa8c16' }}>{((r.soLuong || 0) * (r.donGiaBan || 0)).toLocaleString('vi-VN')} ₫</Text> },
                ]}
                summary={(rows) => {
                  const total = rows.reduce((s, r) => s + (r.soLuong || 0) * (r.donGiaBan || 0), 0);
                  return (
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={3}><Text strong>Tổng cộng</Text></Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="right"><Text strong style={{ color: '#fa8c16' }}>{total.toLocaleString('vi-VN')} ₫</Text></Table.Summary.Cell>
                    </Table.Summary.Row>
                  );
                }}
              />
            </>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default WarehouseExport;
