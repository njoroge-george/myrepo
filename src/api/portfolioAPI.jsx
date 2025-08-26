// src/api/portfolioAPI.jsx
import apiClient from './apiClient.jsx';

// Portfolio
export const getPortfolio = async () => {
  const res = await apiClient.get('/portfolio');
  return Array.isArray(res.data) ? res.data : [];
};

export const createPortfolio = async (portfolioData) => {
  const res = await apiClient.post('/portfolio', portfolioData);
  return res.data || {};
};
