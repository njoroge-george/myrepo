// src/api/portfolioAPI.jsx
import apiClient from './apiClient.jsx';

// Get portfolio
export const getPortfolio = async () => {
  const res = await apiClient.get('/portfolio');
  return res.data;
};

// Create portfolio
export const createPortfolio = async (portfolioData) => {
  const res = await apiClient.post('/portfolio', portfolioData);
  return res.data;
};