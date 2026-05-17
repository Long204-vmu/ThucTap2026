import React, { useEffect, useState } from 'react';
import {
  Card, Table, Typography, Button, Form, Select, Input,
  InputNumber, Space, Divider, message, Tag, Descriptions, Row, Col, Modal, Tooltip
} from 'antd';
import {
  PlusOutlined, MinusCircleOutlined, ImportOutlined,
  EyeOutlined, ReloadOutlined, FileAddOutlined
} from '@ant-design/icons';
import { getProducts } from '../../../services/productService';
import {
  getWarehouseImports, createWarehouseImport,
  getWarehouseOptions, getWarehouseSuppliers
} from '../../../services/warehouseService';

const { Title, Text } = Typography;

const WarehouseImport = () => {
  const [importHistory, setImportHistory] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [detailRecord, setDetailRecord] = useState(null);
  const [form] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const [warehouseRes, supplierRes, productRes, importRes] = await Promise.all([
        getWarehouseOptions(),
        getWarehouseSuppliers(),
        getProducts(),
        getWarehouseImports(),
      ]);
      setWarehouses(warehouseRes.data || []);
      setSuppliers(supplierRes.data || []);
      setProducts(productRes.data || []);
      setImportHistory(importRes.data || []);
    } catch {
      message.error('Không thể tải dữ liệu.');
    } finally {
      setLoading(false);
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

  const supplierOptions = suppliers.map(s => ({
    label: `${s.tenNCC}${s.soDienThoai ? ' — ' + s.soDienThoai : ''}`,
    value: s.maNCC,
  }));

  const handleSubmit = async (values) => {
    if (!values.items?.length) {
      message.warning('Vui lòng thêm ít nhất một mặt hàng.');
      return;
    }
    setSubmitting(true);
    try {
      await createWarehouseImport({
        maKho: values.maKho,
        maNCC: values.maNCC,
        ghiChu: values.ghiChu,
        items: values.items.map(i => ({
          maThietBi: i.maThietBi,
          soLuong: i.soLuong,
          donGiaNhap: i.donGiaNhap || 0,
        })),
      });
      message.success('Phiếu nhập kho đã tạo thành công!');
      form.resetFields();
      loadData();
    } catch (err) {
      message.error(err.response?.data?.message || 'Tạo phiếu nhập thất bại.');
    } finally {
      setSubmitting(false);
    }
  };

  const totalValue = (record) =>
    record.items?.reduce((sum, i) => sum + (i.soLuong * i.donGiaNhap), 0) || 0;

  const columns = [
    {
      title: 'Mã phiếu',
      dataIndex: 'maPhieuNhap',
      key: 'maPhieuNhap',
      width: 100,
      render: (val) => <Tag color="blue">PN-{val}</Tag>,
    },
    {
      title: 'Ngày nhập',
      dataIndex: 'ngayNhap',
      key: 'ngayNhap',
      width: 170,
      render: (val) => val ? new Date(val).toLocaleString('vi-VN') : '—',
      sorter: (a, b) => new Date(a.ngayNhap) - new Date(b.ngayNhap),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Kho nhập',
      dataIndex: 'kho',
      key: 'kho',
      width: 160,
      render: (val) => <Text strong>{val || '—'}</Text>,
    },
    {
      title: 'Nhà cung cấp',
      dataIndex: 'nhaCungCap',
      key: 'nhaCungCap',
      render: (val) => val ? <Tag color="purple">{val}</Tag> : <Text type="secondary">—</Text>,
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
        <Text strong style={{ color: '#52c41a' }}>
          {totalValue(record).toLocaleString('vi-VN')} ₫
        </Text>
      ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'ghiChu',
      ellipsis: true,
      render: (val) => val || '—',
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
              <ImportOutlined style={{ marginRight: 8, color: '#52c41a' }} />
              Phiếu Nhập Kho
            </Title>
            <Text type="secondary">Tạo và theo dõi phiếu nhập hàng từ nhà cung cấp</Text>
          </div>
          <Button icon={<ReloadOutlined />} onClick={loadData} loading={loading}>Làm mới</Button>
        </div>

        {/* Form tạo phiếu nhập */}
        <Card
          bordered={false}
          style={{ borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
          title={<span><FileAddOutlined style={{ marginRight: 8 }} />Tạo phiếu nhập mới</span>}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}
            initialValues={{ items: [{ maThietBi: null, soLuong: 1, donGiaNhap: 0 }] }}>
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item name="maKho" label="Kho nhập" rules={[{ required: true, message: 'Vui lòng chọn kho' }]}>
                  <Select options={warehouseOptions} placeholder="Chọn kho nhập" showSearch optionFilterProp="label" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="maNCC" label="Nhà cung cấp">
                  <Select options={supplierOptions} placeholder="Chọn nhà cung cấp" allowClear showSearch optionFilterProp="label" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="ghiChu" label="Ghi chú">
                  <Input placeholder="Ghi chú về đợt nhập hàng này..." />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">Danh sách thiết bị nhập</Divider>

            <Form.List name="items">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <Space key={field.key} align="start" wrap style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                      <Form.Item
                        {...field} name={[field.name, 'maThietBi']}
                        rules={[{ required: true, message: 'Chọn thiết bị' }]}
                        style={{ minWidth: 280, flex: 1, marginBottom: 0 }}
                        label={field.name === 0 ? 'Thiết bị' : ''}
                      >
                        <Select options={productOptions} placeholder="Chọn thiết bị" showSearch optionFilterProp="label" />
                      </Form.Item>

                      <Form.Item
                        {...field} name={[field.name, 'soLuong']}
                        rules={[{ required: true, message: 'Nhập SL' }]}
                        style={{ width: 120, marginBottom: 0 }}
                        label={field.name === 0 ? 'Số lượng' : ''}
                        initialValue={1}
                      >
                        <InputNumber min={1} style={{ width: '100%' }} />
                      </Form.Item>

                      <Form.Item
                        {...field} name={[field.name, 'donGiaNhap']}
                        style={{ width: 180, marginBottom: 0 }}
                        label={field.name === 0 ? 'Đơn giá nhập (₫)' : ''}
                        initialValue={0}
                      >
                        <InputNumber
                          min={0} style={{ width: '100%' }}
                          formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={v => v?.replace(/\D/g, '') || ''}
                          placeholder="Đơn giá nhập"
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
              <Button type="primary" htmlType="submit" loading={submitting} size="large" icon={<ImportOutlined />}>
                Lưu phiếu nhập
              </Button>
            </div>
          </Form>
        </Card>

        {/* Lịch sử */}
        <Card
          bordered={false}
          style={{ borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
          title="Lịch sử phiếu nhập kho"
        >
          <Table
            rowKey="maPhieuNhap"
            columns={columns}
            dataSource={importHistory}
            loading={loading}
            pagination={{ pageSize: 10, showTotal: t => `Tổng ${t} phiếu` }}
            scroll={{ x: 900 }}
          />
        </Card>

        {/* Modal chi tiết */}
        <Modal
          open={!!detailRecord}
          title={`Chi tiết phiếu nhập PN-${detailRecord?.maPhieuNhap}`}
          onCancel={() => setDetailRecord(null)}
          footer={<Button onClick={() => setDetailRecord(null)}>Đóng</Button>}
          width={700}
        >
          {detailRecord && (
            <>
              <Descriptions bordered column={2} size="small" style={{ marginBottom: 16 }}>
                <Descriptions.Item label="Mã phiếu">PN-{detailRecord.maPhieuNhap}</Descriptions.Item>
                <Descriptions.Item label="Ngày nhập">{new Date(detailRecord.ngayNhap).toLocaleString('vi-VN')}</Descriptions.Item>
                <Descriptions.Item label="Kho nhập">{detailRecord.kho || '—'}</Descriptions.Item>
                <Descriptions.Item label="Nhà cung cấp">{detailRecord.nhaCungCap || '—'}</Descriptions.Item>
                <Descriptions.Item label="Ghi chú" span={2}>{detailRecord.ghiChu || '—'}</Descriptions.Item>
              </Descriptions>
              <Table
                rowKey="maThietBi"
                dataSource={detailRecord.items || []}
                pagination={false}
                size="small"
                columns={[
                  { title: 'Thiết bị', dataIndex: 'thietBi', render: (v, r) => <span>{v} <Text type="secondary">(#{r.maThietBi})</Text></span> },
                  { title: 'Số lượng', dataIndex: 'soLuong', align: 'center', width: 90 },
                  { title: 'Đơn giá nhập', dataIndex: 'donGiaNhap', align: 'right', width: 150, render: v => `${(v || 0).toLocaleString('vi-VN')} ₫` },
                  { title: 'Thành tiền', align: 'right', width: 160, render: (_, r) => <Text strong style={{ color: '#52c41a' }}>{((r.soLuong || 0) * (r.donGiaNhap || 0)).toLocaleString('vi-VN')} ₫</Text> },
                ]}
                summary={(rows) => {
                  const total = rows.reduce((s, r) => s + (r.soLuong || 0) * (r.donGiaNhap || 0), 0);
                  return (
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={3}><Text strong>Tổng cộng</Text></Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="right"><Text strong style={{ color: '#52c41a' }}>{total.toLocaleString('vi-VN')} ₫</Text></Table.Summary.Cell>
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

export default WarehouseImport;
