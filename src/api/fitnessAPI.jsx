// src/api/fitnessAPI.jsx
import apiClient from './apiClient.jsx';

// GET all fitness entries
export const fetchFitnessEntries = async () => {
    const res = await apiClient.get('/fitness');
    return res.data;
};

// CREATE a new fitness entry
export const createFitnessEntry = async (data) => {
    const res = await apiClient.post('/fitness', data);
    return res.data;
};

// DELETE a fitness entry by ID
export const deleteFitnessEntry = async (id) => {
    const res = await apiClient.delete(`/fitness/${id}`);
    return res.data;
};