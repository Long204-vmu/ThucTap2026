import React from 'react';
import { Drawer, Button, Empty, Typography } from 'antd';
import { ShoppingCartOutlined, CloseOutlined } from '@ant-design/icons';

const { Text } = Typography;

const CartDrawer = ({ open, cart, onClose, onRemove }) => {
  const formatPrice = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

  return (
    <Drawer
      title={<span><ShoppingCartOutlined /> Giỏ hàng ({cart.length})</span>}
      placement="right"
      onClose={onClose}
      open={open}
      width={360}
      footer={
        cart.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <Text strong>Tổng cộng:</Text>
              <Text strong style={{ color: '#1677ff', fontSize: 16 }}>
                {formatPrice(cart.reduce((s, p) => s + p.price, 0))}
              </Text>
            </div>
            <Button type="primary" block size="large" style={{ borderRadius: 10, height: 46, fontWeight: 600 }}>
              Đặt hàng
            </Button>
          </div>
        )
      }
    >
      {cart.length === 0 ? (
        <Empty description="Giỏ hàng trống" style={{ paddingTop: 60 }} />
      ) : (
        cart.map(item => (
          <div key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}>
            {/* Lấy ảnh đầu tiên, nếu không có thì lấy ảnh placeholder */}
            <img 
              src={item.img || (item.images && item.images[0]) || 'https://via.placeholder.com/150'} 
              alt={item.name} 
              style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8 }} 
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
              <div style={{ color: '#1677ff', fontWeight: 700, fontSize: 14 }}>
                {formatPrice(item.price)}
              </div>
            </div>
            <Button type="text" icon={<CloseOutlined />} size="small" onClick={() => onRemove(item.id)} danger />
          </div>
        ))
      )}
    </Drawer>
  );
};

export default CartDrawer;