// src/api/Coding.jsx
import apiClient from './apiClient.jsx';

/**
 * Coders
 */
export const createCoder = async (coderData) => {
    try {
        const res = await apiClient.post('/coding/coders', coderData);
        return res.data;
    } catch (err) {
        console.error('Failed to create coder:', err);
        throw err;
    }
};

export const getCoders = async () => {
    try {
        const res = await apiClient.get('/coding/coders');
        return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
        console.error('Failed to fetch coders:', err);
        return [];
    }
};

/**
 * Challenges
 */
export const createChallenge = async (challengeData) => {
    try {
        const res = await apiClient.post('/coding/challenges', challengeData);
        return res.data;
    } catch (err) {
        console.error('Failed to create challenge:', err);
        throw err;
    }
};

export const getChallenges = async () => {
  try {
    const res = await apiClient.get("/coding/challenges");
    return res.data; // ✅ This line is critical
  } catch (err) {
    console.error("API error fetching challenges:", err);
    throw err;
  }
};


export const updateChallenge = async (challengeData) => {
    const { id, ...payload } = challengeData;
    const res = await apiClient.put(`/coding/challenges/${id}`, payload);
    return res.data;
};

export const deleteChallenge = async (id) => {
    const res = await apiClient.delete(`/coding/challenges/${id}`);
    return res.data;
};


export const submitCode = async ({ challengeId, coderId, code }) => {
    const res = await apiClient.post("/coding/submissions", {
        challengeId,
        coderId,
        code,
    });
    return res.data;
};

export const fetchTestCases = async (challengeId) => {
  try {
    const res = await apiClient.get(`/coding/testcases/${challengeId}`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch test cases:", err);
    throw err;
  }
};


export const getSubmissionsByCoder = async (coderId) => {
    try {
        const res = await apiClient.get(`/coding/submissions/coder/${coderId}`);
        return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
        console.error('Failed to fetch submissions by coder:', err);
        return [];
    }
};

export const getSubmissionsByChallenge = async (challengeId) => {
    try {
        const res = await apiClient.get(`/coding/submissions/challenge/${challengeId}`);
        return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
        console.error('Failed to fetch submissions by challenge:', err);
        return [];
    }
};

export const deleteSubmission = async (submissionId) => {
    try {
        const res = await apiClient.delete(`/coding/submissions/${submissionId}`);
        return res.data;
    } catch (err) {
        console.error('Failed to delete submission:', err);
        throw err;
    }
};
