import axios from 'axios';
import { User } from '../types';

const baseUrl = import.meta.env.VITE_API_URL_DEV + '/users';

const getHeaders = () => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  return { Authorization: `Bearer ${user?.token}` };
};

export const UserService = {
  getUsers: async (): Promise<{ data: User[]; success: boolean; total: number }> => {
    try {
      const response = await axios.get(baseUrl, { headers: getHeaders() });
      return {
        data: response.data,
        success: true,
        total: response.data.length,
      };
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  },

  updateUser: async (id: number, values: Partial<User>) => {
    const response = await axios.patch(`${baseUrl}/${id}`, values, {
      headers: getHeaders(),
    });
    return response.data;
  },

  notifyAllExistingUsers: async () => {
    const response = await axios.post(
      `${baseUrl}/notify-all-existing`,
      {},
      { headers: getHeaders() }
    );
    return response.data;
  },
};
