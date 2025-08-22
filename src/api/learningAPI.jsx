import axios from 'axios';

const API_URL = import.meta.env.LEARNING_API_URL;

// Get all courses
export const getCourses = () => {
    return axios.get(`${API_URL}/courses`);
};

// Get all achievements
export const getAchievements = () => {
    return axios.get(`${API_URL}/achievements`);
};

// Add a new achievement
export const addAchievement = (achievement) => {
    return axios.post(`${API_URL}/achievements`, achievement);
};

// Get all resources
export const getResources = () => {
    return axios.get(`${API_URL}/resources`);
};

// Add a new resource
export const addResource = (resource) => {
    return axios.post(`${API_URL}/resources`, resource);
};

// Get all practice logs
export const getPracticeLogs = () => {
    return axios.get(`${API_URL}/practice-logs`);
};

// Add a new practice log
export const addPracticeLog = (log) => {
    return axios.post(`${API_URL}/practice-logs`, log);
};
