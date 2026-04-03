import React from 'react';
import { Layout, Row, Col, Space, Divider } from 'antd';
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  CustomerServiceOutlined,
  YoutubeOutlined,
  FacebookOutlined,
} from '@ant-design/icons';

const { Footer: AntFooter } = Layout;

const FooterComponent = () => {
  return (
    <AntFooter style={{ padding: 0, background: 'transparent' }}>
      <div
        style={{
          background: 'linear-gradient(135deg, #0a2a5e 0%, #1a4a8a 50%, #1d5fa8 100%)',
          padding: '40px 48px 0px 48px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative background overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.04) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />

        {/* Logo */}
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            {/* Vishipel-style logo text */}
            <svg width="180" height="42" viewBox="0 0 180 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text
                x="0"
                y="34"
                fontFamily="Georgia, serif"
                fontStyle="italic"
                fontWeight="700"
                fontSize="34"
                fill="white"
                letterSpacing="-1"
              >
                Vishipel
              </text>
              {/* Decorative V underline accent */}
              <line x1="0" y1="40" x2="160" y2="40" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
            </svg>
            <span
              style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                borderLeft: '1px solid rgba(255,255,255,0.3)',
                paddingLeft: 10,
                lineHeight: '1.3',
              }}
            >
              EMS<br />
              <span style={{ fontSize: 9 }}>v2.0</span>
            </span>
          </div>
        </div>

        <Row gutter={[48, 32]}>
          {/* Left Column - Company Info */}
          <Col xs={24} sm={24} md={12} lg={12}>
            <div>
              <p
                style={{
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 13,
                  marginBottom: 10,
                  letterSpacing: 0.3,
                  lineHeight: 1.5,
                  textTransform: 'uppercase',
                }}
              >
                CÔNG TY TNHH MTV THÔNG TIN ĐIỆN TỬ HÀNG HẢI VIỆT NAM (VISHIPEL)
              </p>
              <p
                style={{
                  color: 'rgba(255,255,255,0.75)',
                  fontSize: 13,
                  marginBottom: 18,
                  fontWeight: 500,
                }}
              >
                <span style={{ fontWeight: 700 }}>Cơ quan chủ quản:</span> Bộ Giao thông Vận tải
              </p>

              <Space direction="vertical" size={11} style={{ width: '100%' }}>
                <ContactRow
                  icon={<EnvironmentOutlined />}
                  label="Địa chỉ:"
                  value="Số 02, Nguyễn Thượng Hiền, P. Hồng Bàng, TP. Hải Phòng"
                />
                <ContactRow
                  icon={<PhoneOutlined />}
                  label="Điện thoại:"
                  value="+84 (0225) 374 6464"
                  extra="/ Fax:"
                />
                <ContactRow
                  icon={<CustomerServiceOutlined />}
                  label="Hotline:"
                  value="+84 (0978) 000 247"
                />
                <ContactRow
                  icon={<MailOutlined />}
                  label="Email:"
                  value="truyenthong@vishipel.com.vn"
                  isLink
                />
                <ContactRow
                  icon={<PhoneOutlined />}
                  label="Hỗ trợ sản phẩm:"
                  value="+84 (0225) 777 0041 / Hỗ trợ dịch vụ: +84 (0225) 384 2073"
                />
              </Space>
            </div>
          </Col>

          {/* Right Column - Legal Info + Badges */}
          <Col xs={24} sm={24} md={12} lg={12}>
            <div>
              <p
                style={{
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: 13,
                  lineHeight: 1.7,
                  marginBottom: 20,
                  textAlign: 'justify',
                }}
              >
                Bản quyền thuộc về <strong style={{ color: '#fff' }}>Công ty TNHH MTV Thông tin Điện tử Hàng hải Việt Nam (Vishipel)</strong>
              </p>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, lineHeight: 1.7, marginBottom: 6 }}>
                Người chịu trách nhiệm chính: Ông Phạm Anh Sơn - Phó Tổng Giám đốc Công ty.
              </p>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, lineHeight: 1.7, marginBottom: 24 }}>
                Giấy phép thiết lập Trang thông tin điện tử tổng hợp số 05/GP-TTĐT do Sở Văn hóa, Thể thao và Du lịch Hải Phòng cấp ngày 03/09/2025.
              </p>

              {/* Trust Badges */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                {/* D-U-N-S Badge */}
                <div
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 8,
                    padding: '8px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <span style={{ color: '#f0b429', fontWeight: 800, fontSize: 11, letterSpacing: 1 }}>D·U·N·S</span>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase' }}>Registered™</span>
                </div>

                {/* NCSC Badge */}
                <div
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 8,
                    padding: '8px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ color: '#e53e3e', fontWeight: 800, fontSize: 11 }}>NCSC</span>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9 }}>vn</span>
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 9, letterSpacing: 0.5 }}>TÍN NHIỆM MẠNG</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.15)',
            marginTop: 32,
            padding: '16px 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
            VISHIPEL EMS © 2026 | Hệ Thống Quản Lý Thiết Bị Hàng Hải
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>Theo dõi chúng tôi:</span>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: 18,
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#4267B2')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
            >
              <FacebookOutlined />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: 18,
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#FF0000')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
            >
              <YoutubeOutlined />
            </a>
          </div>
        </div>
      </div>
    </AntFooter>
  );
};

/** Helper sub-component for contact rows */
const ContactRow = ({ icon, label, value, extra, isLink }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
    <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, marginTop: 1, flexShrink: 0 }}>
      {icon}
    </span>
    <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
      <strong style={{ color: '#fff', marginRight: 4 }}>{label}</strong>
      {isLink ? (
        <a href={`mailto:${value}`} style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'underline' }}>
          {value}
        </a>
      ) : (
        value
      )}
      {extra && <span style={{ color: 'rgba(255,255,255,0.5)', marginLeft: 4 }}>{extra}</span>}
    </p>
  </div>
);

export default FooterComponent;
