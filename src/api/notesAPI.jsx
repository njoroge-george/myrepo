// src/api/notesAPI.jsx
import apiClient from './apiClient.jsx';

// Get all notes
export const getNotes = async () => {
    const res = await apiClient.get('/notes');
    return res.data;
};

// Add a new note
export const addNote = async (note) => {
    const res = await apiClient.post('/notes', note);
    return res.data;
};

// Update a note
export const updateNote = async (id, note) => {
    const res = await apiClient.put(`/notes/${id}`, note);
    return res.data;
};

// Delete a note
export const deleteNote = async (id) => {
    const res = await apiClient.delete(`/notes/${id}`);
    return res.data;
};