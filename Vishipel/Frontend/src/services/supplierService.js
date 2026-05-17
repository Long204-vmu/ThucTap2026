import apiClient from './apiClient';

export const getAllSuppliers = () => apiClient.get('/api/NhaCungCap');

export const getSupplierById = (id) => apiClient.get(`/api/NhaCungCap/${id}`);

export const createSupplier = (payload) => apiClient.post('/api/NhaCungCap', payload);

export const updateSupplier = (id, payload) => apiClient.put(`/api/NhaCungCap/${id}`, payload);

export const deleteSupplier = (id) => apiClient.delete(`/api/NhaCungCap/${id}`);
