import React from 'react';
import { Typography, Card, Row, Col } from 'antd';

const { Title, Paragraph } = Typography;

const ReportsManagement = () => (
  <Row justify="center" style={{ padding: 24 }}>
    <Col xs={24} lg={16}>
      <Card style={{ borderRadius: 12, minHeight: 320 }}>
        <Title level={3}>Báo cáo thống kê</Title>
        <Paragraph>
          Đây là khu vực tổng hợp báo cáo và thống kê hệ thống.
          Các báo cáo hiện tại sẽ được cập nhật tại đây.
        </Paragraph>
      </Card>
    </Col>
  </Row>
);

export default ReportsManagement;
