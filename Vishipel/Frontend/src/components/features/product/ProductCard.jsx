import React, { useState } from 'react';
import { Card, Tag, Button, Badge } from 'antd'; // Nhớ import Badge
import { ArrowRightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

// Thêm prop isNew vào đây
const ProductCard = ({ item, isNew = false }) => {
  const [hovered, setHovered] = useState(false);

  // Gói nội dung Card vào một biến
  const cardContent = (
    <Card
      hoverable
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      cover={
        <div style={{ overflow: 'hidden', height: 210, position: 'relative' }}>
          <img
            alt={item.name}
            src={item.img}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transform: hovered ? 'scale(1.07)' : 'scale(1)',
              transition: 'transform 0.4s ease',
            }}
          />
        </div>
      }
      style={{
        borderRadius: 12, overflow: 'hidden',
        border: hovered ? '1px solid #1677ff' : '1px solid #f0f0f0',
        boxShadow: hovered ? '0 8px 32px rgba(22,119,255,0.15)' : '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'all 0.3s ease',
        height: '100%' // Đảm bảo các thẻ cao bằng nhau
      }}
    >
      <Tag color={item.typeColor} style={{ marginBottom: 8, fontWeight: 500 }}>{item.type}</Tag>
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{item.name}</div>
      <div style={{ color: '#8c8c8c', fontSize: 13, marginBottom: 12 }}>Model: {item.model}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#1677ff', fontWeight: 700, fontSize: 15 }}>{item.price}</span>
        <Link to={`/products/${item.id}`}>
          <Button
            type={hovered ? 'primary' : 'default'} size="small" icon={<ArrowRightOutlined />}
            style={{ borderRadius: 8, transition: 'all 0.2s' }}
          >
            Chi tiết
          </Button>
        </Link>
      </div>
    </Card>
  );

  // Nếu isNew = true thì bọc ruy-băng "MỚI" màu đỏ, nếu không thì hiện Card bình thường
  return isNew ? (
    <Badge.Ribbon text="MỚI" color="volcano" style={{ fontWeight: 700, top: 10, padding: '0 12px' }}>
      {cardContent}
    </Badge.Ribbon>
  ) : (
    cardContent
  );
};

export default ProductCard;