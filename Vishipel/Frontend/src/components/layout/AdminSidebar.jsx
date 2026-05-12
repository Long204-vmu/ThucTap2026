import React from 'react';
import { Menu, Layout } from 'antd';
import { 
  UserOutlined, 
  AppstoreOutlined, 
  ShoppingOutlined, 
  DashboardOutlined, 
  ToolOutlined, 
  BarChartOutlined,
  AuditOutlined,
  LockOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: 'system',
      icon: <AuditOutlined />,
      label: 'Quản lý hệ thống',
      children: [
        { key: '/admin/users', icon: <UserOutlined />, label: 'Quản lý tài khoản' },
        { key: '/admin/system', icon: <LockOutlined />, label: 'Phân quyền & Vô hiệu hóa' },
      ]
    },
    {
      key: 'categories',
      icon: <AppstoreOutlined />,
      label: 'Quản lý danh mục',
      children: [
        { key: '/admin/categories', label: 'Danh mục hệ thống' },
      ]
    },
    {
      key: 'warehouse',
      icon: <ShoppingOutlined />,
      label: 'Quản lý kho',
      children: [
        { key: '/admin/warehouse', label: 'Phiếu nhập & xuất kho' },
      ]
    },
    {
      key: 'sales-management',
      icon: <DashboardOutlined />,
      label: 'Quản lý bán hàng',
      children: [
        { key: '/admin/sales', icon: <DashboardOutlined />, label: 'Dashboard kinh doanh' },
        { key: '/admin/quotes', icon: <FileTextOutlined />, label: 'Quản lý báo giá' },
      ]
    },
    {
      key: 'technical',
      icon: <ToolOutlined />,
      label: 'Quản lý kỹ thuật',
      children: [
        { key: '/admin/products', icon: <ToolOutlined />, label: 'Quản lý thiết bị' },
        { key: '/admin/technical', icon: <ToolOutlined />, label: 'Lắp đặt & Bảo hành' },
      ]
    },
    {
      key: 'reports',
      icon: <BarChartOutlined />,
      label: 'Báo cáo thống kê',
      children: [
        { key: '/admin/reports', label: 'Báo cáo hệ thống' },
      ]
    }
  ];

  const onMenuClick = ({ key }) => {
    navigate(key);
  };

  // Find the open key based on current pathname
  const getOpenKeys = () => {
    const item = menuItems.find(m => m.children?.some(c => c.key === location.pathname));
    return item ? [item.key] : [];
  };

  return (
    <Sider
      width={260}
      theme="light"
      style={{
        overflow: 'auto',
        height: 'calc(100vh - 76px)',
        position: 'fixed',
        left: 0,
        top: 76,
        bottom: 0,
        borderRight: '1px solid #f0f0f0',
        zIndex: 900
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        defaultOpenKeys={getOpenKeys()}
        style={{ height: '100%', borderRight: 0, paddingTop: 16 }}
        items={menuItems}
        onClick={onMenuClick}
      />
    </Sider>
  );
};

export default AdminSidebar;
