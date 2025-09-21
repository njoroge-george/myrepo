import apiClient from './apiClient';

const BASE = '/submissions';

export const submitCode = async (payload) => {
  return apiClient.post(`${BASE}`, payload);
};

export const getSubmissionsByCoder = async (coderId) => {
  return apiClient.get(`${BASE}/coder/${coderId}`);
};

export const getSubmissionsByChallenge = async (challengeId) => {
  return apiClient.get(`${BASE}/challenge/${challengeId}`);
};

export const deleteSubmission = async (id) => {
  return apiClient.delete(`${BASE}/${id}`);
};

export const getAnalytics = async () => {
  return apiClient.get(`${BASE}/analytics`);
};
