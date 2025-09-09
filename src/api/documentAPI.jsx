// src/api/documentAPI.js
import apiClient from "./apiClient";

// 📄 Get all documents
export async function getDocuments() {
    const res = await apiClient.get("/documents");
    return res.data; // { success, data }
}

// ➕ Create a new document
export async function createDocument(document) {
    const res = await apiClient.post("/documents", document);
    return res.data; // { success, data }
}

// ✏️ Update a document
export async function updateDocument(id, document) {
    const res = await apiClient.put(`/documents/${id}`, document);
    return res.data; // { success, data }
}

// 🔍 Get single document
export async function getDocumentById(id) {
    const res = await apiClient.get(`/documents/${id}`);
    return res.data; // { success, data }
}

// 🗑️ Delete a document
export async function deleteDocument(id) {
    const res = await apiClient.delete(`/documents/${id}`);
    return res.data; // { success, message }
}
