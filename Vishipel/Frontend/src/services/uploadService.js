import apiClient from './apiClient';

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await apiClient.post('/api/Upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data.url;
};
