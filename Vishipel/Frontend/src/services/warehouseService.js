import apiClient from './apiClient';

export const getWarehouseStock = (threshold = 10) => apiClient.get('/api/Warehouse/stock', { params: { threshold } });
export const getWarehouseImports = () => apiClient.get('/api/Warehouse/imports');
export const getWarehouseExports = () => apiClient.get('/api/Warehouse/exports');
export const createWarehouseImport = (payload) => apiClient.post('/api/Warehouse/import', payload);
export const createWarehouseExport = (payload) => apiClient.post('/api/Warehouse/export', payload);
export const createWarehouseTransfer = (payload) => apiClient.post('/api/Warehouse/transfer', payload);
export const getWarehouseOptions = () => apiClient.get('/api/Kho');
export const getWarehouseSuppliers = () => apiClient.get('/api/NhaCungCap');
export const getContracts = () => apiClient.get('/api/Contracts');
export const getWarehouseTransfers = () =>
  getWarehouseImports().then(res => ({
    ...res,
    data: (res.data || []).filter(p => p.ghiChu?.startsWith('Điều chuyển từ kho')),
  }));
