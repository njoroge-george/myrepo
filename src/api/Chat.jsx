// src/api/chatAPI.jsx
import apiClient from "./apiClient.jsx";
import { io } from "socket.io-client";

let chatSocket;

/**
 * ✅ Fetch chat history for a given room
 * @param {string} roomName
 */
export const isValidRoom = async (room) => {
  const rooms = await fetchRooms();
  return rooms.some(r => r.name === room);
};

export const fetchChatHistory = async (room) => {
    if (!room || room.length < 3) return [];

    try {
        const res = await apiClient.get(`/chat/history?room=${room}`);
        return res.data.success ? res.data.data : [];
    } catch (err) {
        console.error("❌ Failed to fetch chat history:", err);
        return [];
    }
};

/**
 * ✅ Fetch all available rooms
 */
export const fetchRooms = async () => {
    try {
        const res = await apiClient.get("/chat/rooms");
        return res.data.success ? res.data.data : [];
    } catch (err) {
        console.error("❌ Failed to fetch rooms:", err);
        return [];
    }
};

/**
 * ✅ Fetch all online users
 */
export const fetchOnlineUsers = async () => {
    try {
        const res = await apiClient.get("/chat/users");
        return res.data.success ? res.data.data : [];
    } catch (err) {
        console.error("❌ Failed to fetch online users:", err);
        return [];
    }
};

/**
 * ✅ Create a namespaced Socket.io chat connection
 * @param {string} username
 * @param {string} roomName
 */
export const createChatSocket = (username, roomName) => {
    const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5001";

    if(chatSocket?.connected){
        chatSocket.disconnect();
    }

    // Connect specifically to the /chat namespace
    chatSocket = io(`${BASE_URL}/chat`, { transports: ["websocket"] });

    // Join the specified room
    if (username && roomName) {
        chatSocket.emit("join", { username, roomName });
    }

    return {
        socket: chatSocket,

        // ✅ Send a new message
        sendMessage: (text) => {
            if (text) chatSocket.emit("message", { text });
        },

        // ✅ Send typing status
        sendTyping: (isTyping) => chatSocket.emit("typing", { username, isTyping }),

        // ✅ Listen for a new message
        onMessage: (cb) => chatSocket.on("message", cb),

        // ✅ Listen for online users in the room
        onUsers: (cb) => chatSocket.on("users", cb),

        // ✅ Listen for typing indicators
        onTyping: (cb) => chatSocket.on("typing", cb),

        // ✅ Listen for message history
        onHistory: (cb) => chatSocket.on("history", cb),

        // ✅ Disconnect socket
        disconnect: () => chatSocket.disconnect(),
    };
};
