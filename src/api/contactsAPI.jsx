// src/api/contactsAPI.js
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/contacts'; // adjust if backend runs elsewhere

// Contacts
export const getContacts = (params = {}) =>
    axios.get(API_BASE, { params });

export const getContact = (id) =>
    axios.get(`${API_BASE}/${id}`);

export const createContact = (data) =>
    axios.post(API_BASE, data);

export const updateContact = (id, data) =>
    axios.put(`${API_BASE}/${id}`, data);

export const deleteContact = (id) =>
    axios.delete(`${API_BASE}/${id}`);

// Communications
export const getCommunications = (contactId, params = {}) =>
    axios.get(`${API_BASE}/${contactId}/comms`, { params });

export const addCommunication = (contactId, data) =>
    axios.post(`${API_BASE}/${contactId}/comms`, data);

export const deleteCommunication = (contactId, commId) =>
    axios.delete(`${API_BASE}/${contactId}/comms/${commId}`);
