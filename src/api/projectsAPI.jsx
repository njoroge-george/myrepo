// src/api/projectsAPI.jsx
import apiClient from './apiClient.jsx';

// Get all projects
export const getProjects = async () => {
    const res = await apiClient.get('/projects');
    return Array.isArray(res.data) ? res.data : [];
};

// Create a new project
export const createProject = async (project) => {
    const res = await apiClient.post('/projects', project);
    return res.data || {};
};

// Update a project
export const updateProject = async (id, updatedProject) => {
    const res = await apiClient.put(`/projects/${id}`, updatedProject);
    return res.data || {};
};

// Delete a project
export const deleteProject = async (id) => {
    const res = await apiClient.delete(`/projects/${id}`);
    return res.data || {};
};
