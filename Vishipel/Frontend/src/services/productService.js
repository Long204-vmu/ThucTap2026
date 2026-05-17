import apiClient from './apiClient';

export const getProducts = () => apiClient.get('/api/ThietBi');

export const getProductById = (id) => apiClient.get(`/api/ThietBi/${id}`);

export const createProduct = (payload) => apiClient.post('/api/ThietBi', payload);

export const updateProduct = (id, payload) => apiClient.put(`/api/ThietBi/${id}`, payload);

export const deleteProduct = (id) => apiClient.delete(`/api/ThietBi/${id}`);
