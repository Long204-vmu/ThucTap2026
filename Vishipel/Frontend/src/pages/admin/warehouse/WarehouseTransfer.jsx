import React, { useEffect, useState } from 'react';
import {
  Card, Table, Typography, Button, Form, Select, Input,
  InputNumber, Space, Divider, message, Tag, Row, Col, Alert
} from 'antd';
import {
  PlusOutlined, MinusCircleOutlined, SwapOutlined,
  ReloadOutlined, ArrowRightOutlined
} from '@ant-design/icons';
import { getProducts } from '../../../services/productService';
import {
  createWarehouseTransfer, getWarehouseOptions, getWarehouseImports
} from '../../../services/warehouseService';

const { Title, Text } = Typography;

const WarehouseTransfer = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [transferHistory, setTransferHistory] = useState([]);
  const [form] = Form.useForm();
  const sourceWh = Form.useWatch('maKhoNguon', form);

  const loadData = async () => {
    setLoading(true);
    try {
      const [warehouseRes, productRes, importRes] = await Promise.all([
        getWarehouseOptions(),
        getProducts(),
        getWarehouseImports(),
      ]);
      setWarehouses(warehouseRes.data || []);
      setProducts(productRes.data || []);

      // Lịch sử điều chuyển: phiếu nhập có ghiChu chứa "Điều chuyển từ kho"
      const transfers = (importRes.data || []).filter(p =>
        p.ghiChu && p.ghiChu.startsWith('Điều chuyển từ kho')
      );
      setTransferHistory(transfers);
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

  const destOptions = warehouseOptions.filter(w => w.value !== sourceWh);

  const handleSubmit = async (values) => {
    if (!values.items?.length) {
      message.warning('Vui lòng thêm ít nhất một mặt hàng.');
      return;
    }
    if (values.maKhoNguon === values.maKhoDich) {
      message.warning('Kho nguồn và kho đích phải khác nhau.');
      return;
    }
    setSubmitting(true);
    try {
      await createWarehouseTransfer({
        maKhoNguon: values.maKhoNguon,
        maKhoDich: values.maKhoDich,
        lyDo: values.lyDo,
        items: values.items.map(i => ({
          maThietBi: i.maThietBi,
          soLuong: i.soLuong,
          donGiaNhap: i.donGiaNhap || 0,
        })),
      });
      message.success('Điều chuyển kho đã thực hiện thành công!');
      form.resetFields();
      loadData();
    } catch (err) {
      message.error(err.response?.data?.message || 'Điều chuyển kho thất bại.');
    } finally {
      setSubmitting(false);
    }
  };

  const sourceLabel = warehouseOptions.find(w => w.value === sourceWh)?.label;

  const columns = [
    {
      title: 'Mã phiếu nhập',
      dataIndex: 'maPhieuNhap',
      key: 'id',
      width: 110,
      render: v => <Tag color="cyan">PN-{v}</Tag>,
    },
    {
      title: 'Ngày điều chuyển',
      dataIndex: 'ngayNhap',
      key: 'ngay',
      width: 170,
      render: v => v ? new Date(v).toLocaleString('vi-VN') : '—',
      sorter: (a, b) => new Date(a.ngayNhap) - new Date(b.ngayNhap),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Kho đích',
      dataIndex: 'kho',
      key: 'kho',
      render: v => <Text strong>{v || '—'}</Text>,
    },
    {
      title: 'Nội dung',
      dataIndex: 'ghiChu',
      ellipsis: true,
      render: v => <Text type="secondary">{v || '—'}</Text>,
    },
    {
      title: 'Số mặt hàng',
      key: 'sl',
      width: 110,
      align: 'center',
      render: (_, r) => <Tag>{r.items?.length || 0} loại</Tag>,
    },
  ];

  return (
    <div style={{ padding: '32px 5%', background: '#f5f7fa', minHeight: 'calc(100vh - 76px)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <Title level={3} style={{ margin: 0 }}>
              <SwapOutlined style={{ marginRight: 8, color: '#722ed1' }} />
              Điều Chuyển Kho
            </Title>
            <Text type="secondary">Chuyển thiết bị giữa các kho trong hệ thống</Text>
          </div>
          <Button icon={<ReloadOutlined />} onClick={loadData} loading={loading}>Làm mới</Button>
        </div>

        {/* Sơ đồ luồng */}
        {sourceWh && (
          <Alert
            type="info"
            showIcon
            icon={<SwapOutlined />}
            message={
              <Space>
                <Tag color="blue">{sourceLabel || `Kho ${sourceWh}`}</Tag>
                <ArrowRightOutlined />
                <Text>Kho đích</Text>
              </Space>
            }
            style={{ marginBottom: 20, borderRadius: 8 }}
          />
        )}

        {/* Form điều chuyển */}
        <Card
          bordered={false}
          style={{ borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
          title={<span><SwapOutlined style={{ marginRight: 8 }} />Tạo lệnh điều chuyển</span>}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}
            initialValues={{ items: [{ maThietBi: null, soLuong: 1, donGiaNhap: 0 }] }}>
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item name="maKhoNguon" label="Kho nguồn" rules={[{ required: true, message: 'Chọn kho nguồn' }]}>
                  <Select options={warehouseOptions} placeholder="Chọn kho nguồn" showSearch optionFilterProp="label" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="maKhoDich" label="Kho đích" rules={[{ required: true, message: 'Chọn kho đích' }]}>
                  <Select
                    options={destOptions}
                    placeholder={sourceWh ? 'Chọn kho đích' : 'Chọn kho nguồn trước'}
                    showSearch optionFilterProp="label"
                    disabled={!sourceWh}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="lyDo" label="Lý do điều chuyển">
                  <Input placeholder="Vd: Cân bằng tồn kho, phân phối theo khu vực..." />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">Danh sách thiết bị điều chuyển</Divider>

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
                        label={field.name === 0 ? 'Giá trị (₫)' : ''}
                        initialValue={0}
                      >
                        <InputNumber
                          min={0} style={{ width: '100%' }}
                          formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={v => v?.replace(/\D/g, '') || ''}
                          placeholder="Giá trị tham chiếu"
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
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                size="large"
                icon={<SwapOutlined />}
                style={{ background: '#722ed1', borderColor: '#722ed1' }}
              >
                Thực hiện điều chuyển
              </Button>
            </div>
          </Form>
        </Card>

        {/* Lịch sử điều chuyển */}
        <Card
          bordered={false}
          style={{ borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
          title="Lịch sử điều chuyển"
        >
          <Table
            rowKey="maPhieuNhap"
            columns={columns}
            dataSource={transferHistory}
            loading={loading}
            pagination={{ pageSize: 10, showTotal: t => `Tổng ${t} lần điều chuyển` }}
            scroll={{ x: 800 }}
            locale={{ emptyText: 'Chưa có lịch sử điều chuyển kho' }}
          />
        </Card>
      </div>
    </div>
  );
};

export default WarehouseTransfer;
