import apiClient from './apiClient';

// CONTACTS CRUD
export async function getContacts(params = {}) {
    try {
        const res = await apiClient.get('/contacts', { params });
        // Accept array or { data: [...] }
        if (Array.isArray(res.data)) return res.data;
        if (Array.isArray(res.data?.data)) return res.data.data;
        return [];
    } catch (err) {
        console.error('Failed to fetch contacts:', err);
        throw err;
    }
}

export async function getContact(id) {
    try {
        const res = await apiClient.get(`/contacts/${id}`);
        return res.data || {};
    } catch (err) {
        console.error(`Failed to fetch contact ${id}:`, err);
        throw err;
    }
}

export async function createContact(data) {
    try {
        const res = await apiClient.post('/contacts', data);
        return res.data || {};
    } catch (err) {
        console.error('Failed to create contact:', err);
        throw err;
    }
}

export async function updateContact(id, data) {
    try {
        const res = await apiClient.put(`/contacts/${id}`, data);
        return res.data || {};
    } catch (err) {
        console.error(`Failed to update contact ${id}:`, err);
        throw err;
    }
}

export async function deleteContact(id) {
    try {
        const res = await apiClient.delete(`/contacts/${id}`);
        return res.data || {};
    } catch (err) {
        console.error(`Failed to delete contact ${id}:`, err);
        throw err;
    }
}

// COMMUNICATIONS CRUD
export async function getCommunications(contactId, params = {}) {
    try {
        const res = await apiClient.get(`/contacts/${contactId}/comms`, { params });
        if (Array.isArray(res.data)) return res.data;
        if (Array.isArray(res.data?.data)) return res.data.data;
        return [];
    } catch (err) {
        console.error(`Failed to fetch communications for contact ${contactId}:`, err);
        throw err;
    }
}

export async function addCommunication(contactId, data) {
    try {
        const res = await apiClient.post(`/contacts/${contactId}/comms`, data);
        return res.data || {};
    } catch (err) {
        console.error(`Failed to add communication for contact ${contactId}:`, err);
        throw err;
    }
}

export async function deleteCommunication(contactId, commId) {
    try {
        const res = await apiClient.delete(`/contacts/${contactId}/comms/${commId}`);
        return res.data || {};
    } catch (err) {
        console.error(`Failed to delete communication ${commId} for contact ${contactId}:`, err);
        throw err;
    }
}