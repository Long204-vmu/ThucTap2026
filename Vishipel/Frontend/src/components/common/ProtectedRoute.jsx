import React from 'react';
import { Navigate } from 'react-router-dom';
import { message } from 'antd';

const ProtectedRoute = ({ children, allowedRoles }) => {
  // Lấy thông tin user từ két sắt
  const userStr = localStorage.getItem('user');
  
  // Chưa đăng nhập -> Đuổi về trang login
  if (!userStr) {
    message.warning('Vui lòng đăng nhập để tiếp tục!');
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userStr);
  const userRole = user.role?.toLowerCase();

  if (allowedRoles) {
    const isAllowed = allowedRoles.some(role => role.toLowerCase() === userRole);
    if (!isAllowed) {
      message.error('Bạn không có quyền truy cập khu vực này!');
      return <Navigate to="/" replace />;
    }
  }

  // Đủ quyền -> Cho phép vào trong
  return children;
};

export default ProtectedRoute;