import apiClient from "./apiClient";

// 🚀 Submit code
export const submitCode = (payload) => {
  return apiClient.post("/submissions", payload);
};

// 📄 Get submissions by coder
export const getSubmissionsByCoder = (coderId) => {
  return apiClient.get(`/submissions/coder/${coderId}`);
};

// 📄 Get submissions by challenge
export const getSubmissionsByChallenge = (challengeId) => {
  return apiClient.get(`/submissions/challenge/${challengeId}`);
};

// 🔍 Get single submission
export const getSubmissionById = (id) => {
  return apiClient.get(`/submissions/${id}`);
};

// 📝 Review submission (admin only)
export const reviewSubmission = (id, feedback, reviewedBy) => {
  return apiClient.post(`/submissions/${id}/review`, { feedback, reviewedBy });
};

// 🔁 Retry submission
export const retrySubmission = (id) => {
  return apiClient.post(`/submissions/${id}/retry`);
};

// ❌ Delete submission (admin only)
export const deleteSubmission = (id) => {
  return apiClient.delete(`/submissions/${id}`);
};

// 📊 Get analytics (admin only)
export const getSubmissionAnalytics = () => {
  return apiClient.get("/submissions/analytics");
};
