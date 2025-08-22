import axios from 'axios';
import { io } from 'socket.io-client';

const API = import.meta.env.VITE_CHAT_API_BASE_URL;
const SOCKET_URL = API; // Use your backend URL

// REST: Fetch chat history (optional)
export const fetchChatHistory = async (token) => {
    const res = await axios.get(`${API}/chat/history`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

// Socket.io: Chat client
export const createChatSocket = (username) => {
    const socket = io(SOCKET_URL, { transports: ['websocket'] });

    // Join chat
    socket.emit('join', { username });

    // Helper methods
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