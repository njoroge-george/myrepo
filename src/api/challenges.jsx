// src/api/challenges.js
import apiClient from './apiClient';

export const getChallenges = async () => {
  const res = await apiClient.get('/challenges');
  return res.data;
};

export const getChallengeStats = async (id) => {
  const res = await apiClient.get(`/challenges/${id}/stats`);
  return res.data;
};

export const createChallenge = async (challenge) => {
  const res = await apiClient.post('/challenges', challenge);
  return res.data;
};

export const deleteChallenge = async (id) => {
  const res = await apiClient.delete(`/challenges/${id}`);
  return res.data;
};
