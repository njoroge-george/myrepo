// src/api/documentAPI.jsx
import apiClient from "./apiClient";

// 📄 Get all codes
export async function getCodes() {
    const res = await apiClient.get("/chords");
    return res.data; // { success, data }
}

// ➕ Create a new code
export async function createCode(code) {
    const res = await apiClient.post("/chords", code);
    return res.data; // { success, data }
}

// ✏️ Update a code
export async function updateCode(id, code) {
    const res = await apiClient.put(`/chords/${id}`, code);
    return res.data; // { success, data }
}

// 🔍 Get single code
export async function getCodeById(id) {
    const res = await apiClient.get(`/chords/${id}`);
    return res.data; // { success, data }
}

// 🗑️ Delete a code
export async function deleteCode(id) {
    const res = await apiClient.delete(`/chords/${id}`);
    return res.data; // { success, message }
}
