import React, { useState } from 'react';
import { message, Form, Input, Button, Checkbox, Alert, Divider } from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  EyeInvisibleOutlined, 
  EyeTwoTone, 
  ArrowRightOutlined,
  ArrowLeftOutlined // Đã import thêm icon mũi tên quay lại
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/common/AuthLayout';
import { login } from '../services/authService';

const FEATURES = [
  { icon: '🛡️', text: 'Bảo mật đa lớp theo chuẩn ISO 27001' },
  { icon: '⚡', text: 'Truy xuất tức thì qua mã QR thiết bị' },
  { icon: '📊', text: 'Dashboard thống kê thời gian thực' },
  { icon: '🌐', text: 'Tuân thủ SOLAS & IMO quốc tế' },
];

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const res = await login({ tenDangNhap: values.username, password: values.password });
      const { token, user } = res.data;
      // Dọn dẹp dữ liệu cũ trước khi lưu mới
      localStorage.clear();
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      message.success('Đăng nhập thành công!');
      
      // Chuyển hướng dựa trên Role
      if (['Admin', 'Manager', 'SaleManager', 'Warehouse', 'Accounting'].includes(user.role)) {
        window.location.href = '/admin/sales';
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      if (err.response && err.response.status === 401) setError('Tên đăng nhập hoặc mật khẩu không chính xác.');
      else setError(err.response?.data?.message || 'Lỗi kết nối máy chủ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý khi bấm Quên mật khẩu (Tạm thời)
  const handleForgotPassword = () => {
    message.info('Chức năng Khôi phục mật khẩu đang được phát triển. Vui lòng liên hệ Admin!');
  };

  const renderFeatures = (mounted) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {FEATURES.map((f, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: mounted ? 1 : 0, transform: mounted ? 'translateX(0)' : 'translateX(-20px)', transition: `all 0.5s ease ${0.3 + i * 0.1}s` }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(0,87,255,0.12)', border: '1px solid rgba(0,87,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{f.icon}</div>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>{f.text}</span>
        </div>
      ))}
    </div>
  );

  return (
    <AuthLayout
      leftTag="Hệ thống quản lý thiết bị hàng hải"
      leftTitle={<>Quản lý thiết bị<br /><span style={{ background: 'linear-gradient(90deg, #4d8eff, #0057FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>thông minh & hiệu quả</span></>}
      leftDescription="Nền tảng số hóa vòng đời thiết bị hàng hải — chuẩn xác, an toàn, được phát triển dành riêng cho Vishipel."
      leftExtra={renderFeatures}
    >
      {/* NÚT QUAY LẠI TRANG CHỦ */}
      <div style={{ marginBottom: 24 }}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/')}
          style={{ padding: 0, color: '#8c8c8c', fontWeight: 500, display: 'flex', alignItems: 'center' }}
        >
          Quay lại Trang chủ
        </Button>
      </div>

      <div style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#001529', margin: '0 0 8px' }}>Đăng nhập hệ thống</h2>
        <p style={{ color: '#8c8c8c', fontSize: 15, margin: 0 }}>Chào mừng trở lại! Vui lòng nhập thông tin tài khoản.</p>
      </div>

      {error && <Alert title={error} type="error" showIcon closable onClose={() => setError(null)} style={{ marginBottom: 20, borderRadius: 10 }} />}

      <Form form={form} onFinish={onFinish} layout="vertical" requiredMark={false} initialValues={{ remember: true }}>
        <Form.Item name="username" label={<span style={{ fontWeight: 600, color: '#001529', fontSize: 13 }}>Tên đăng nhập</span>} rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}>
          <Input prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} placeholder="Nhập tên đăng nhập" size="large" style={inputStyle} />
        </Form.Item>

        <Form.Item 
          name="password" 
          label={<span style={{ fontWeight: 600, color: '#001529', fontSize: 13 }}>Mật khẩu</span>}
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input.Password prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} placeholder="Nhập mật khẩu" size="large" style={inputStyle} iconRender={v => (v ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: 24 }}>
          <Checkbox style={{ color: '#595959', fontSize: 14 }}>Ghi nhớ đăng nhập</Checkbox>
        </Form.Item>

        <Form.Item style={{ marginBottom: 16 }}>
          <Button type="primary" htmlType="submit" size="large" block loading={loading} icon={<ArrowRightOutlined />} style={{ height: 50, borderRadius: 12, fontWeight: 700, fontSize: 15, background: 'linear-gradient(135deg, #0057FF, #003cc5)', border: 'none', boxShadow: '0 6px 20px rgba(0,87,255,0.35)', letterSpacing: 0.5 }}>
            {loading ? 'Đang xác thực...' : 'Đăng nhập'}
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <Button 
            type="link"
            onClick={handleForgotPassword} 
            style={{ padding: 0, height: 'auto', fontSize: 14, color: '#0057FF', fontWeight: 500 }}
          >
            Quên mật khẩu?
          </Button>
        </div>
      </Form>

      <Divider style={{ color: '#d9d9d9', fontSize: 13 }}><span style={{ color: '#bfbfbf', fontWeight: 500 }}>hoặc</span></Divider>

      <div style={{ textAlign: 'center' }}>
        <span style={{ color: '#8c8c8c', fontSize: 14 }}>Chưa có tài khoản? </span>
        <Link to="/register" style={{ color: '#0057FF', fontWeight: 700, fontSize: 14 }}>Đăng ký ngay</Link>
      </div>
    </AuthLayout>
  );
};

const inputStyle = { height: 48, borderRadius: 10, fontSize: 14, border: '1px solid #e8ecf0', background: '#fff' };
export default Login;
