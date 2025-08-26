import apiClient from './apiClient';

// Get all notes
export async function getNotes() {
    const res = await apiClient.get('/notes');
    return res.data;
}

// Add a new note
export async function addNote(note) {
    const res = await apiClient.post('/notes', note);
    return res.data;
}

// Update a note
export async function updateNote(id, note) {
    const res = await apiClient.put(`/notes/${id}`, note);
    return res.data;
}

// Delete a note
export async function deleteNote(id) {
    const res = await apiClient.delete(`/notes/${id}`);
    return res.data;
}