import React, { useState } from 'react';
import { Drawer, Button, Empty, Typography, Input, message, InputNumber } from 'antd';
import { ShoppingCartOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../services/apiClient';

const { Text } = Typography;
const { TextArea } = Input;

const CartDrawer = ({ open, cart, onClose, onRemove, onClearCart, onUpdateQuantity }) => {
  const navigate = useNavigate();
  const [vesselName, setVesselName] = useState('');
  const [deliveryPort, setDeliveryPort] = useState('');
  const [additionalNote, setAdditionalNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleSubmit = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Ghép các trường thông tin vào Note để gửi lên Backend
      const fullNote = `[Tàu/Dự án: ${vesselName || 'N/A'}] 
[Cảng giao: ${deliveryPort || 'N/A'}] 
[Ghi chú: ${additionalNote || 'Không có'}]`;

      const payload = {
        note: fullNote,
        items: cart.map(item => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity || 1,
          referencePrice: item.price
        }))
      };
      
      await apiClient.post('/api/QuoteRequests', payload);
      message.success('Gửi yêu cầu báo giá thành công! Chúng tôi sẽ phản hồi sớm nhất.');
      setVesselName('');
      setDeliveryPort('');
      setAdditionalNote('');
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
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ShoppingCartOutlined style={{ color: '#1677ff' }} />
          <span>Yêu cầu báo giá ({cart.length} thiết bị)</span>
        </div>
      }
      placement="right"
      onClose={onClose}
      open={open}
      width={450}
      footer={
        cart.length > 0 && (
          <div style={{ padding: '10px 0' }}>
            {user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 5 }}>Tên tàu / Dự án:</Text>
                  <Input 
                    placeholder="VD: Vessel MV. Vishipel 01..." 
                    value={vesselName}
                    onChange={(e) => setVesselName(e.target.value)}
                  />
                </div>
                
                <div>
                  <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 5 }}>Cảng/Địa điểm giao hàng:</Text>
                  <Input 
                    placeholder="VD: Cảng Hải Phòng, Cảng Cái Mép..." 
                    value={deliveryPort}
                    onChange={(e) => setDeliveryPort(e.target.value)}
                  />
                </div>

                <div>
                  <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 5 }}>Ghi chú thêm:</Text>
                  <TextArea 
                    rows={2} 
                    placeholder="Cần gấp, xin báo giá kèm VAT, CO/CQ..." 
                    value={additionalNote}
                    onChange={(e) => setAdditionalNote(e.target.value)}
                  />
                </div>

                <Button 
                  type="primary" 
                  block 
                  size="large" 
                  onClick={handleSubmit} 
                  loading={submitting} 
                  style={{ 
                    borderRadius: 8, 
                    height: 50, 
                    fontWeight: 700, 
                    fontSize: 16,
                    marginTop: 8,
                    boxShadow: '0 4px 12px rgba(22, 119, 255, 0.3)'
                  }}
                >
                  GỬI YÊU CẦU BÁO GIÁ
                </Button>
                <Text type="secondary" style={{ fontSize: 12, textAlign: 'center' }}>
                  Hệ thống sẽ ghi nhận và phản hồi trong vòng 24h làm việc.
                </Text>
              </div>
            ) : (
              <Button type="primary" block size="large" onClick={() => navigate('/login')} style={{ borderRadius: 8, height: 46, fontWeight: 600 }}>
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
              <div style={{ marginTop: 4 }}>
                <Text type="secondary" style={{ marginRight: 8, fontSize: 12 }}>Số lượng:</Text>
                <InputNumber 
                  min={1} 
                  max={100} 
                  size="small" 
                  value={item.quantity || 1} 
                  onChange={(val) => onUpdateQuantity?.(item.id, val)}
                  style={{ width: 60 }}
                />
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
