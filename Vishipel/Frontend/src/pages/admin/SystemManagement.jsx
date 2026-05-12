import React from 'react';
import { Typography, Card, Row, Col } from 'antd';

const { Title, Paragraph } = Typography;

const SystemManagement = () => (
  <Row justify="center" style={{ padding: 24 }}>
    <Col xs={24} lg={16}>
      <Card style={{ borderRadius: 12, minHeight: 320 }}>
        <Title level={3}>Quản lý hệ thống</Title>
        <Paragraph>
          Tại đây sẽ là nơi quản lý phân quyền, vô hiệu hóa người dùng và các thiết lập hệ thống chung.
          Chức năng đang được xây dựng để hoàn chỉnh theo yêu cầu quản trị.
        </Paragraph>
      </Card>
    </Col>
  </Row>
);

export default SystemManagement;
