import React from 'react';
import { Row, Col, Statistic } from 'antd';
import { SafetyCertificateOutlined, GlobalOutlined, ThunderboltOutlined } from '@ant-design/icons';

const MOCK_STATS = [
  { label: 'Thiết bị quản lý', value: 1500, suffix: '+', icon: <SafetyCertificateOutlined /> },
  { label: 'Đối tác tin cậy',  value: 48,   suffix: '+', icon: <GlobalOutlined /> },
  { label: 'Năm kinh nghiệm',  value: 15,   suffix: '',  icon: <ThunderboltOutlined /> },
  { label: 'Độ chính xác',     value: 99.9, suffix: '%', icon: <SafetyCertificateOutlined />, precision: 1 },
];

const StatsBar = () => {
  return (
    <div style={{ background: '#001529', padding: '32px 8%' }}>
      <Row gutter={[24, 24]} justify="center">
        {MOCK_STATS.map((s, i) => (
          <Col xs={12} sm={6} key={i} style={{ textAlign: 'center' }}>
            <Statistic
              value={s.value} suffix={s.suffix} precision={s.precision ?? 0}
              valueStyle={{ color: '#1677ff', fontWeight: 700, fontSize: 32 }}
            />
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 4 }}>{s.label}</div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default StatsBar;