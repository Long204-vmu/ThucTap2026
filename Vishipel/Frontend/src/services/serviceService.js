import apiClient from './apiClient';

export const getServices = () => apiClient.get('/api/Services');

export const getServiceById = (id) => apiClient.get(`/api/Services/${id}`);

export const createService = (payload) => apiClient.post('/api/Services', payload);

export const updateService = (id, payload) => apiClient.put(`/api/Services/${id}`, payload);

export const deleteService = (id) => apiClient.delete(`/api/Services/${id}`);
