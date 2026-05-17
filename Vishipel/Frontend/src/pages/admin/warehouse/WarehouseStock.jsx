import React, { useEffect, useState } from 'react';
import {
  Card, Table, Typography, Tag, Button, InputNumber, Space, Statistic, Row, Col, Tooltip, Input
} from 'antd';
import {
  ReloadOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  SearchOutlined,
  InboxOutlined
} from '@ant-design/icons';
import { getWarehouseStock, getWarehouseOptions } from '../../../services/warehouseService';
import { message } from 'antd';

const { Title, Text } = Typography;

const WarehouseStock = () => {
  const [stockData, setStockData] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [threshold, setThreshold] = useState(5);
  const [searchText, setSearchText] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [stockRes, warehouseRes] = await Promise.all([
        getWarehouseStock(threshold),
        getWarehouseOptions(),
      ]);
      setStockData(stockRes.data || []);
      setWarehouses(warehouseRes.data || []);
    } catch {
      message.error('Không thể tải dữ liệu tồn kho.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [threshold]);

  const filtered = stockData.filter(item =>
    !searchText ||
    item.thietBi?.toLowerCase().includes(searchText.toLowerCase()) ||
    String(item.maThietBi).includes(searchText) ||
    item.kho?.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalItems = stockData.length;
  const lowStockCount = stockData.filter(i => i.lowStock).length;
  const totalQty = stockData.reduce((sum, i) => sum + (i.soLuongTon || 0), 0);

  const columns = [
    {
      title: 'Mã phiếu / Kho',
      key: 'kho',
      width: 200,
      render: (_, record) => (
        <div>
          <Text strong style={{ color: '#1890ff' }}>{record.kho || '—'}</Text>
          <div><Text type="secondary" style={{ fontSize: 12 }}>Mã kho: {record.maKho}</Text></div>
        </div>
      ),
    },
    {
      title: 'Thiết bị',
      key: 'thietbi',
      render: (_, record) => (
        <div>
          <Text strong>{record.thietBi || '—'}</Text>
          <div><Text type="secondary" style={{ fontSize: 12 }}>Mã TB: {record.maThietBi}</Text></div>
        </div>
      ),
    },
    {
      title: 'Số lượng tồn',
      dataIndex: 'soLuongTon',
      key: 'soLuongTon',
      width: 130,
      align: 'center',
      sorter: (a, b) => a.soLuongTon - b.soLuongTon,
      render: (val, record) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: 22, fontWeight: 700,
            color: record.lowStock ? '#ff4d4f' : '#52c41a'
          }}>{val}</div>
          <Text type="secondary" style={{ fontSize: 11 }}>đơn vị</Text>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'lowStock',
      key: 'lowStock',
      width: 130,
      align: 'center',
      filters: [
        { text: 'Thiếu hàng', value: true },
        { text: 'Đủ hàng', value: false },
      ],
      onFilter: (value, record) => record.lowStock === value,
      render: (lowStock) =>
        lowStock ? (
          <Tag color="red" icon={<WarningOutlined />}>Thiếu hàng</Tag>
        ) : (
          <Tag color="green" icon={<CheckCircleOutlined />}>Đủ hàng</Tag>
        ),
    },
    {
      title: 'Cập nhật lần cuối',
      dataIndex: 'ngayCapNhat',
      key: 'ngayCapNhat',
      width: 180,
      render: (val) => val ? new Date(val).toLocaleString('vi-VN') : '—',
    },
  ];

  return (
    <div style={{ padding: '32px 5%', background: '#f5f7fa', minHeight: 'calc(100vh - 76px)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <Title level={3} style={{ margin: 0 }}>
              <InboxOutlined style={{ marginRight: 8, color: '#1890ff' }} />
              Tồn kho hiện tại
            </Title>
            <Text type="secondary">Theo dõi số lượng thiết bị còn trong các kho</Text>
          </div>
          <Button icon={<ReloadOutlined />} onClick={loadData} loading={loading}>Làm mới</Button>
        </div>

        {/* Thống kê */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={8}>
            <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <Statistic title="Tổng dòng tồn kho" value={totalItems} valueStyle={{ color: '#1890ff' }} />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <Statistic title="Tổng số lượng" value={totalQty} suffix="đv" valueStyle={{ color: '#52c41a' }} />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <Statistic title="Cảnh báo thiếu hàng" value={lowStockCount} valueStyle={{ color: lowStockCount > 0 ? '#ff4d4f' : '#52c41a' }} suffix="mục" />
            </Card>
          </Col>
        </Row>

        <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Tìm theo tên thiết bị, mã TB, kho..."
              style={{ width: 280 }}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
            />
            <Space align="center">
              <Text type="secondary">Ngưỡng cảnh báo:</Text>
              <InputNumber
                min={1}
                max={100}
                value={threshold}
                onChange={val => setThreshold(val || 5)}
                addonAfter="đv"
                style={{ width: 120 }}
              />
            </Space>
          </div>
          <Table
            rowKey={(r) => `${r.maKho}-${r.maThietBi}`}
            columns={columns}
            dataSource={filtered}
            loading={loading}
            pagination={{ pageSize: 15, showTotal: (t) => `Tổng ${t} bản ghi` }}
            scroll={{ x: 800 }}
            rowClassName={(r) => r.lowStock ? 'low-stock-row' : ''}
          />
        </Card>
      </div>
    </div>
  );
};

export default WarehouseStock;
