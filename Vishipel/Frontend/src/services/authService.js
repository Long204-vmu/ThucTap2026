import apiClient from './apiClient';

export const login = (payload) => apiClient.post('/api/Auth/login', payload);

export const register = (payload) => apiClient.post('/api/Auth/register', payload);
