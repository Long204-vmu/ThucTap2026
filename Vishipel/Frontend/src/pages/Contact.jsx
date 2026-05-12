/**
 * Contact.jsx — Trang liên hệ VISHIPEL EMS_NAV
 * ─────────────────────────────────────────────
 * ✅ API-ready: Tìm comment "🔌 API" để kết nối backend
 * ✅ Form validation đầy đủ (Ant Design Form)
 * ✅ Loading state khi submit
 * ✅ Success / Error feedback
 * ✅ Responsive
 */

import React, { useState } from 'react';
import {
  Layout, Row, Col, Form, Input, Select, Button,
  Tag, Alert, Card, Divider,
} from 'antd';
import {
  PhoneOutlined, MailOutlined, EnvironmentOutlined,
  GlobalOutlined, PrinterOutlined,
  SendOutlined, CheckCircleOutlined,
  CustomerServiceOutlined, WarningOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';

const { Content } = Layout;
const { TextArea } = Input;
const { Option } = Select;

// ─── THÔNG TIN CÔNG TY ────────────────────────────────────────────────────────
const COMPANY_INFO = [
  {
    icon: <EnvironmentOutlined />,
    label: 'Địa chỉ',
    value: 'Số 02, Nguyễn Thượng Hiền, P. Hồng Bàng, TP. Hải Phòng',
    href: 'https://maps.google.com/?q=2+Nguyễn+Thượng+Hiền+Hải+Phòng',
    color: '#0057FF',
    bg: '#e6f0ff',
  },
  {
    icon: <PhoneOutlined />,
    label: 'Điện thoại',
    value: '+84 (0225) 374 6464',
    href: 'tel:+842253746464',
    color: '#00b96b',
    bg: '#e6fff5',
  },
  {
    icon: <PrinterOutlined />,
    label: 'Fax',
    value: '0978 000 247',
    href: null,
    color: '#f59e0b',
    bg: '#fff8e6',
  },
  {
    icon: <MailOutlined />,
    label: 'Email',
    value: 'truyenthong@vishipel.com.vn',
    href: 'mailto:truyenthong@vishipel.com.vn',
    color: '#7c3aed',
    bg: '#f3f0ff',
  },
  {
    icon: <GlobalOutlined />,
    label: 'Website',
    value: 'vishipel.com',
    href: 'https://vishipel.com',
    color: '#0891b2',
    bg: '#e0f7fa',
  },
];

const REQUEST_TYPES = [
  { value: 'consulting',  label: 'Tư vấn sản phẩm',     icon: <QuestionCircleOutlined />,  color: 'blue'   },
  { value: 'support',     label: 'Hỗ trợ kỹ thuật',      icon: <CustomerServiceOutlined />, color: 'green'  },
  { value: 'complaint',   label: 'Khiếu nại / Phản ánh', icon: <WarningOutlined />,         color: 'orange' },
  { value: 'other',       label: 'Yêu cầu khác',          icon: <SendOutlined />,            color: 'default'},
];
// ──────────────────────────────────────────────────────────────────────────────

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

const InfoCard = ({ item }) => {
  const Inner = (
    <div
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 14,
        padding: '16px 20px',
        borderRadius: 12,
        border: '1px solid #f0f0f0',
        background: '#fff',
        transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
        cursor: item.href ? 'pointer' : 'default',
      }}
      onMouseEnter={e => {
        if (item.href) {
          e.currentTarget.style.boxShadow = `0 6px 24px ${item.color}22`;
          e.currentTarget.style.borderColor = item.color + '55';
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = '#f0f0f0';
      }}
    >
      <div
        style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: item.bg, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: 18, color: item.color,
        }}
      >
        {item.icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12, color: '#999', fontWeight: 600, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {item.label}
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: item.href ? item.color : '#001529', wordBreak: 'break-word', lineHeight: 1.5 }}>
          {item.value}
        </div>
      </div>
    </div>
  );

  return item.href ? (
    <a href={item.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
      {Inner}
    </a>
  ) : Inner;
};

const SuccessState = ({ onReset }) => (
  <div style={{ textAlign: 'center', padding: '48px 24px' }}>
    <div
      style={{
        width: 72, height: 72, borderRadius: '50%',
        background: '#e6fff5', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px', fontSize: 32, color: '#00b96b',
      }}
    >
      <CheckCircleOutlined />
    </div>
    <h3 style={{ fontSize: 22, fontWeight: 700, color: '#001529', margin: '0 0 10px' }}>
      Gửi thành công!
    </h3>
    <p style={{ color: '#666', fontSize: 15, lineHeight: 1.7, maxWidth: 360, margin: '0 auto 28px' }}>
      Chúng tôi đã nhận được yêu cầu của bạn và sẽ phản hồi trong vòng <strong>1–2 ngày làm việc</strong>.
    </p>
    <Button
      type="primary"
      onClick={onReset}
      style={{ borderRadius: 10, height: 44, padding: '0 28px', fontWeight: 600 }}
    >
      Gửi yêu cầu khác
    </Button>
  </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const ContactPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]         = useState(null);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setError(null);

      // 🔌 API INTEGRATION — thay khối dưới bằng:
      // await axios.post('/api/contact', {
      //   fullName:    values.fullName,
      //   phone:       values.phone,
      //   email:       values.email,
      //   company:     values.company,
      //   requestType: values.requestType,
      //   subject:     values.subject,
      //   message:     values.message,
      // });

      await new Promise(r => setTimeout(r, 1200)); // giả lập network delay
      console.log('[Contact] Form submitted:', values);

      setSubmitted(true);
      form.resetFields();
    } catch (err) {
      setError('Gửi thất bại. Vui lòng thử lại hoặc liên hệ trực tiếp qua email.');
      console.error('[Contact] submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Content style={{ marginTop: 68, background: '#fff', minHeight: '100vh' }}>

      {/* ── 1. Hero ──────────────────────────────────────────────── */}
      <div
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0,10,30,0.92) 50%, rgba(0,10,30,0.45) 100%), url("https://images.pexels.com/photos/1012613/pexels-photo-1012613.jpeg?auto=compress&cs=tinysrgb&w=1600&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '80px 8%',
        }}
      >
        <Tag
          color="blue"
          style={{ marginBottom: 14, fontWeight: 600, letterSpacing: '1px', fontSize: 11, textTransform: 'uppercase' }}
        >
          Liên hệ
        </Tag>
        <h1
          style={{
            color: '#fff',
            fontSize: 'clamp(26px, 4vw, 48px)',
            fontWeight: 800,
            lineHeight: 1.2,
            margin: '0 0 14px',
            maxWidth: 540,
          }}
        >
          Chúng tôi luôn sẵn sàng lắng nghe
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, maxWidth: 500, lineHeight: 1.8 }}>
          Gửi yêu cầu tư vấn, hỗ trợ kỹ thuật hoặc phản ánh — đội ngũ Vishipel
          sẽ phản hồi trong vòng 1–2 ngày làm việc.
        </p>
      </div>

      <div style={{ padding: '64px 8%', maxWidth: 1280, margin: '0 auto' }}>
        <Row gutter={[48, 48]}>

          {/* ── 2. Contact Form ─────────────────────────────────── */}
          <Col xs={24} lg={14}>
            <div style={{ marginBottom: 32 }}>
              <Tag color="blue" style={{ marginBottom: 10, fontWeight: 600, letterSpacing: 1, fontSize: 11 }}>
                GỬI YÊU CẦU
              </Tag>
              <h2 style={{ fontSize: 26, fontWeight: 700, color: '#001529', margin: 0 }}>
                Điền thông tin của bạn
              </h2>
            </div>

            {error && (
              <Alert
                title={error}
                type="error"
                showIcon
                closable
                onClose={() => setError(null)}
                style={{ marginBottom: 24, borderRadius: 10 }}
              />
            )}

            <Card
              style={{ borderRadius: 16, border: '1px solid #f0f0f0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
              styles={{ body: { padding: submitted ? 0 : '32px 28px' } }}
            >
              {submitted ? (
                <SuccessState onReset={() => setSubmitted(false)} />
              ) : (
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  requiredMark={false}
                  style={{ gap: 0 }}
                >
                  {/* Họ tên + SĐT */}
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label={<span style={{ fontWeight: 600, fontSize: 14 }}>Họ và tên <span style={{ color: '#ff4d4f' }}>*</span></span>}
                        name="fullName"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                      >
                        <Input
                          placeholder="Nguyễn Văn A"
                          size="large"
                          style={{ borderRadius: 10 }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label={<span style={{ fontWeight: 600, fontSize: 14 }}>Số điện thoại <span style={{ color: '#ff4d4f' }}>*</span></span>}
                        name="phone"
                        rules={[
                          { required: true, message: 'Vui lòng nhập số điện thoại' },
                          { pattern: /^[0-9+\s()-]{9,15}$/, message: 'Số điện thoại không hợp lệ' },
                        ]}
                      >
                        <Input
                          placeholder="0912 345 678"
                          size="large"
                          style={{ borderRadius: 10 }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* Email + Công ty */}
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label={<span style={{ fontWeight: 600, fontSize: 14 }}>Email <span style={{ color: '#ff4d4f' }}>*</span></span>}
                        name="email"
                        rules={[
                          { required: true, message: 'Vui lòng nhập email' },
                          { type: 'email', message: 'Email không hợp lệ' },
                        ]}
                      >
                        <Input
                          placeholder="example@company.com"
                          size="large"
                          style={{ borderRadius: 10 }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label={<span style={{ fontWeight: 600, fontSize: 14 }}>Tên công ty / Tàu</span>}
                        name="company"
                      >
                        <Input
                          placeholder="Tên đơn vị (không bắt buộc)"
                          size="large"
                          style={{ borderRadius: 10 }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* Loại yêu cầu */}
                  <Form.Item
                    label={<span style={{ fontWeight: 600, fontSize: 14 }}>Loại yêu cầu <span style={{ color: '#ff4d4f' }}>*</span></span>}
                    name="requestType"
                    rules={[{ required: true, message: 'Vui lòng chọn loại yêu cầu' }]}
                  >
                    <Select
                      placeholder="Chọn loại yêu cầu..."
                      size="large"
                      style={{ borderRadius: 10 }}
                    >
                      {REQUEST_TYPES.map(t => (
                        <Option key={t.value} value={t.value}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {t.icon} {t.label}
                          </span>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  {/* Tiêu đề */}
                  <Form.Item
                    label={<span style={{ fontWeight: 600, fontSize: 14 }}>Tiêu đề <span style={{ color: '#ff4d4f' }}>*</span></span>}
                    name="subject"
                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }, { min: 5, message: 'Tối thiểu 5 ký tự' }]}
                  >
                    <Input
                      placeholder="Tóm tắt ngắn gọn yêu cầu của bạn"
                      size="large"
                      style={{ borderRadius: 10 }}
                    />
                  </Form.Item>

                  {/* Nội dung */}
                  <Form.Item
                    label={<span style={{ fontWeight: 600, fontSize: 14 }}>Nội dung chi tiết <span style={{ color: '#ff4d4f' }}>*</span></span>}
                    name="message"
                    rules={[{ required: true, message: 'Vui lòng nhập nội dung' }, { min: 20, message: 'Tối thiểu 20 ký tự' }]}
                  >
                    <TextArea
                      rows={5}
                      placeholder="Mô tả chi tiết yêu cầu, vấn đề hoặc thông tin sản phẩm bạn cần tư vấn..."
                      showCount
                      maxLength={1000}
                      style={{ borderRadius: 10, resize: 'none' }}
                    />
                  </Form.Item>

                  <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      loading={loading}
                      icon={<SendOutlined />}
                      block
                      style={{
                        height: 50, borderRadius: 12,
                        fontWeight: 700, fontSize: 15,
                        background: '#0057FF',
                        boxShadow: '0 4px 16px rgba(0,87,255,0.25)',
                      }}
                    >
                      {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                    </Button>
                  </Form.Item>
                </Form>
              )}
            </Card>
          </Col>

          {/* ── 3. Company Info ──────────────────────────────────── */}
          <Col xs={24} lg={10}>
            <div style={{ marginBottom: 32 }}>
              <Tag color="blue" style={{ marginBottom: 10, fontWeight: 600, letterSpacing: 1, fontSize: 11 }}>
                THÔNG TIN LIÊN HỆ
              </Tag>
              <h2 style={{ fontSize: 26, fontWeight: 700, color: '#001529', margin: '0 0 8px' }}>
                Vishipel
              </h2>
              <p style={{ color: '#666', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                Công ty TNHH MTV Thông tin Điện tử Hàng hải Việt Nam
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              {COMPANY_INFO.map((item, i) => (
                <InfoCard key={i} item={item} />
              ))}
            </div>

            <Divider style={{ margin: '24px 0' }} />

            {/* Giờ làm việc */}
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#001529', marginBottom: 14 }}>
                Giờ làm việc
              </div>
              {[
                { day: 'Thứ 2 – Thứ 6', time: '07:30 – 17:00', active: true },
                { day: 'Thứ 7',          time: '07:30 – 11:30', active: true },
                { day: 'Chủ nhật',       time: 'Nghỉ',          active: false },
              ].map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '10px 14px', borderRadius: 10,
                    background: i % 2 === 0 ? '#f8faff' : 'transparent',
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontSize: 14, color: '#444', fontWeight: 500 }}>{row.day}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: row.active ? '#0057FF' : '#bbb' }}>
                    {row.time}
                  </span>
                </div>
              ))}
            </div>

            <Divider style={{ margin: '24px 0' }} />

            {/* Loại yêu cầu hỗ trợ */}
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#001529', marginBottom: 14 }}>
                Các kênh hỗ trợ
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {REQUEST_TYPES.map(t => (
                  <div
                    key={t.value}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '8px 14px', borderRadius: 20,
                      background: '#f0f4ff', color: '#0057FF',
                      fontSize: 13, fontWeight: 500,
                      border: '1px solid #d0e0ff',
                    }}
                  >
                    {t.icon} {t.label}
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>

        {/* ── 4. Google Map embed ──────────────────────────────── */}
        <Divider style={{ margin: '64px 0 40px' }} />
        <div style={{ marginBottom: 28 }}>
          <Tag color="blue" style={{ marginBottom: 10, fontWeight: 600, letterSpacing: 1, fontSize: 11 }}>
            BẢN ĐỒ
          </Tag>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#001529', margin: 0 }}>
            Tìm chúng tôi trên bản đồ
          </h2>
        </div>
        <div
          style={{
            borderRadius: 16, overflow: 'hidden',
            border: '1px solid #e8ecf0',
            boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
            height: 380,
          }}
        >
          <iframe
            title="Vishipel Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.4!2d106.6830!3d20.8567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314a7a0e56b4ed47%3A0x0!2s2+Nguy%E1%BB%85n+Th%C6%B0%E1%BB%A3ng+Hi%E1%BB%81n%2C+H%E1%BB%93ng+B%C3%A0ng%2C+H%E1%BA%A3i+Ph%C3%B2ng!5e0!3m2!1svi!2svn!4v1"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </Content>
  );
};

export default ContactPage;
