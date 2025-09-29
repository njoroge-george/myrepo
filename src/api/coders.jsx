import apiClient from "./apiClient";

export const getRooms = () => apiClient.get("/rooms");
export const createRoom = (room) => apiClient.post("/rooms", room);
export const deleteRoom = (id) => apiClient.delete(`/rooms/${id}`);

// coders
export const addCoder = (coder) => apiClient.post("/coders", coder);
export const toggleMute = (id) => apiClient.patch(`/coders/${id}/mute`);
export const deleteCoder = (id) => apiClient.delete(`/coders/${id}`);
export const getCoders = () => apiClient.get("/coders"); // <-- add this line!