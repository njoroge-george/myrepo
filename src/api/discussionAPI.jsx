import apiClient from "./apiClient";

// Get all discussions for a challenge
export const getDiscussions = async (challengeId) => {
  try {
    const res = await apiClient.get(`/challenges/${challengeId}/discussions`);
    return res.data;
  } catch (err) {
    return { success: false, error: err?.response?.data?.error || err.message };
  }
};

// Create a new discussion
export const createDiscussion = async (challengeId, payload) => {
  try {
    const res = await apiClient.post(`/challenges/${challengeId}/discussions`, payload);
    return res.data;
  } catch (err) {
    return { success: false, error: err?.response?.data?.error || err.message };
  }
};

// Add a reply to a discussion
export const addReply = async (discussionId, payload) => {
  try {
    const res = await apiClient.post(`/discussions/${discussionId}/replies`, payload);
    return res.data;
  } catch (err) {
    return { success: false, error: err?.response?.data?.error || err.message };
  }
};

// Toggle like/unlike on a discussion
export const toggleLikeDiscussion = async (discussionId, payload) => {
  try {
    const res = await apiClient.post(`/discussions/${discussionId}/like`, payload);
    return res.data;
  } catch (err) {
    return { success: false, error: err?.response?.data?.error || err.message };
  }
};

// Get all coders
export const getCoders = async () => {
  try {
    const res = await apiClient.get(`/coders`);
    return res.data;
  } catch (err) {
    return { success: false, error: err?.response?.data?.error || err.message };
  }
};

// Update coder avatar
export const updateCoderAvatar = async (coderId, avatar) => {
  try {
    const res = await apiClient.patch(`/coders/${coderId}/avatar`, { avatar });
    return res.data;
  } catch (err) {
    return { success: false, error: err?.response?.data?.error || err.message };
  }
};