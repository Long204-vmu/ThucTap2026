import React, { useState } from 'react';
import { Card, Button, Table, Tag, Space, Typography, message, Alert, Progress } from 'antd';
import { CloudUploadOutlined, CloudDownloadOutlined, HistoryOutlined, RollbackOutlined, DatabaseOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;

const BackupRestore = () => {
  const [loading, setLoading] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);

  const mockHistory = [
    { id: 1, name: 'backup_full_20240510.bak', size: '15.4 MB', type: 'Toàn phần', createdAt: '2024-05-10 08:30:00', status: 'Thành công' },
    { id: 2, name: 'backup_auto_20240509.bak', size: '12.1 MB', type: 'Tự động', createdAt: '2024-05-09 00:00:01', status: 'Thành công' },
    { id: 3, name: 'backup_manual_v1.bak', size: '14.8 MB', type: 'Thủ công', createdAt: '2024-05-08 15:45:00', status: 'Thành công' },
  ];

  const handleStartBackup = () => {
    setLoading(true);
    setBackupProgress(0);
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          message.success('Sao lưu dữ liệu thành công!');
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const columns = [
    { title: 'Tên bản sao lưu', dataIndex: 'name', render: (text) => <Text strong>{text}</Text> },
    { title: 'Kích thước', dataIndex: 'size' },
    { title: 'Loại', dataIndex: 'type', render: (t) => <Tag color="blue">{t}</Tag> },
    { title: 'Thời gian tạo', dataIndex: 'createdAt', render: (date) => moment(date).format('DD/MM/YYYY HH:mm') },
    { title: 'Trạng thái', dataIndex: 'status', render: (s) => <Tag color="success">{s}</Tag> },
    {
      title: 'Hành động',
      render: () => (
        <Space>
          <Button type="link" icon={<CloudDownloadOutlined />}>Tải về</Button>
          <Button type="link" danger icon={<RollbackOutlined />}>Khôi phục</Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '32px 5%', background: '#f5f7fa', minHeight: 'calc(100vh - 76px)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Title level={2}>
          <DatabaseOutlined style={{ marginRight: 12 }} />
          Sao lưu & Khôi phục dữ liệu
        </Title>
        <Paragraph>Hệ thống hỗ trợ sao lưu toàn bộ cơ sở dữ liệu và cấu hình để đảm bảo an toàn thông tin.</Paragraph>

        <Alert
          message="Lưu ý quan trọng"
          description="Việc khôi phục dữ liệu sẽ ghi đè hoàn toàn dữ liệu hiện tại. Vui lòng đảm bảo bạn đã tạo bản sao lưu trước khi thực hiện khôi phục."
          type="warning"
          showIcon
          style={{ marginBottom: 24, borderRadius: 8 }}
        />

        <Card style={{ marginBottom: 24, borderRadius: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title level={4} style={{ margin: 0 }}>Sao lưu tức thời</Title>
              <Text type="secondary">Tạo một bản sao lưu mới ngay lập tức</Text>
            </div>
            <Button 
              type="primary" 
              size="large" 
              icon={<CloudUploadOutlined />} 
              onClick={handleStartBackup}
              loading={loading}
              style={{ height: 48, borderRadius: 8 }}
            >
              Bắt đầu sao lưu
            </Button>
          </div>
          {loading && (
            <div style={{ marginTop: 24 }}>
              <Text>Đang nén dữ liệu... {backupProgress}%</Text>
              <Progress percent={backupProgress} status="active" strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} />
            </div>
          )}
        </Card>

        <Card title={<Space><HistoryOutlined /> Lịch sử sao lưu</Space>} style={{ borderRadius: 12 }}>
          <Table 
            dataSource={mockHistory} 
            columns={columns} 
            rowKey="id" 
            pagination={{ pageSize: 5 }} 
          />
        </Card>
      </div>
    </div>
  );
};

export default BackupRestore;
