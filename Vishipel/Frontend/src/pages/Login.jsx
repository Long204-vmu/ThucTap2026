/**
 * Login.jsx — Trang đăng nhập VISHIPEL EMS_NAV
 * ─────────────────────────────────────────────
 * ✅ API-ready: Tìm comment "🔌 API" để kết nối backend
 * ✅ Form validation với Ant Design
 * ✅ Loading state & Error handling
 * ✅ Responsive
 */

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Alert, Divider, Tag } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  SafetyCertificateOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

// ─── MOCK CREDENTIALS (xoá khi có API) ───────────────────────────────────────
const MOCK_USER = { username: 'admin', password: '123456' };
// ─────────────────────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: '🛡️', text: 'Bảo mật đa lớp theo chuẩn ISO 27001' },
  { icon: '⚡', text: 'Truy xuất tức thì qua mã QR thiết bị' },
  { icon: '📊', text: 'Dashboard thống kê thời gian thực' },
  { icon: '🌐', text: 'Tuân thủ SOLAS & IMO quốc tế' },
];

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [mounted, setMounted]   = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);

    try {
      // 🔌 API INTEGRATION — thay khối dưới bằng:
      // const res = await axios.post('/api/auth/login', {
      //   username: values.username,
      //   password: values.password,
      // });
      // const { token, user } = res.data;
      // localStorage.setItem('token', token);
      // navigate('/dashboard');

      await new Promise(r => setTimeout(r, 1200)); // giả lập network

      if (values.username === MOCK_USER.username && values.password === MOCK_USER.password) {
        navigate('/');
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không đúng.');
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ. Vui lòng thử lại.');
      console.error('[Login] error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      fontFamily: '"Be Vietnam Pro", "Segoe UI", sans-serif',
    }}>

      {/* ── Left Panel: Branding ─────────────────────────────── */}
      <div style={{
        flex: '0 0 42%',
        background: 'linear-gradient(160deg, #000d1a 0%, #001f3f 50%, #003380 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px 52px',
        position: 'relative',
        overflow: 'hidden',
      }}
        className="login-left-panel"
      >
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: -120, right: -120,
          width: 400, height: 400, borderRadius: '50%',
          border: '1px solid rgba(0,87,255,0.15)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 250, height: 250, borderRadius: '50%',
          border: '1px solid rgba(0,87,255,0.2)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -100, left: -100,
          width: 350, height: 350, borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.04)',
          pointerEvents: 'none',
        }} />
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,87,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,87,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'all 0.6s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg, #0057FF, #003cc5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, boxShadow: '0 4px 20px rgba(0,87,255,0.4)',
            }}>
              ⚓
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 18, letterSpacing: 1 }}>
                VISHIPEL
              </div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, letterSpacing: 3, fontWeight: 500 }}>
                EMS_NAV SYSTEM
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.7s ease 0.15s',
          zIndex: 1,
        }}>
          <Tag
            style={{
              background: 'rgba(0,87,255,0.2)',
              border: '1px solid rgba(0,87,255,0.4)',
              color: '#5599ff',
              marginBottom: 20,
              fontWeight: 600,
              letterSpacing: 1,
              fontSize: 10,
              textTransform: 'uppercase',
            }}
          >
            Hệ thống quản lý thiết bị hàng hải
          </Tag>

          <h1 style={{
            color: '#fff',
            fontSize: 'clamp(26px, 2.5vw, 38px)',
            fontWeight: 800,
            lineHeight: 1.25,
            margin: '0 0 20px',
          }}>
            Quản lý thiết bị<br />
            <span style={{
              background: 'linear-gradient(90deg, #4d8eff, #0057FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              thông minh & hiệu quả
            </span>
          </h1>

          <p style={{
            color: 'rgba(255,255,255,0.55)',
            fontSize: 15,
            lineHeight: 1.8,
            marginBottom: 36,
          }}>
            Nền tảng số hóa vòng đời thiết bị hàng hải — chuẩn xác, an toàn,
            được phát triển dành riêng cho Vishipel.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {FEATURES.map((f, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateX(0)' : 'translateX(-20px)',
                  transition: `all 0.5s ease ${0.3 + i * 0.1}s`,
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'rgba(0,87,255,0.12)',
                  border: '1px solid rgba(0,87,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, flexShrink: 0,
                }}>
                  {f.icon}
                </div>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div style={{
          color: 'rgba(255,255,255,0.3)',
          fontSize: 12,
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.8s ease 0.5s',
          zIndex: 1,
        }}>
          © 2026 Vishipel Corporation · Bảo lưu mọi quyền
        </div>
      </div>

      {/* ── Right Panel: Form ────────────────────────────────── */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f7f9fc',
        padding: '40px 32px',
      }}>
        <div style={{
          width: '100%',
          maxWidth: 420,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.7s ease 0.2s',
        }}>
          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <h2 style={{
              fontSize: 28,
              fontWeight: 800,
              color: '#001529',
              margin: '0 0 8px',
            }}>
              Đăng nhập hệ thống
            </h2>
            <p style={{ color: '#8c8c8c', fontSize: 15, margin: 0 }}>
              Chào mừng trở lại! Vui lòng nhập thông tin tài khoản.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              onClose={() => setError(null)}
              style={{ marginBottom: 20, borderRadius: 10 }}
            />
          )}

          {/* Form */}
          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
            initialValues={{ remember: true }}
          >
            <Form.Item
              name="username"
              label={<span style={{ fontWeight: 600, color: '#001529', fontSize: 13 }}>Tên đăng nhập</span>}
              rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Nhập tên đăng nhập"
                size="large"
                style={inputStyle}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span style={{ fontWeight: 600, color: '#001529', fontSize: 13 }}>Mật khẩu</span>
                  <Link
                    to="/forgot-password"
                    style={{ fontSize: 13, color: '#0057FF', fontWeight: 500 }}
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
              }
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Nhập mật khẩu"
                size="large"
                style={inputStyle}
                iconRender={v => (v ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: 24 }}>
              <Checkbox style={{ color: '#595959', fontSize: 14 }}>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>

            <Form.Item style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                icon={<ArrowRightOutlined />}
                style={{
                  height: 50,
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 15,
                  background: 'linear-gradient(135deg, #0057FF, #003cc5)',
                  border: 'none',
                  boxShadow: '0 6px 20px rgba(0,87,255,0.35)',
                  letterSpacing: 0.5,
                }}
              >
                {loading ? 'Đang xác thực...' : 'Đăng nhập'}
              </Button>
            </Form.Item>
          </Form>

          <Divider style={{ color: '#d9d9d9', fontSize: 13 }}>
            <span style={{ color: '#bfbfbf', fontWeight: 500 }}>hoặc</span>
          </Divider>

          {/* Register link */}
          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#8c8c8c', fontSize: 14 }}>Chưa có tài khoản? </span>
            <Link to="/register" style={{ color: '#0057FF', fontWeight: 700, fontSize: 14 }}>
              Đăng ký ngay
            </Link>
          </div>

          {/* Demo hint */}
          <div style={{
            marginTop: 28,
            padding: '14px 18px',
            background: 'rgba(0,87,255,0.05)',
            border: '1px dashed rgba(0,87,255,0.25)',
            borderRadius: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <SafetyCertificateOutlined style={{ color: '#0057FF', fontSize: 14 }} />
              <span style={{ color: '#0057FF', fontWeight: 600, fontSize: 12 }}>Tài khoản demo</span>
            </div>
            <code style={{ fontSize: 12, color: '#555' }}>
              Username: <b>admin</b> · Password: <b>123456</b>
            </code>
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap');
        @media (max-width: 768px) {
          .login-left-panel { display: none !important; }
        }
        .ant-input-affix-wrapper:focus,
        .ant-input-affix-wrapper-focused {
          border-color: #0057FF !important;
          box-shadow: 0 0 0 3px rgba(0,87,255,0.1) !important;
        }
        .ant-btn-primary:hover {
          background: linear-gradient(135deg, #1a6dff, #0050e6) !important;
          box-shadow: 0 8px 24px rgba(0,87,255,0.45) !important;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};

const inputStyle = {
  height: 48,
  borderRadius: 10,
  fontSize: 14,
  border: '1px solid #e8ecf0',
  background: '#fff',
};

export default Login;
