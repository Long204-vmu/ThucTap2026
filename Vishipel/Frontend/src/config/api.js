export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5078';

export const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');
