import React, { useState } from 'react';
import { Card, Tag, Button, Badge } from 'antd';
import { ArrowRightOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

// 1. HÀM TẠO MÀU SẮC THÔNG MINH CHO TRẠNG THÁI
const getStatusTag = (status) => {
  if (!status) return <Tag color="default">Chưa cập nhật</Tag>;
  
  const s = status.toLowerCase();
  if (s.includes('còn hàng') || s.includes('sẵn sàng')) {
    return <Tag color="success" style={{ fontWeight: 600 }}> {status}</Tag>;
  }
  if (s.includes('hết hàng') || s.includes('không sẵn sàng')) {
    return <Tag color="error" style={{ fontWeight: 600 }}> {status}</Tag>;
  }
  if (s.includes('ngừng kinh doanh') || s.includes('thanh lý')) {
    return <Tag color="default" style={{ fontWeight: 600 }}> {status}</Tag>;
  }
  // Mặc định cho các trạng thái khác (Đang bảo trì, Đang giao...)
  return <Tag color="processing" style={{ fontWeight: 600 }}> {status}</Tag>;
};

const ProductCard = ({ item, isNew = false, onAdd }) => {
  const [hovered, setHovered] = useState(false);

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
        height: '100%'
      }}
    >
      <Tag color={item.typeColor || 'blue'} style={{ marginBottom: 8, fontWeight: 500 }}>{item.type || 'Thiết bị'}</Tag>
      
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4, height: 44, overflow: 'hidden' }}>
        {item.name}
      </div>
      
      <div style={{ color: '#8c8c8c', fontSize: 13, marginBottom: 12 }}>
        Model: <strong style={{ color: '#555' }}>{item.model}</strong>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', gap: 8 }}>
        
        {/* 2. THAY THẾ GIÁ TIỀN BẰNG TRẠNG THÁI Ở ĐÂY */}
        <div style={{ flex: 1 }}>{getStatusTag(item.status)}</div>

        <div style={{ display: 'flex', gap: 6 }}>
          <Button
            type="default"
            size="small"
            icon={<ShoppingCartOutlined />}
            style={{ borderRadius: 8 }}
            title="Thêm vào danh sách yêu cầu"
            disabled={item.status !== 'Còn hàng'}
            onClick={(e) => {
              e.preventDefault();
              onAdd?.(item);
            }}
          />
          <Link to={`/products/${item.id}`}>
            <Button
              type={hovered ? 'primary' : 'default'}
              size="small"
              icon={<ArrowRightOutlined />}
              style={{ borderRadius: 8, transition: 'all 0.2s' }}
            >
              Chi tiết
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );

  return isNew ? (
    <Badge.Ribbon text="MỚI" color="volcano" style={{ fontWeight: 700, top: 10, padding: '0 12px' }}>
      {cardContent}
    </Badge.Ribbon>
  ) : (
    cardContent
  );
};

export default ProductCard;
