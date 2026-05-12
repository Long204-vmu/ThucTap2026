import React, { useState } from 'react';
import { Drawer, Button, Empty, Typography, Input, message } from 'antd';
import { ShoppingCartOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../services/apiClient';

const { Text } = Typography;
const { TextArea } = Input;

const CartDrawer = ({ open, cart, onClose, onRemove, onClearCart }) => {
  const navigate = useNavigate();
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const formatPrice = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

  const handleSubmit = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      setSubmitting(true);
      const payload = {
        note: note,
        items: cart.map(item => ({
          productId: item.id,
          productName: item.name,
          quantity: 1,
          referencePrice: item.price
        }))
      };
      
      await apiClient.post('/api/QuoteRequests', payload);
      message.success('Gửi yêu cầu báo giá thành công! Bạn có thể xem trong Lịch sử yêu cầu.');
      setNote('');
      onClearCart?.();
      onClose();
    } catch (err) {
      message.error('Gửi yêu cầu thất bại. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Drawer
      title={<span><ShoppingCartOutlined /> Giỏ hàng ({cart.length})</span>}
      placement="right"
      onClose={onClose}
      open={open}
      size="default"
      footer={
        cart.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <Text strong>Tổng cộng (Tham khảo):</Text>
              <Text strong style={{ color: '#1677ff', fontSize: 16 }}>
                {formatPrice(cart.reduce((s, p) => s + p.price, 0))}
              </Text>
            </div>
            
            {user ? (
              <>
                <TextArea 
                  rows={2} 
                  placeholder="Ghi chú thêm cho Sale (VD: Cần gấp, xin báo giá VAT...)" 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  style={{ marginBottom: 16 }}
                />
                <Button type="primary" block size="large" onClick={handleSubmit} loading={submitting} style={{ borderRadius: 10, height: 46, fontWeight: 600 }}>
                  Gửi Yêu cầu Báo giá
                </Button>
              </>
            ) : (
              <Button type="primary" block size="large" onClick={() => navigate('/login')} style={{ borderRadius: 10, height: 46, fontWeight: 600 }}>
                Đăng nhập để Yêu cầu Báo giá
              </Button>
            )}
          </div>
        )
      }
    >
      {cart.length === 0 ? (
        <Empty description="Giỏ hàng trống" style={{ paddingTop: 60 }} />
      ) : (
        cart.map(item => (
          <div key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}>
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