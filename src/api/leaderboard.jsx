import apiClient from "./apiClient";

// Fetch leaderboard for a room
export async function getLeaderboard(roomId) {
  const res = await apiClient.get(`/leaderboard/${roomId}`);
  return res.data;
}

// Update leaderboard when coder solves
export async function updateLeaderboard(payload) {
  const res = await apiClient.post("/leaderboard", payload);
  return res.data;
}
