import apiClient from "./apiClient.jsx";

// GET all grades
export async function getGrades() {
    const res = await apiClient.get("/grades");
    return res.data;
}

// CREATE new grade
export async function createGrade(data) {
    const res = await apiClient.post("/grades", data);
    return res.data;
}

// UPDATE a grade
export async function updateGrade(id, data) {
    const res = await apiClient.put(`/grades/${id}`, data);
    return res.data;
}

// DELETE a grade
export async function deleteGrade(id) {
    const res = await apiClient.delete(`/grades/${id}`);
    return res.data;
}

// EXPORT grades as CSV
export async function exportGradesCSV() {
    const res = await apiClient.get("/grades/export", { responseType: "blob" });
    return res.data;
}