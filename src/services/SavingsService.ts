import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL_DEV;

export const SavingsService = {
  importSavings: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const token = user?.token;

    const response = await axios.post(`${API_URL}/admin/import/savings`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },
};
