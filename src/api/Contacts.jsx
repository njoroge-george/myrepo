// src/api/Contacts.jsx
import apiClient from './apiClient.jsx';

// Contacts
export const getContacts = async (params = {}) => {
    const res = await apiClient.get('/contacts', { params });
    return res.data;
};

export const getContact = async (id) => {
    const res = await apiClient.get(`/contacts/${id}`);
    return res.data;
};

export const createContact = async (data) => {
    const res = await apiClient.post('/contacts', data);
    return res.data;
};

export const updateContact = async (id, data) => {
    const res = await apiClient.put(`/contacts/${id}`, data);
    return res.data;
};

export const deleteContact = async (id) => {
    const res = await apiClient.delete(`/contacts/${id}`);
    return res.data;
};

// Communications
export const getCommunications = async (contactId, params = {}) => {
    const res = await apiClient.get(`/contacts/${contactId}/comms`, { params });
    return res.data;
};

export const addCommunication = async (contactId, data) => {
    const res = await apiClient.post(`/contacts/${contactId}/comms`, data);
    return res.data;
};

export const deleteCommunication = async (contactId, commId) => {
    const res = await apiClient.delete(`/contacts/${contactId}/comms/${commId}`);
    return res.data;
};