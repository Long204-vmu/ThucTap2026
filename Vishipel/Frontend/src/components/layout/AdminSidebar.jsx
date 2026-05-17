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
  FileTextOutlined,
  SafetyCertificateOutlined,
  InboxOutlined,
  ImportOutlined,
  ExportOutlined,
  SwapOutlined,
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
        { key: '/admin/backup', icon: <BarChartOutlined />, label: 'Sao lưu & Khôi phục' },
        { key: '/admin/settings', icon: <ToolOutlined />, label: 'Cấu hình Website' },
      ]
    },
    {
      key: 'categories',
      icon: <AppstoreOutlined />,
      label: 'Quản lý danh mục',
      children: [
        { key: '/admin/categories/LoaiThietBi', label: 'Loại thiết bị' },
        { key: '/admin/categories/NhaCungCap', label: 'Nhà cung cấp' },
        { key: '/admin/categories/Kho', label: 'Danh mục kho' },
        { key: '/admin/categories/DonViTinh', label: 'Đơn vị tính' },
        { key: '/admin/categories/LoaiKhachHang', label: 'Loại khách hàng' },
        { key: '/admin/categories/PhuongThucThanhToan', label: 'Phương thức thanh toán' },
        { key: '/admin/categories/LoaiHopDong', label: 'Loại hợp đồng' },
      ]
    },
    {
      key: 'warehouse',
      icon: <ShoppingOutlined />,
      label: 'Quản lý kho',
      children: [
        { key: '/admin/warehouse/stock', icon: <InboxOutlined />, label: 'Tồn kho' },
        { key: '/admin/warehouse/import', icon: <ImportOutlined />, label: 'Phiếu nhập kho' },
        { key: '/admin/warehouse/export', icon: <ExportOutlined />, label: 'Phiếu xuất kho' },
        { key: '/admin/warehouse/transfer', icon: <SwapOutlined />, label: 'Điều chuyển kho' },
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
