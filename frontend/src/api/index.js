import axios from 'axios';
const API = axios.create({ 
  baseURL: 'https://sla-monitor-backend.onrender.com/api' 
});

API.interceptors.request.use((config) => {
  const stored = localStorage.getItem('sla_user');
  if (stored) {
    const user = JSON.parse(stored);
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const loginUser    = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);
export const getMe        = ()     => API.get('/auth/me');

export const getTickets   = ()         => API.get('/tickets');
export const createTicket = (data)     => API.post('/tickets', data);
export const updateTicket = (id, data) => API.put(`/tickets/${id}`, data);
export const deleteTicket = (id)       => API.delete(`/tickets/${id}`);

export const getContracts   = ()         => API.get('/contracts');
export const createContract = (data)     => API.post('/contracts', data);
export const updateContract = (id, data) => API.put(`/contracts/${id}`, data);
export const deleteContract = (id)       => API.delete(`/contracts/${id}`);

export const getAlerts        = ()   => API.get('/alerts');
export const acknowledgeAlert = (id) => API.put(`/alerts/${id}/acknowledge`);
export const escalateAlert    = (id) => API.put(`/alerts/${id}/escalate`);

export const getSummary       = () => API.get('/analytics/summary');
export const getTierBreakdown = () => API.get('/analytics/tier-breakdown');
export const getBreachTrend   = () => API.get('/analytics/breach-trend');

export default API;