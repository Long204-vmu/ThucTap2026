import apiClient from './apiClient';

export const getAllCategories = () => apiClient.get('/api/Categories');

export const getCategoriesByType = (type) => apiClient.get(`/api/Categories?type=${type}`);

export const createCategory = (payload) => apiClient.post('/api/Categories', payload);

export const updateCategory = (id, payload) => apiClient.put(`/api/Categories/${id}`, payload);

export const deleteCategory = (id) => apiClient.delete(`/api/Categories/${id}`);
