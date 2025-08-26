import apiClient from './apiClient.jsx';
import { io } from 'socket.io-client';

// REST: Fetch chat history
export const fetchChatHistory = async () => {
    try {
        const res = await apiClient.get('/chat/history');
        // Ensure we always return an array
        return Array.isArray(res?.data) ? res.data : [];
    } catch (err) {
        console.error('Failed to fetch chat history:', err);
        return [];
    }
};

// Socket.io: Chat client
export const createChatSocket = (username) => {
    // Ensure BASE_URL is defined
    const BASE_URL = import.meta.env.VITE_BASE_URL?.replace('/api', '') || 'http://localhost:5001';

    const socket = io(BASE_URL, {
        transports: ['websocket'],
    });

    // Emit join only if username is valid
    if (username) socket.emit('join', { username });

    return {
        socket,
        sendMessage: (text) => {
            if (text) socket.emit('message', { username, text });
        },
        sendTyping: (isTyping) => socket.emit('typing', { username, isTyping }),
        onMessage: (cb) => socket.on('message', cb),
        onUsers: (cb) => socket.on('users', cb),
        onTyping: (cb) => socket.on('typing', cb),
        onHistory: (cb) => socket.on('history', cb),
        disconnect: () => socket.disconnect(),
    };
};
