import React from 'react';
import { Input } from 'antd';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';

const CATEGORIES = [
  { key: 'all',    label: 'Tất cả sản phẩm', color: 'default' },
  { key: 'radar',  label: 'Máy Radar',        color: 'blue'    },
  { key: 'ais',    label: 'Thiết bị AIS',     color: 'cyan'    },
  { key: 'sensor', label: 'Cảm biến & Đo sâu',color: 'green'   },
  { key: 'spare',  label: 'Phụ kiện',         color: 'orange'  },
];

const FilterSidebar = ({ active, onSelect, search, onSearch }) => {
  return (
    <div style={{ padding: '24px 20px' }}>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <FilterOutlined style={{ color: '#1677ff' }} />
        Bộ lọc
      </div>
      
      <Input
        placeholder="Tìm thiết bị..."
        prefix={<SearchOutlined style={{ color: '#bbb' }} />}
        value={search}
        onChange={e => onSearch(e.target.value)}
        allowClear
        style={{ marginBottom: 20, borderRadius: 8 }}
      />
      
      <div style={{ fontWeight: 600, fontSize: 12, color: '#8c8c8c', letterSpacing: 1, marginBottom: 10, textTransform: 'uppercase' }}>
        Danh mục
      </div>
      
      {CATEGORIES.map(cat => (
        <div
          key={cat.key}
          onClick={() => onSelect(cat.key)}
          style={{
            padding: '10px 14px', borderRadius: 8, cursor: 'pointer', marginBottom: 4,
            background: active === cat.key ? '#e6f4ff' : 'transparent',
            color: active === cat.key ? '#1677ff' : '#333',
            fontWeight: active === cat.key ? 600 : 400,
            fontSize: 14, transition: 'all 0.2s',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}
        >
          {cat.label}
          {active === cat.key && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1677ff' }} />}
        </div>
      ))}
    </div>
  );
};

export default FilterSidebar;