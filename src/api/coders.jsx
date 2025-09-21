// src/api/coders.js
import apiClient from './apiClient';

const BASE = '/coders';

export const createCoder = async (data) => {
  return apiClient.post(BASE, data);
};

export const getCoders = async () => {
  return apiClient.get(BASE);
};
