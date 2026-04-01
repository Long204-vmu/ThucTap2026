/**
 * Register.jsx — Trang đăng ký VISHIPEL EMS_NAV
 * ──────────────────────────────────────────────
 * ✅ API-ready: Tìm comment "🔌 API" để kết nối backend
 * ✅ Multi-step form (2 bước)
 * ✅ Kiểm tra độ mạnh mật khẩu
 * ✅ Responsive
 */

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Steps, Alert, Progress, Tag } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  CheckCircleFilled,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

const { Option } = Select;

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const DEPARTMENTS = [
  'Phòng Kỹ thuật',
  'Phòng Kế toán',
  'Ban Quản lý',
  'Phòng Nghiệp vụ',
  'Phòng IT',
];

const ROLES = [
  { value: 'technician', label: 'Kỹ thuật viên' },
  { value: 'accountant',  label: 'Kế toán' },
  { value: 'manager',    label: 'Quản lý' },
  { value: 'viewer',     label: 'Xem báo cáo' },
];
// ─────────────────────────────────────────────────────────────────────────────

// ─── Password Strength ────────────────────────────────────────────────────────
function getPasswordStrength(pwd) {
  if (!pwd) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pwd.length >= 8)           score++;
  if (/[A-Z]/.test(pwd))         score++;
  if (/[0-9]/.test(pwd))         score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const map = [
    { score: 0, label: '',          color: '' },
    { score: 1, label: 'Yếu',       color: '#ff4d4f' },
    { score: 2, label: 'Trung bình', color: '#faad14' },
    { score: 3, label: 'Mạnh',      color: '#52c41a' },
    { score: 4, label: 'Rất mạnh',  color: '#0057FF' },
  ];
  return map[score];
}
// ─────────────────────────────────────────────────────────────────────────────

const STEPS = ['Thông tin cá nhân', 'Tài khoản & Vai trò'];

const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [success, setSuccess]         = useState(false);
  const [password, setPassword]       = useState('');
  const [mounted, setMounted]         = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  const pwdStrength = getPasswordStrength(password);

  const goNext = async () => {
    try {
      const fieldsStep0 = ['fullName', 'email', 'phone', 'department'];
      await form.validateFields(fieldsStep0);
      setCurrentStep(1);
    } catch { /* validation will show errors */ }
  };

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    try {
      // 🔌 API INTEGRATION — thay khối dưới bằng:
      // const res = await axios.post('/api/auth/register', {
      //   fullName:   values.fullName,
      //   email:      values.email,
      //   phone:      values.phone,
      //   department: values.department,
      //   role:       values.role,
      //   username:   values.username,
      //   password:   values.password,
      // });
      // if (res.data.success) { setSuccess(true); setTimeout(() => navigate('/login'), 2000); }

      await new Promise(r => setTimeout(r, 1400)); // giả lập network
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError('Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
      console.error('[Register] error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ─── Success Screen ──────────────────────────────────────────────────────
  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f7f9fc',
        fontFamily: '"Be Vietnam Pro", "Segoe UI", sans-serif',
      }}>
        <div style={{ textAlign: 'center', maxWidth: 420, padding: 32 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, #0057FF20, #0057FF10)',
            border: '2px solid #0057FF30',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: 36,
            animation: 'popIn 0.5s ease',
          }}>
            ✅
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#001529', marginBottom: 12 }}>
            Đăng ký thành công!
          </h2>
          <p style={{ color: '#8c8c8c', fontSize: 15, marginBottom: 24 }}>
            Tài khoản của bạn đang chờ xét duyệt từ quản trị viên.
            Bạn sẽ được chuyển về trang đăng nhập...
          </p>
          <div style={{ width: 160, height: 4, background: '#f0f0f0', borderRadius: 4, margin: '0 auto' }}>
            <div style={{
              width: '100%', height: '100%',
              background: '#0057FF', borderRadius: 4,
              animation: 'loadBar 2.5s linear forwards',
            }} />
          </div>
        </div>
        <style>{`
          @keyframes popIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
          @keyframes loadBar { from { width: 0%; } to { width: 100%; } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      fontFamily: '"Be Vietnam Pro", "Segoe UI", sans-serif',
    }}>

      {/* ── Left Panel ─────────────────────────────────────────── */}
      <div style={{
        flex: '0 0 38%',
        background: 'linear-gradient(160deg, #000d1a 0%, #001f3f 60%, #002b6e 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px 48px',
        position: 'relative',
        overflow: 'hidden',
      }}
        className="register-left-panel"
      >
        {/* Decorative elements */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 300, height: 300, borderRadius: '50%',
          border: '1px solid rgba(0,87,255,0.15)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: 60, left: -60,
          width: 220, height: 220, borderRadius: '50%',
          border: '1px solid rgba(0,87,255,0.1)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,87,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,87,255,0.035) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg, #0057FF, #003cc5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, boxShadow: '0 4px 20px rgba(0,87,255,0.4)',
            }}>⚓</div>
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 18, letterSpacing: 1 }}>VISHIPEL</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, letterSpacing: 3 }}>EMS_NAV SYSTEM</div>
            </div>
          </div>
        </div>

        {/* Step progress visual */}
        <div style={{ zIndex: 1 }}>
          <Tag style={{
            background: 'rgba(0,87,255,0.2)',
            border: '1px solid rgba(0,87,255,0.4)',
            color: '#5599ff',
            marginBottom: 20,
            fontWeight: 600,
            fontSize: 10,
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}>
            Tạo tài khoản mới
          </Tag>

          <h1 style={{
            color: '#fff',
            fontSize: 'clamp(22px, 2.2vw, 34px)',
            fontWeight: 800,
            lineHeight: 1.3,
            marginBottom: 32,
          }}>
            Tham gia hệ thống<br />
            <span style={{
              background: 'linear-gradient(90deg, #4d8eff, #0057FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              EMS_NAV
            </span>
          </h1>

          {/* Step indicators */}
          {STEPS.map((s, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              marginBottom: 20,
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateX(0)' : 'translateX(-16px)',
              transition: `all 0.5s ease ${i * 0.12}s`,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                background: currentStep > i
                  ? '#0057FF'
                  : currentStep === i
                    ? 'rgba(0,87,255,0.2)'
                    : 'rgba(255,255,255,0.06)',
                border: currentStep === i
                  ? '2px solid #0057FF'
                  : currentStep > i
                    ? 'none'
                    : '1px solid rgba(255,255,255,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: currentStep > i ? 16 : 13,
                color: currentStep >= i ? '#fff' : 'rgba(255,255,255,0.35)',
                fontWeight: 700,
                transition: 'all 0.4s ease',
                boxShadow: currentStep === i ? '0 0 0 4px rgba(0,87,255,0.15)' : 'none',
              }}>
                {currentStep > i ? <CheckCircleFilled /> : i + 1}
              </div>
              <div>
                <div style={{
                  color: currentStep >= i ? '#fff' : 'rgba(255,255,255,0.35)',
                  fontWeight: 600, fontSize: 14,
                  transition: 'color 0.3s',
                }}>
                  Bước {i + 1}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{s}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, zIndex: 1 }}>
          © 2026 Vishipel Corporation
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
        overflowY: 'auto',
      }}>
        <div style={{
          width: '100%',
          maxWidth: 440,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.7s ease 0.2s',
        }}>
          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              {currentStep > 0 && (
                <Button
                  type="text"
                  icon={<ArrowLeftOutlined />}
                  onClick={() => setCurrentStep(0)}
                  style={{ color: '#0057FF', padding: '0 8px 0 0', height: 'auto', fontWeight: 600 }}
                >
                  Quay lại
                </Button>
              )}
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#001529', margin: '0 0 6px' }}>
              {currentStep === 0 ? 'Thông tin cá nhân' : 'Thiết lập tài khoản'}
            </h2>
            <p style={{ color: '#8c8c8c', fontSize: 14, margin: 0 }}>
              {currentStep === 0
                ? 'Bước 1/2 — Nhập thông tin của bạn để tiếp tục'
                : 'Bước 2/2 — Tạo thông tin đăng nhập và chọn vai trò'}
            </p>
          </div>

          {/* Progress bar */}
          <div style={{
            height: 4, background: '#e8ecf0', borderRadius: 4,
            marginBottom: 32, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: currentStep === 0 ? '50%' : '100%',
              background: 'linear-gradient(90deg, #0057FF, #4d8eff)',
              borderRadius: 4,
              transition: 'width 0.4s ease',
            }} />
          </div>

          {/* Error */}
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

          <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            onFinish={onFinish}
          >
            {/* ── Step 0: Personal Info ─────────────────────── */}
            <div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
              <Form.Item
                name="fullName"
                label={<Label>Họ và tên</Label>}
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input
                  prefix={<IdcardOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="Nguyễn Văn A"
                  size="large"
                  style={inputStyle}
                />
              </Form.Item>

              <Form.Item
                name="email"
                label={<Label>Email công ty</Label>}
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' },
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="ten.ho@vishipel.com.vn"
                  size="large"
                  style={inputStyle}
                />
              </Form.Item>

              <Form.Item
                name="phone"
                label={<Label>Số điện thoại</Label>}
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
              >
                <Input
                  prefix={<PhoneOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="0901 234 567"
                  size="large"
                  style={inputStyle}
                />
              </Form.Item>

              <Form.Item
                name="department"
                label={<Label>Phòng ban</Label>}
                rules={[{ required: true, message: 'Vui lòng chọn phòng ban!' }]}
              >
                <Select
                  placeholder="Chọn phòng ban"
                  size="large"
                  style={{ ...inputStyle, width: '100%' }}
                >
                  {DEPARTMENTS.map(d => <Option key={d} value={d}>{d}</Option>)}
                </Select>
              </Form.Item>

              <Button
                type="primary"
                size="large"
                block
                onClick={goNext}
                icon={<ArrowRightOutlined />}
                style={{
                  height: 50,
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 15,
                  background: 'linear-gradient(135deg, #0057FF, #003cc5)',
                  border: 'none',
                  boxShadow: '0 6px 20px rgba(0,87,255,0.3)',
                  marginTop: 4,
                }}
              >
                Tiếp theo
              </Button>
            </div>

            {/* ── Step 1: Account Setup ──────────────────────── */}
            <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
              <Form.Item
                name="username"
                label={<Label>Tên đăng nhập</Label>}
                rules={[
                  { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                  { min: 4, message: 'Tối thiểu 4 ký tự!' },
                  { pattern: /^[a-z0-9_.]+$/, message: 'Chỉ dùng chữ thường, số, dấu _ hoặc .' },
                ]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="nguyen.vana"
                  size="large"
                  style={inputStyle}
                />
              </Form.Item>

              <Form.Item
                name="role"
                label={<Label>Vai trò</Label>}
                rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
              >
                <Select placeholder="Chọn vai trò của bạn" size="large">
                  {ROLES.map(r => (
                    <Option key={r.value} value={r.value}>{r.label}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="password"
                label={<Label>Mật khẩu</Label>}
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu!' },
                  { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="Tối thiểu 8 ký tự"
                  size="large"
                  style={inputStyle}
                  onChange={e => setPassword(e.target.value)}
                  iconRender={v => (v ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              {/* Password strength */}
              {password && (
                <div style={{ marginTop: -16, marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: '#8c8c8c' }}>Độ mạnh mật khẩu</span>
                    <span style={{ fontSize: 12, color: pwdStrength.color, fontWeight: 600 }}>
                      {pwdStrength.label}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} style={{
                        flex: 1, height: 4, borderRadius: 4,
                        background: i <= pwdStrength.score ? pwdStrength.color : '#e8ecf0',
                        transition: 'background 0.3s ease',
                      }} />
                    ))}
                  </div>
                </div>
              )}

              <Form.Item
                name="confirmPassword"
                label={<Label>Xác nhận mật khẩu</Label>}
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu không khớp!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="Nhập lại mật khẩu"
                  size="large"
                  style={inputStyle}
                  iconRender={v => (v ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <Form.Item style={{ marginTop: 8 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={loading}
                  style={{
                    height: 50,
                    borderRadius: 12,
                    fontWeight: 700,
                    fontSize: 15,
                    background: 'linear-gradient(135deg, #0057FF, #003cc5)',
                    border: 'none',
                    boxShadow: '0 6px 20px rgba(0,87,255,0.3)',
                  }}
                >
                  {loading ? 'Đang xử lý...' : '🚀 Tạo tài khoản'}
                </Button>
              </Form.Item>
            </div>
          </Form>

          {/* Login link */}
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <span style={{ color: '#8c8c8c', fontSize: 14 }}>Đã có tài khoản? </span>
            <Link to="/login" style={{ color: '#0057FF', fontWeight: 700, fontSize: 14 }}>
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap');
        @media (max-width: 768px) {
          .register-left-panel { display: none !important; }
        }
        .ant-input-affix-wrapper:focus,
        .ant-input-affix-wrapper-focused {
          border-color: #0057FF !important;
          box-shadow: 0 0 0 3px rgba(0,87,255,0.1) !important;
        }
        .ant-select-focused .ant-select-selector {
          border-color: #0057FF !important;
          box-shadow: 0 0 0 3px rgba(0,87,255,0.1) !important;
        }
      `}</style>
    </div>
  );
};

const Label = ({ children }) => (
  <span style={{ fontWeight: 600, color: '#001529', fontSize: 13 }}>{children}</span>
);

const inputStyle = {
  height: 48,
  borderRadius: 10,
  fontSize: 14,
  border: '1px solid #e8ecf0',
  background: '#fff',
};

export default Register;
