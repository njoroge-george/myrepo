import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL;

export const getSettings = async (token) => {
    const res = await axios.get(`${API}/settings`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

export const updateSettings = async (data, token) => {
    const res = await axios.put(`${API}/settings`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

export const resetSettings = async (token) => {
    const res = await axios.delete(`${API}/settings`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};
