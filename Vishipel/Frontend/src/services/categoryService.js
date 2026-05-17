import apiClient from './apiClient';

export const getAllCategories = (type = 'LoaiThietBi') => apiClient.get(`/api/${type}`);

export const getCategoriesByType = (type) => apiClient.get(`/api/${type}`);

export const createCategory = (type, payload) => apiClient.post(`/api/${type}`, payload);

export const updateCategory = (type, id, payload) => apiClient.put(`/api/${type}/${id}`, payload);

export const deleteCategory = (type, id) => apiClient.delete(`/api/${type}/${id}`);
