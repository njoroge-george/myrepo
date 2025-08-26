// src/api/financeApi.jsx
import apiClient from "./apiClient.jsx";

// Create a new finance entry
export const saveEntry = async (entry) => {
    const response = await apiClient.post('/finance', entry);
    return response.data || {};
};

// Get all finance entries
export const getEntries = async (params = {}) => {
    const response = await apiClient.get('/finance', { params });
    return Array.isArray(response.data) ? response.data : [];
};

// Update an existing finance entry
export const updateEntry = async (id, updatedData) => {
    const response = await apiClient.put(`/finance/${id}`, updatedData);
    return response.data || {};
};

// Delete a finance entry
export const deleteEntry = async (id) => {
    const response = await apiClient.delete(`/finance/${id}`);
    return response.data || {};
};
