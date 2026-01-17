import axios from 'axios';
import { Penalty } from '../data';

const baseUrl = import.meta.env.VITE_API_URL_DEV + '/penalties';

const getHeaders = () => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  return { Authorization: `Bearer ${user?.token}` };
};

export const PenaltyService = {
  createPenalty: async (data: { userIdNumber: string; amount: number; reason: string }) => {
    const response = await axios.post(baseUrl, data, { headers: getHeaders() });
    return response.data;
  },

  getAllPenalties: async () => {
    const response = await axios.get(baseUrl, { headers: getHeaders() });
    return response.data;
  },

  markPenaltyPaid: async (id: string) => {
    const response = await axios.patch(`${baseUrl}/${id}/pay`, {}, { headers: getHeaders() });
    return response.data;
  },

  deletePenalty: async (id: string) => {
    const response = await axios.delete(`${baseUrl}/${id}`, { headers: getHeaders() });
    return response.data;
  },

  getMyPenalties: async () => {
    const response = await axios.get(`${baseUrl}/me`, { headers: getHeaders() });
    return response.data;
  }
};
