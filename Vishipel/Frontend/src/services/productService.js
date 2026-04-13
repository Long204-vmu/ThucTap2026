import apiClient from './apiClient';

export const getProducts = () => apiClient.get('/api/Products');

export const getProductById = (id) => apiClient.get(`/api/Products/${id}`);

export const createProduct = (payload) => apiClient.post('/api/Products', payload);

export const updateProduct = (id, payload) => apiClient.put(`/api/Products/${id}`, payload);

export const deleteProduct = (id) => apiClient.delete(`/api/Products/${id}`);
