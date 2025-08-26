import apiClient from './apiClient';

// --- Courses ---
export async function getCourses() {
    const res = await apiClient.get('/learning/courses');
    return res.data;
}

export async function addCourse(course) {
    const res = await apiClient.post('/learning/courses', course);
    return res.data;
}

export async function updateCourse(id, course) {
    const res = await apiClient.put(`/learning/courses/${id}`, course);
    return res.data;
}

export async function deleteCourse(id) {
    const res = await apiClient.delete(`/learning/courses/${id}`);
    return res.data;
}

// --- Achievements ---
export async function getAchievements() {
    const res = await apiClient.get('/learning/achievements');
    return res.data;
}

export async function addAchievement(achievement) {
    const res = await apiClient.post('/learning/achievements', achievement);
    return res.data;
}

export async function updateAchievement(id, achievement) {
    const res = await apiClient.put(`/learning/achievements/${id}`, achievement);
    return res.data;
}

export async function deleteAchievement(id) {
    const res = await apiClient.delete(`/learning/achievements/${id}`);
    return res.data;
}

// --- Resources ---
export async function getResources() {
    const res = await apiClient.get('/learning/resources');
    return res.data;
}

export async function addResource(resource) {
    const res = await apiClient.post('/learning/resources', resource);
    return res.data;
}

export async function updateResource(id, resource) {
    const res = await apiClient.put(`/learning/resources/${id}`, resource);
    return res.data;
}

export async function deleteResource(id) {
    const res = await apiClient.delete(`/learning/resources/${id}`);
    return res.data;
}

// --- Practice Logs ---
export async function getPracticeLogs() {
    const res = await apiClient.get('/learning/practice-logs');
    return res.data;
}

export async function addPracticeLog(log) {
    const res = await apiClient.post('/learning/practice-logs', log);
    return res.data;
}

export async function updatePracticeLog(id, log) {
    const res = await apiClient.put(`/learning/practice-logs/${id}`, log);
    return res.data;
}

export async function deletePracticeLog(id) {
    const res = await apiClient.delete(`/learning/practice-logs/${id}`);
    return res.data;
}