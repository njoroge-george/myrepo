// src/api/projectsApi.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_PROJECTS_API_URL;
export const getProjects = async () => {
    const res = await axios.get(BASE_URL);
    return res.data;
};

export const createProject = async (project) => {
    const res = await axios.post(BASE_URL, project);
    return res.data;
};

export const updateProject = async (id, updatedProject) => {
    const res = await axios.put(`${BASE_URL}/${id}`, updatedProject);
    return res.data;
};

export const deleteProject = async (id) => {
    const res = await axios.delete(`${BASE_URL}/${id}`);
    return res.data;
};
