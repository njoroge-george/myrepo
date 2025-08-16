// src/api/financeApi.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/finance';

export const saveEntry = async (entry) => {
    const response = await axios.post(API_URL, entry);
    return response.data;
};

export const getEntries = async (entry) => {
    const response = await axios.get(API_URL, entry);
    return response.data;
};


// ✅ Update an existing entry
export const updateEntry = async (id, updatedData) => {
    const response = await axios.put(`${API_URL}/${id}`, updatedData);
    return response.data;
};

// ✅ Delete an entry
export const deleteEntry = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
