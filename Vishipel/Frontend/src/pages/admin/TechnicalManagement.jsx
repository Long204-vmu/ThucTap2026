import React from 'react';
import { Typography, Card, Row, Col } from 'antd';

const { Title, Paragraph } = Typography;

const TechnicalManagement = () => (
  <Row justify="center" style={{ padding: 24 }}>
    <Col xs={24} lg={16}>
      <Card style={{ borderRadius: 12, minHeight: 320 }}>
        <Title level={3}>Quản lý kỹ thuật</Title>
        <Paragraph>
          Đây là phân hệ quản lý thiết bị, lắp đặt, bảo hành và khiếu nại khách hàng.
          Tính năng sẽ được hoàn thiện tiếp theo.
        </Paragraph>
      </Card>
    </Col>
  </Row>
);

export default TechnicalManagement;
