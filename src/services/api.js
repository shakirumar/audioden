import axios from 'axios';

// Node.js API client instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.audioden.com/v1',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor to attach JWT auth token
apiClient.interceptors.request.use(
  (config) => {
    try {
      const auth = localStorage.getItem('audio_den_auth');
      if (auth) {
        const parsed = JSON.parse(auth);
        if (parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      }
    } catch (e) {
      console.warn('Could not read auth token', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API call failed:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const ProductService = {
  getAll: (params) => apiClient.get('/products', { params }).catch(() => null),
  getById: (id) => apiClient.get(`/products/${id}`).catch(() => null),
  create: (data) => apiClient.post('/products', data).catch(() => null),
  update: (id, data) => apiClient.put(`/products/${id}`, data).catch(() => null),
  delete: (id) => apiClient.delete(`/products/${id}`).catch(() => null)
};

export const OrderService = {
  create: (order) => apiClient.post('/orders', order).catch(() => null),
  getAll: () => apiClient.get('/orders').catch(() => null),
  updateStatus: (id, status) => apiClient.patch(`/orders/${id}/status`, { status }).catch(() => null)
};

export const PaymentService = {
  createRazorpayOrder: async (amount) => {
    // Simulates Razorpay order creation for ₹amount
    return {
      id: 'rzp_order_' + Math.random().toString(36).substring(2, 9),
      currency: 'INR',
      amount: amount * 100
    };
  }
};

export default apiClient;
