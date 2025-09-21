import apiClient from './apiClient';

const BASE = '/challenges';

export const getChallenges = async (status) => {
  const query = status ? `?status=${status}` : '';
  return apiClient.get(`${BASE}${query}`);
};

export const getChallengeById = async (id) => {
  return apiClient.get(`${BASE}/${id}`);
};

export const createChallenge = async (data) => {
  return apiClient.post(BASE, data);
};

export const updateChallenge = async (id, data) => {
  return apiClient.put(`${BASE}/${id}`, data);
};

export const deleteChallenge = async (id) => {
  return apiClient.delete(`${BASE}/${id}`);
};
