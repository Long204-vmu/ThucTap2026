import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

// 1. Cổng Backend mặc định
axios.defaults.baseURL = 'https://localhost:7010'; 

// 2. TRẠM KIỂM SOÁT ĐẦU RA: Tự động dán Token vào mọi thư gửi đi
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 3. TRẠM KIỂM SOÁT ĐẦU VÀO: Bắt lỗi 401 (Hết hạn Token)
axios.interceptors.response.use(
    (response) => response, // Nếu thành công thì cho qua
    (error) => {
        if (error.response && error.response.status === 401) {
            // Nếu Backend báo 401 Unauthorized (Chưa đăng nhập hoặc Token hết hạn)
            console.log("Token hết hạn hoặc không hợp lệ!");
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Đá người dùng về trang login nếu họ đang không ở trang login
            if (window.location.pathname !== '/login') {
                window.location.href = '/login'; 
            }
        }
        return Promise.reject(error);
    }
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);