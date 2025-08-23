// src/api/learningAPI.jsx
import apiClient from './apiClient.jsx';

// Get all courses
export const getCourses = async () => {
    const res = await apiClient.get('/courses');
    return res.data;
};

// Add all courses
export const addCourse = async (course) => {
    const res = await apiClient.get('/course', course);
    return res.data;
};

// Get all achievements
export const getAchievements = async () => {
    const res = await apiClient.get('/achievements');
    return res.data;
};

// Add a new achievement
export const addAchievement = async (achievement) => {
    const res = await apiClient.post('/achievements', achievement);
    return res.data;
};

// Get all resources
export const getResources = async () => {
    const res = await apiClient.get('/resources');
    return res.data;
};

// Add a new resource
export const addResource = async (resource) => {
    const res = await apiClient.post('/resources', resource);
    return res.data;
};

// Get all practice logs
export const getPracticeLogs = async () => {
    const res = await apiClient.get('/practice-logs');
    return res.data;
};

// Add a new practice log
export const addPracticeLog = async (log) => {
    const res = await apiClient.post('/practice-logs', log);
    return res.data;
};