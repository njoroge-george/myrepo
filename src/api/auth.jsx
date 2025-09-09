// src/api/auth.jsx
import apiClient from "./apiClient.jsx";

// Attach token automatically to every request
apiClient.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// Auth API calls
export const registerUser = (userData) => apiClient.post("/auth/register", userData);
export const loginUser = (userData) => apiClient.post("/auth/login", userData);
