// src/api/apiClient.jsx
import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:5001/api',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

export default apiClient;
