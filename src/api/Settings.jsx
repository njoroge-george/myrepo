// src/api/settingsAPI.js
import apiClient from "./apiClient";
// 👆 assuming you already have a central axios/fetch client (like in your other projects)

// Get settings by userId
export async function getSettings(userId) {
    const res = await apiClient.get(`/settings/${userId}`);
    return res.data; // { success, data }
}

// Update settings
export async function updateSettings(userId, settings) {
    const res = await apiClient.put(`/settings/${userId}`, settings);
    return res.data; // { success, data }
}
