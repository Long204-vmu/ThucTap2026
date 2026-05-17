import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Card,
  Typography,
  Tabs,
  Table,
  Form,
  Select,
  Input,
  InputNumber,
  Button,
  Space,
  Tag,
  Divider,
  message,
} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { getProducts } from '../../services/productService';
import {
  getWarehouseStock,
  getWarehouseImports,
  getWarehouseExports,
  createWarehouseImport,
  createWarehouseExport,
  createWarehouseTransfer,
  getWarehouseOptions,
  getWarehouseSuppliers,
} from '../../services/warehouseService';

const { Title, Text } = Typography;

const WarehouseManagement = () => {
  const [stockData, setStockData] = useState([]);
  const [importHistory, setImportHistory] = useState([]);
  const [exportHistory, setExportHistory] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [importForm] = Form.useForm();
  const [exportForm] = Form.useForm();
  const [transferForm] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const [stockRes, warehouseRes, supplierRes, productRes, importRes, exportRes] = await Promise.all([
        getWarehouseStock(5),
        getWarehouseOptions(),
        getWarehouseSuppliers(),
        getProducts(),
        getWarehouseImports(),
        getWarehouseExports(),
      ]);

      setStockData(stockRes.data);
      setWarehouses(warehouseRes.data || []);
      setSuppliers(supplierRes.data || []);
      setProducts(productRes.data || []);
      setImportHistory(importRes.data || []);
      setExportHistory(exportRes.data || []);
    } catch (error) {
      message.error('Không thể tải dữ liệu kho. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const productOptions = products.map((item) => ({
    label: item.tenThietBi,
    value: item.maThietBi,
  }));

  const warehouseOptions = warehouses.map((item) => ({
    label: item.tenLoai,
    value: item.maLoai,
  }));

  const supplierOptions = suppliers.map((item) => ({
    label: item.tenNCC,
    value: item.maNCC,
  }));

  const lowStockCount = stockData.filter((item) => item.lowStock).length;

  const handleImport = async (values) => {
    if (!values.items || !values.items.length) {
      message.warning('Vui lòng thêm ít nhất một sản phẩm.');
      return;
    }

    try {
      setLoading(true);
      await createWarehouseImport({
        maKho: values.maKho,
        maNCC: values.maNCC,
        ghiChu: values.ghiChu,
        items: values.items.map((item) => ({
          maThietBi: item.maThietBi,
          soLuong: item.soLuong,
          donGiaNhap: item.donGiaNhap || 0,
        })),
      });
      message.success('Phiếu nhập kho đã tạo thành công.');
      importForm.resetFields();
      loadData();
    } catch (error) {
      message.error('Tạo phiếu nhập kho thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (values) => {
    if (!values.items || !values.items.length) {
      message.warning('Vui lòng thêm ít nhất một sản phẩm.');
      return;
    }
    try {
      setLoading(true);
      await createWarehouseExport({
        maKho: values.maKho,
        maHopDong: values.maHopDong,
        lyDoXuat: values.lyDoXuat,
        items: values.items.map((item) => ({
          maThietBi: item.maThietBi,
          soLuong: item.soLuong,
          donGiaBan: item.donGiaBan || 0,
        })),
      });
      message.success('Phiếu xuất kho đã tạo thành công.');
      exportForm.resetFields();
      loadData();
    } catch (error) {
      message.error('Tạo phiếu xuất kho thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async (values) => {
    if (!values.items || !values.items.length) {
      message.warning('Vui lòng thêm ít nhất một sản phẩm.');
      return;
    }

    if (values.maKhoNguon === values.maKhoDich) {
      message.warning('Kho nguồn và kho đích phải khác nhau.');
      return;
    }

    try {
      setLoading(true);
      await createWarehouseTransfer({
        maKhoNguon: values.maKhoNguon,
        maKhoDich: values.maKhoDich,
        lyDo: values.lyDo,
        items: values.items.map((item) => ({
          maThietBi: item.maThietBi,
          soLuong: item.soLuong,
          donGiaNhap: item.donGiaNhap || 0,
        })),
      });
      message.success('Điều chuyển kho đã thực hiện thành công.');
      transferForm.resetFields();
      loadData();
    } catch (error) {
      message.error('Điều chuyển kho thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const stockColumns = [
    { title: 'Kho', dataIndex: 'kho', key: 'kho', width: 180 },
    { title: 'Mã thiết bị', dataIndex: 'maThietBi', key: 'maThietBi', width: 90 },
    { title: 'Tên thiết bị', dataIndex: 'thietBi', key: 'thietBi' },
    { title: 'Số lượng tồn', dataIndex: 'soLuongTon', key: 'soLuongTon', width: 120 },
    {
      title: 'Cảnh báo',
      dataIndex: 'lowStock',
      key: 'lowStock',
      width: 120,
      render: (lowStock) => (
        <Tag color={lowStock ? 'red' : 'green'}>{lowStock ? 'Thiếu hàng' : 'OK'}</Tag>
      ),
    },
    {
      title: 'Cập nhật',
      dataIndex: 'ngayCapNhat',
      key: 'ngayCapNhat',
      width: 200,
      render: (value) => value ? new Date(value).toLocaleString() : '-',
    },
  ];

  const importColumns = [
    { title: 'Mã phiếu', dataIndex: 'maPhieuNhap', key: 'maPhieuNhap', width: 110 },
    { title: 'Ngày nhập', dataIndex: 'ngayNhap', key: 'ngayNhap', width: 180, render: (value) => value ? new Date(value).toLocaleString() : '-' },
    { title: 'Kho', dataIndex: 'kho', key: 'kho', width: 140 },
    { title: 'Nhà cung cấp', dataIndex: 'nhaCungCap', key: 'nhaCungCap', width: 180 },
    { title: 'Ghi chú', dataIndex: 'ghiChu', key: 'ghiChu' },
  ];

  const exportColumns = [
    { title: 'Mã phiếu', dataIndex: 'maPhieuXuat', key: 'maPhieuXuat', width: 110 },
    { title: 'Ngày xuất', dataIndex: 'ngayXuat', key: 'ngayXuat', width: 180, render: (value) => value ? new Date(value).toLocaleString() : '-' },
    { title: 'Kho', dataIndex: 'kho', key: 'kho', width: 140 },
    { title: 'Lý do', dataIndex: 'lyDoXuat', key: 'lyDoXuat' },
  ];

  const formItemStyle = { width: '100%', marginBottom: 8 };
  const itemFieldStyle = { minWidth: 240, flex: 1 };

  const renderItemsForm = (itemLabel, includePrice = false, isTransfer = false) => (
    <Form.List name="items" initialValue={[{ maThietBi: null, soLuong: 1, donGiaNhap: 0, donGiaBan: 0 }]}>  
      {(fields, { add, remove }) => (
        <>
          {fields.map((field) => (
            <Space key={field.key} align="start" wrap style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <Form.Item
                {...field}
                name={[field.name, 'maThietBi']}
                fieldKey={[field.fieldKey, 'maThietBi']}
                rules={[{ required: true, message: 'Chọn sản phẩm' }]}
                style={itemFieldStyle}
              >
                <Select options={productOptions} placeholder="Sản phẩm" />
              </Form.Item>

              <Form.Item
                {...field}
                name={[field.name, 'soLuong']}
                fieldKey={[field.fieldKey, 'soLuong']}
                rules={[{ required: true, message: 'Nhập số lượng' }]}
                style={{ width: 140 }}
                initialValue={1}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>

              {includePrice && (
                <Form.Item
                  {...field}
                  name={[field.name, isTransfer ? 'donGiaNhap' : 'donGiaNhap']}
                  fieldKey={[field.fieldKey, isTransfer ? 'donGiaNhap' : 'donGiaNhap']}
                  rules={[{ required: false }]}
                  style={{ width: 160 }}
                >
                  <InputNumber min={0} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={(value) => value?.replace(/\D/g, '') || ''} style={{ width: '100%' }} placeholder="Giá nhập" />
                </Form.Item>
              )}

              {includePrice && !isTransfer && (
                <Form.Item
                  {...field}
                  name={[field.name, 'donGiaBan']}
                  fieldKey={[field.fieldKey, 'donGiaBan']}
                  rules={[{ required: false }]}
                  style={{ width: 160 }}
                >
                  <InputNumber min={0} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={(value) => value?.replace(/\D/g, '') || ''} style={{ width: '100%' }} placeholder="Giá bán" />
                </Form.Item>
              )}

              <MinusCircleOutlined onClick={() => remove(field.name)} style={{ marginTop: 8, color: '#ff4d4f' }} />
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
  );

  const tabItems = [
    {
      key: 'stock',
      label: 'Tồn kho',
      children: (
        <>
          <Row gutter={16} style={{ marginBottom: 20 }}>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Text type="secondary">Tổng dòng tồn kho</Text>
                <Title level={3} style={{ margin: '12px 0 0' }}>{stockData.length}</Title>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Text type="secondary">Cảnh báo thiếu</Text>
                <Title level={3} style={{ margin: '12px 0 0' }}>{lowStockCount}</Title>
              </Card>
            </Col>
          </Row>
          <Card>
            <Title level={4}>Danh sách tồn kho</Title>
            <Table
              rowKey={(record) => `${record.maKho}-${record.maThietBi}`}
              columns={stockColumns}
              dataSource={stockData}
              loading={loading}
              pagination={{ pageSize: 10 }}
              scroll={{ x: 900 }}
            />
          </Card>
        </>
      ),
    },
    {
      key: 'import',
      label: 'Phiếu nhập hàng',
      children: (
        <>
          <Card style={{ marginBottom: 24 }}>
            <Title level={4}>Tạo phiếu nhập</Title>
            <Form form={importForm} layout="vertical" onFinish={handleImport} initialValues={{ items: [{ maThietBi: null, soLuong: 1, donGiaNhap: 0 }] }}>
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item name="maKho" label="Kho nhập" rules={[{ required: true, message: 'Vui lòng chọn kho' }]}>
                    <Select options={warehouseOptions} placeholder="Chọn kho" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="maNCC" label="Nhà cung cấp">
                    <Select options={supplierOptions} placeholder="Chọn nhà cung cấp" allowClear />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="ghiChu" label="Ghi chú">
                    <Input placeholder="Ghi chú thêm" />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />
              {renderItemsForm('Phiếu nhập', true, true)}

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Lưu phiếu nhập
                </Button>
              </Form.Item>
            </Form>
          </Card>

          <Card>
            <Title level={4}>Lịch sử phiếu nhập</Title>
            <Table
              rowKey="maPhieuNhap"
              columns={importColumns}
              dataSource={importHistory}
              loading={loading}
              pagination={{ pageSize: 8 }}
              expandable={{
                expandedRowRender: (record) => (
                  <div>
                    {record.items?.map((item) => (
                      <div key={`${record.maPhieuNhap}-${item.maThietBi}`} style={{ marginBottom: 8 }}>
                        <Text strong>{item.thietBi}</Text> — Số lượng: {item.soLuong}, Giá nhập: {item.donGiaNhap?.toLocaleString() || 0}
                      </div>
                    ))}
                  </div>
                ),
              }}
            />
          </Card>
        </>
      ),
    },
    {
      key: 'export',
      label: 'Phiếu xuất hàng',
      children: (
        <>
          <Card style={{ marginBottom: 24 }}>
            <Title level={4}>Tạo phiếu xuất</Title>
            <Form form={exportForm} layout="vertical" onFinish={handleExport} initialValues={{ items: [{ maThietBi: null, soLuong: 1, donGiaBan: 0 }] }}>
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item name="maKho" label="Kho xuất" rules={[{ required: true, message: 'Vui lòng chọn kho' }]}>
                    <Select options={warehouseOptions} placeholder="Chọn kho" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="maHopDong" label="Mã hợp đồng">
                    <Input placeholder="Mã hợp đồng (nếu có)" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="lyDoXuat" label="Lý do xuất">
                    <Input placeholder="Lý do xuất kho" />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />
              {renderItemsForm('Phiếu xuất', true, false)}

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Lưu phiếu xuất
                </Button>
              </Form.Item>
            </Form>
          </Card>

          <Card>
            <Title level={4}>Lịch sử phiếu xuất</Title>
            <Table
              rowKey="maPhieuXuat"
              columns={exportColumns}
              dataSource={exportHistory}
              loading={loading}
              pagination={{ pageSize: 8 }}
              expandable={{
                expandedRowRender: (record) => (
                  <div>
                    {record.items?.map((item) => (
                      <div key={`${record.maPhieuXuat}-${item.maThietBi}`} style={{ marginBottom: 8 }}>
                        <Text strong>{item.thietBi}</Text> — Số lượng: {item.soLuong}, Giá bán: {item.donGiaBan?.toLocaleString() || 0}
                      </div>
                    ))}
                  </div>
                ),
              }}
            />
          </Card>
        </>
      ),
    },
    {
      key: 'transfer',
      label: 'Điều chuyển kho',
      children: (
        <Card>
          <Title level={4}>Điều chuyển kho</Title>
          <Form form={transferForm} layout="vertical" onFinish={handleTransfer} initialValues={{ items: [{ maThietBi: null, soLuong: 1, donGiaNhap: 0 }] }}>
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item name="maKhoNguon" label="Kho nguồn" rules={[{ required: true, message: 'Chọn kho nguồn' }]}>
                  <Select options={warehouseOptions} placeholder="Kho nguồn" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="maKhoDich" label="Kho đích" rules={[{ required: true, message: 'Chọn kho đích' }]}>
                  <Select options={warehouseOptions} placeholder="Kho đích" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="lyDo" label="Lý do điều chuyển">
                  <Input placeholder="Lý do điều chuyển" />
                </Form.Item>
              </Col>
            </Row>

            <Divider />
            {renderItemsForm('Điều chuyển', true, true)}

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Thực hiện điều chuyển
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
  ];

  return (
    <div style={{ padding: '32px 5%', background: '#f5f7fa', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 2px 18px rgba(0,0,0,0.06)' }}>
        <Title level={3}>Quản lý kho</Title>
        <Text type="secondary">Màn hình quản lý phiếu nhập, xuất, điều chuyển và cảnh báo tồn kho.</Text>
        <Divider />
        <Tabs defaultActiveKey="stock" items={tabItems} />
      </div>
    </div>
  );
};

export default WarehouseManagement;
