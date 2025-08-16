import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/fitness';

// Helper to get auth token
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

// ✅ GET all fitness entries
export const fetchFitnessEntries = async () => {
    const res = await axios.get(BASE_URL, getAuthHeader());
    return res.data;
};

// ✅ CREATE a new fitness entry
export const createFitnessEntry = async (data) => {
    const res = await axios.post(BASE_URL, data, getAuthHeader());
    return res.data;
};

// ✅ DELETE a fitness entry by ID
export const deleteFitnessEntry = async (id) => {
    const res = await axios.delete(`${BASE_URL}/${id}`, getAuthHeader());
    return res.data;
};
