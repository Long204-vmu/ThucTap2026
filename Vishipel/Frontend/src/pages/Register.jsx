import React, { useState } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, IdcardOutlined, EyeInvisibleOutlined, EyeTwoTone, CheckCircleFilled, ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/common/AuthLayout';
import { register } from '../services/authService';

function getPasswordStrength(pwd) {
  if (!pwd) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const map = [
    { score: 0, label: '', color: '' },
    { score: 1, label: 'Yếu', color: '#ff4d4f' },
    { score: 2, label: 'Trung bình', color: '#faad14' },
    { score: 3, label: 'Mạnh', color: '#52c41a' },
    { score: 4, label: 'Rất mạnh', color: '#0057FF' },
  ];
  return map[score];
}

const STEPS = ['Thông tin cá nhân', 'Thiết lập tài khoản'];

const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState('');

  const pwdStrength = getPasswordStrength(password);

  const goNext = async () => {
    try {
      await form.validateFields(['fullName', 'email', 'phone']);
      setCurrentStep(1);
    } catch { /* Form sẽ tự báo lỗi */ }
  };

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    try {
      await register({
        hoTen: values.fullName, email: values.email, soDienThoai: values.phone,
        tenDangNhap: values.username, password: values.password,
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      if (err.response && err.response.data) setError(err.response.data.message || 'Tên đăng nhập hoặc Email đã tồn tại.');
      else setError('Đăng ký thất bại. Vui lòng kiểm tra lại kết nối.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f9fc', fontFamily: '"Be Vietnam Pro", sans-serif' }}>
        <div style={{ textAlign: 'center', maxWidth: 420, padding: 32 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #0057FF20, #0057FF10)', border: '2px solid #0057FF30', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 36, animation: 'popIn 0.5s ease' }}>✅</div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#001529', marginBottom: 12 }}>Đăng ký thành công!</h2>
          <p style={{ color: '#8c8c8c', fontSize: 15, marginBottom: 24 }}>Tài khoản của bạn đang chờ xét duyệt từ quản trị viên. Bạn sẽ được chuyển về trang đăng nhập...</p>
          <div style={{ width: 160, height: 4, background: '#f0f0f0', borderRadius: 4, margin: '0 auto' }}><div style={{ width: '100%', height: '100%', background: '#0057FF', borderRadius: 4, animation: 'loadBar 2.5s linear forwards' }} /></div>
        </div>
        <style>{`@keyframes popIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } } @keyframes loadBar { from { width: 0%; } to { width: 100%; } }`}</style>
      </div>
    );
  }

  // Khối Steps truyền sang bên Layout
  const renderSteps = (mounted) => (
    <>
      {STEPS.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, opacity: mounted ? 1 : 0, transform: mounted ? 'translateX(0)' : 'translateX(-16px)', transition: `all 0.5s ease ${i * 0.12}s` }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: currentStep > i ? '#0057FF' : currentStep === i ? 'rgba(0,87,255,0.2)' : 'rgba(255,255,255,0.06)', border: currentStep === i ? '2px solid #0057FF' : currentStep > i ? 'none' : '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: currentStep > i ? 16 : 13, color: currentStep >= i ? '#fff' : 'rgba(255,255,255,0.35)', fontWeight: 700, transition: 'all 0.4s ease', boxShadow: currentStep === i ? '0 0 0 4px rgba(0,87,255,0.15)' : 'none' }}>
            {currentStep > i ? <CheckCircleFilled /> : i + 1}
          </div>
          <div>
            <div style={{ color: currentStep >= i ? '#fff' : 'rgba(255,255,255,0.35)', fontWeight: 600, fontSize: 14, transition: 'color 0.3s' }}>Bước {i + 1}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{s}</div>
          </div>
        </div>
      ))}
    </>
  );

  return (
    <AuthLayout
      leftTag="Tạo tài khoản mới"
      leftTitle={<>Tham gia hệ thống<br /><span style={{ background: 'linear-gradient(90deg, #4d8eff, #0057FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>EMS_NAV</span></>}
      leftExtra={renderSteps}
    >
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          {currentStep > 0 && <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => setCurrentStep(0)} style={{ color: '#0057FF', padding: '0 8px 0 0', height: 'auto', fontWeight: 600 }}>Quay lại</Button>}
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: '#001529', margin: '0 0 6px' }}>{currentStep === 0 ? 'Thông tin cá nhân' : 'Thiết lập tài khoản'}</h2>
        <p style={{ color: '#8c8c8c', fontSize: 14, margin: 0 }}>{currentStep === 0 ? 'Bước 1/2 — Nhập thông tin của bạn để tiếp tục' : 'Bước 2/2 — Tạo thông tin đăng nhập cho tài khoản'}</p>
      </div>

      <div style={{ height: 4, background: '#e8ecf0', borderRadius: 4, marginBottom: 32, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: currentStep === 0 ? '50%' : '100%', background: 'linear-gradient(90deg, #0057FF, #4d8eff)', borderRadius: 4, transition: 'width 0.4s ease' }} />
      </div>

      {error && <Alert title={error} type="error" showIcon closable onClose={() => setError(null)} style={{ marginBottom: 20, borderRadius: 10 }} />}

      <Form form={form} layout="vertical" requiredMark={false} onFinish={onFinish}>
        <div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
          <Form.Item name="fullName" label={<Label>Họ và tên</Label>} rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}><Input prefix={<IdcardOutlined style={{ color: '#bfbfbf' }} />} placeholder="Nguyễn Văn A" size="large" style={inputStyle} /></Form.Item>
          <Form.Item name="email" label={<Label>Email</Label>} rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}><Input prefix={<MailOutlined style={{ color: '#bfbfbf' }} />} placeholder="ten.ho@vishipel.com.vn" size="large" style={inputStyle} /></Form.Item>
          <Form.Item name="phone" label={<Label>Số điện thoại</Label>} rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}><Input prefix={<PhoneOutlined style={{ color: '#bfbfbf' }} />} placeholder="0901 234 567" size="large" style={inputStyle} /></Form.Item>
          <Button type="primary" size="large" block onClick={goNext} icon={<ArrowRightOutlined />} style={{ height: 50, borderRadius: 12, fontWeight: 700, fontSize: 15, background: 'linear-gradient(135deg, #0057FF, #003cc5)', border: 'none', boxShadow: '0 6px 20px rgba(0,87,255,0.3)', marginTop: 4 }}>Tiếp theo</Button>
        </div>

        <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
          <Form.Item name="username" label={<Label>Tên đăng nhập</Label>} rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }, { min: 4, message: 'Tối thiểu 4 ký tự!' }, { pattern: /^[a-z0-9_.]+$/, message: 'Chỉ dùng chữ thường, số, dấu _ hoặc .' }]}><Input prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} placeholder="nguyen.vana" size="large" style={inputStyle} /></Form.Item>
          <Form.Item name="password" label={<Label>Mật khẩu</Label>} rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }, { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' }]}><Input.Password prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} placeholder="Tối thiểu 8 ký tự" size="large" style={inputStyle} onChange={e => setPassword(e.target.value)} iconRender={v => (v ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} /></Form.Item>

          {password && (
            <div style={{ marginTop: -16, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span style={{ fontSize: 12, color: '#8c8c8c' }}>Độ mạnh mật khẩu</span><span style={{ fontSize: 12, color: pwdStrength.color, fontWeight: 600 }}>{pwdStrength.label}</span></div>
              <div style={{ display: 'flex', gap: 4 }}>{[1, 2, 3, 4].map(i => (<div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i <= pwdStrength.score ? pwdStrength.color : '#e8ecf0', transition: 'background 0.3s ease' }} />))}</div>
            </div>
          )}

          <Form.Item name="confirmPassword" label={<Label>Xác nhận mật khẩu</Label>} dependencies={['password']} rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu!' }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('password') === value) return Promise.resolve(); return Promise.reject(new Error('Mật khẩu không khớp!')); } })]}><Input.Password prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} placeholder="Nhập lại mật khẩu" size="large" style={inputStyle} iconRender={v => (v ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} /></Form.Item>
          <Form.Item style={{ marginTop: 8 }}><Button type="primary" htmlType="submit" size="large" block loading={loading} style={{ height: 50, borderRadius: 12, fontWeight: 700, fontSize: 15, background: 'linear-gradient(135deg, #0057FF, #003cc5)', border: 'none', boxShadow: '0 6px 20px rgba(0,87,255,0.3)' }}>{loading ? 'Đang xử lý...' : '🚀 Tạo tài khoản'}</Button></Form.Item>
        </div>
      </Form>

      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <span style={{ color: '#8c8c8c', fontSize: 14 }}>Đã có tài khoản? </span><Link to="/login" style={{ color: '#0057FF', fontWeight: 700, fontSize: 14 }}>Đăng nhập</Link>
      </div>
    </AuthLayout>
  );
};

const Label = ({ children }) => <span style={{ fontWeight: 600, color: '#001529', fontSize: 13 }}>{children}</span>;
const inputStyle = { height: 48, borderRadius: 10, fontSize: 14, border: '1px solid #e8ecf0', background: '#fff' };
export default Register;