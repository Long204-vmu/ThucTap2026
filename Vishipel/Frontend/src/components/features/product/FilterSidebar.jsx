import React from 'react';
import { Input, Menu, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;

// Nhận thêm prop "categories" từ Product.jsx truyền xuống
const FilterSidebar = ({ active, onSelect, search, onSearch, categories = [] }) => {
  
  // Chuyển đổi mảng categories cho phù hợp với format của Ant Design Menu
  const menuItems = categories.map(cat => ({
    key: cat.key,
    label: cat.label
  }));

  return (
    <div style={{ padding: '24px 16px' }}>
      <Title level={5} style={{ marginBottom: 16 }}>Tìm kiếm</Title>
      <Input 
        placeholder="Nhập tên thiết bị..." 
        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
        value={search}
        onChange={e => onSearch(e.target.value)}
        style={{ borderRadius: 8, marginBottom: 32 }}
        size="large"
        allowClear
      />

      <Title level={5} style={{ marginBottom: 16 }}>Danh mục sản phẩm</Title>
      <Menu 
        mode="inline" 
        selectedKeys={[active]} 
        onClick={({ key }) => onSelect(key)}
        items={menuItems}
        style={{ borderRight: 'none', background: 'transparent', fontWeight: 500 }}
      />
    </div>
  );
};

export default FilterSidebar;