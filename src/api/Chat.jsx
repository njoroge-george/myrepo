import apiClient from './apiClient.jsx';
import { io } from 'socket.io-client';

// REST: Fetch chat history
export const fetchChatHistory = async () => {
    const res = await apiClient.get('/chat/history');
    // Guard against non-array
    return Array.isArray(res.data) ? res.data : [];
};

// Socket.io: Chat client
export const createChatSocket = (username) => {
    const socket = io(import.meta.env.VITE_BASE_URL.replace('/api',''), {
        transports: ['websocket'],
    });

    socket.emit('join', { username });

    return {
        socket,
        sendMessage: (text) => socket.emit('message', { username, text }),
        sendTyping: (isTyping) => socket.emit('typing', { username, isTyping }),
        onMessage: (cb) => socket.on('message', cb),
        onUsers: (cb) => socket.on('users', cb),
        onTyping: (cb) => socket.on('typing', cb),
        onHistory: (cb) => socket.on('history', cb),
        disconnect: () => socket.disconnect(),
    };
};
