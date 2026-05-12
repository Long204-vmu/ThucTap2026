import React from 'react';
import { Typography, Card, Row, Col } from 'antd';

const { Title, Paragraph } = Typography;

const WarehouseManagement = () => (
  <Row justify="center" style={{ padding: 24 }}>
    <Col xs={24} lg={16}>
      <Card style={{ borderRadius: 12, minHeight: 320 }}>
        <Title level={3}>Quản lý kho</Title>
        <Paragraph>
          Đây là phân hệ Quản lý phiếu nhập, xuất và điều chuyển kho.
          Chức năng đang được phát triển để hoàn chỉnh thao tác quản lý kho.
        </Paragraph>
      </Card>
    </Col>
  </Row>
);

export default WarehouseManagement;
