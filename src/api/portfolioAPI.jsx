// src/api/portfolioAPI.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_PORTFOLIO_API_URL;

export const getPortfolio = async () => {
  const res = await axios.get(`${API_URL}/portfolio`);
  return res.data;
};

export const createPortfolio = async (portfolioData) => {
  const res = await axios.post(`${API_URL}/portfolio`, portfolioData);
  return res.data;
};
