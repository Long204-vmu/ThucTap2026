import React from 'react';
import { Layout } from 'antd';

const { Footer: AntFooter } = Layout;

const FooterComponent = () => {
  return (
    <AntFooter style={{ textAlign: 'center', background: '#001529', color: 'rgba(255,255,255,0.65)', padding: '30px' }}>
      VISHIPEL EMS © 2026 | Hệ Thống Quản Lý Thiết Bị Hàng Hải
    </AntFooter>
  );
};

export default FooterComponent;