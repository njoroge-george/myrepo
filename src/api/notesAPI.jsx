import axios from 'axios';

const API_URL = import.meta.env.VITE_NOTES_API_URL;

export const getNotes = () => API.get('/');
export const addNote = (note) => API.post('/', note);
export const updateNote = (id, note) => API.put(`/${id}`, note);
export const deleteNote = (id) => API.delete(`/${id}`);
