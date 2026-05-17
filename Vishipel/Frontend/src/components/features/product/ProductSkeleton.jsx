import React from 'react';
import { Col, Card, Skeleton } from 'antd';

const ProductSkeleton = () => {
  return (
    <Col xs={24} sm={12} md={6}>
      <Card style={{ borderRadius: 12 }}>
        <Skeleton.Image active style={{ width: '100%', height: 210, marginBottom: 16 }} />
        <Skeleton active paragraph={{ rows: 3 }} />
      </Card>
    </Col>
  );
};

export default ProductSkeleton;
