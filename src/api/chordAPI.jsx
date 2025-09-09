// src/api/documentAPI.jsx
import apiClient from "./apiClient";

// 📄 Get all codes
export async function getChords() {
    const res = await apiClient.get("/chords");
    return res.data; // { success, data }
}

// ➕ Create a new code
export async function createChord(chord) {
    const res = await apiClient.post("/chords", chord);
    return res.data; // { success, data }
}

// ✏️ Update a code
export async function updateChord(id, chord) {
    const res = await apiClient.put(`/chords/${id}`, chord);
    return res.data; // { success, data }
}

// 🔍 Get single code
export async function getChordById(id) {
    const res = await apiClient.get(`/chords/${id}`);
    return res.data; // { success, data }
}

// 🗑️ Delete a code
export async function deleteChord(id) {
    const res = await apiClient.delete(`/chords/${id}`);
    return res.data; // { success, message }
}
