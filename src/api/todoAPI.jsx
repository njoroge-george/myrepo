// src/api/todoAPI.jsx
import apiClient from './apiClient.jsx';

// Get all todos
export const getTodos = async (params = {}) => {
  const res = await apiClient.get('/todos', { params });
  return Array.isArray(res.data) ? res.data : [];
};

// Get a single todo by ID
export const getTodoById = async (id) => {
  const res = await apiClient.get(`/todos/${id}`);
  return res.data || {};
};

// Create a new todo
export const createTodo = async (payload) => {
  const res = await apiClient.post('/todos', payload);
  return res.data || {};
};

// Update a todo
export const updateTodo = async (id, payload) => {
  const res = await apiClient.put(`/todos/${id}`, payload);
  return res.data || {};
};

// Delete a todo
export const deleteTodo = async (id) => {
  const res = await apiClient.delete(`/todos/${id}`);
  return res.data || {};
};
