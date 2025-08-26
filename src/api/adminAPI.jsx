import apiClient from './apiClient.jsx';

// Send a new message (visitor)
export const sendMessage = async ({ name, email, subject, message }) => {
    return apiClient.post('/messages', { name, email, subject, message });
};

// Get all messages (admin)
export const getAllMessages = async () => {
    return apiClient.get('/messages');
};

// Reply to a message (admin)
export const replyToMessage = async (id, reply) => {
    return apiClient.post(`/messages/reply/${id}`, { reply });
};

// Mark message as read/unread (admin)
export const markMessageRead = async (id, read) => {
    return apiClient.patch(`/messages/${id}/read`, { read });
};

// Delete a message (admin)
export const deleteMessage = async (id) => {
    return apiClient.delete(`/messages/${id}`);
};