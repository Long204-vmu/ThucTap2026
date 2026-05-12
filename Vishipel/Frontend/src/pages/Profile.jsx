import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Avatar, Typography, Tag, Row, Col, Button, Divider, Space } from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  SafetyCertificateOutlined, 
  IdcardOutlined, 
  EditOutlined,
  PhoneOutlined,
  DeploymentUnitOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  if (!user) return null;

  const getRoleTag = (role) => {
    const roles = {
      admin: { color: 'red', text: 'Quản trị viên' },
      manager: { color: 'orange', text: 'Quản lý' },
      user: { color: 'blue', text: 'Khách hàng' },
      warehouse: { color: 'green', text: 'Nhân viên kho' },
      accounting: { color: 'purple', text: 'Kế toán' },
      salemanager: { color: 'cyan', text: 'Quản lý bán hàng' }
    };
    const r = roles[role?.toLowerCase()] || { color: 'default', text: role };
    return <Tag color={r.color} style={{ fontWeight: 600, padding: '2px 10px', borderRadius: 4 }}>{r.text?.toUpperCase()}</Tag>;
  };

  return (
    <div style={{ padding: '40px 5%', background: '#f0f2f5', minHeight: 'calc(100vh - 76px)' }}>
      <Row gutter={24} justify="center">
        <Col xs={24} lg={8}>
          <Card 
            bordered={false} 
            style={{ borderRadius: 16, textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
          >
            <Avatar 
              size={120} 
              icon={<UserOutlined />} 
              style={{ backgroundColor: '#0057FF', marginBottom: 16 }} 
            />
            <Title level={3} style={{ marginBottom: 4 }}>{user.fullName || user.username}</Title>
            <div style={{ marginBottom: 16 }}>{getRoleTag(user.role)}</div>
            <Text type="secondary">Thành viên của hệ thống Vishipel</Text>
            
            <Divider />
            
            <div style={{ textAlign: 'left' }}>
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <MailOutlined style={{ color: '#8c8c8c' }} />
                  <Text>{user.email}</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <PhoneOutlined style={{ color: '#8c8c8c' }} />
                  <Text>{user.phone || 'Chưa cập nhật SĐT'}</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <IdcardOutlined style={{ color: '#8c8c8c' }} />
                  <Text>@{user.username}</Text>
                </div>
              </Space>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={14}>
          <Card 
            title={<Title level={4} style={{ margin: 0 }}>Chi tiết tài khoản</Title>}
            bordered={false} 
            style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
            extra={<Button type="primary" icon={<EditOutlined />} ghost>Chỉnh sửa</Button>}
          >
            <Descriptions column={1} bordered size="middle">
              <Descriptions.Item label={<Space><IdcardOutlined /> Họ và Tên</Space>}>
                <Text strong>{user.fullName || 'Chưa cập nhật'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={<Space><UserOutlined /> Tên tài khoản</Space>}>
                <Text strong>{user.username}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={<Space><MailOutlined /> Địa chỉ Email</Space>}>
                <Text strong>{user.email}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={<Space><PhoneOutlined /> Số điện thoại</Space>}>
                <Text strong>{user.phone || 'Chưa cập nhật'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={<Space><DeploymentUnitOutlined /> Phòng ban / Bộ phận</Space>}>
                <Text strong>{user.department || 'Chưa cập nhật'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={<Space><SafetyCertificateOutlined /> Quyền hạn</Space>}>
                {getRoleTag(user.role)}
              </Descriptions.Item>
              <Descriptions.Item label={<Space><CalendarOutlined /> Ngày tham gia</Space>}>
                <Text strong>{moment(user.createdAt).format('DD/MM/YYYY HH:mm')}</Text>
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 32 }}>
              <Title level={5}>Bảo mật tài khoản</Title>
              <Text type="secondary">Bạn nên đổi mật khẩu định kỳ để bảo vệ tài khoản của mình.</Text>
              <div style={{ marginTop: 16 }}>
                <Button type="default">Đổi mật khẩu</Button>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
