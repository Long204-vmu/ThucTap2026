import React, { useState } from 'react';
import axios from 'axios';
import { message, Form, Input, Button, Checkbox, Alert, Divider } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone, SafetyCertificateOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/common/AuthLayout';

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
      const res = await axios.post('/api/Auth/login', { username: values.username, password: values.password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      message.success('Đăng nhập thành công!');
      navigate('/');
      window.location.href = '/'; // Reload lại trang để cập nhật trạng thái đăng nhập trên toàn app
    } catch (err) {
      if (err.response && err.response.status === 401) setError('Tên đăng nhập hoặc mật khẩu không chính xác.');
      else setError(err.response?.data?.message || 'Lỗi kết nối máy chủ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Khối giao diện động truyền sang cột trái của Layout
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
      <div style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#001529', margin: '0 0 8px' }}>Đăng nhập hệ thống</h2>
        <p style={{ color: '#8c8c8c', fontSize: 15, margin: 0 }}>Chào mừng trở lại! Vui lòng nhập thông tin tài khoản.</p>
      </div>

      {error && <Alert message={error} type="error" showIcon closable onClose={() => setError(null)} style={{ marginBottom: 20, borderRadius: 10 }} />}

      <Form form={form} onFinish={onFinish} layout="vertical" requiredMark={false} initialValues={{ remember: true }}>
        <Form.Item name="username" label={<span style={{ fontWeight: 600, color: '#001529', fontSize: 13 }}>Tên đăng nhập</span>} rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}>
          <Input prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} placeholder="Nhập tên đăng nhập" size="large" style={inputStyle} />
        </Form.Item>

        <Form.Item name="password" label={<div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><span style={{ fontWeight: 600, color: '#001529', fontSize: 13 }}>Mật khẩu</span><Link to="/forgot-password" style={{ fontSize: 13, color: '#0057FF', fontWeight: 500 }}>Quên mật khẩu?</Link></div>} rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
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