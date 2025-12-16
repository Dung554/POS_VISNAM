import axios from 'axios';

const API_BASE_URL = 'https://localhost:7125/api'; // Thay đổi theo port backend của bạn

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Product APIs
export const productAPI = {
  getAll:  async () => {
    const response = await apiClient.get('/Product');
    return response.data;
  },
};

// Order APIs
export const orderAPI = {
  getAll:  async () => {
    const response = await apiClient.get('/Order');
    return response.data;
  },
  
  getRealtimeOrders: async () => {
    const response = await apiClient.get('/Order/realtime');
    return response.data;
  },
  
  createOrder: async (orderData) => {
    const response = await apiClient.post('/Order', orderData);
    return response.data;
  },
};

export default apiClient;