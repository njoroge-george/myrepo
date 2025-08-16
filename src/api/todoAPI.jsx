// src/api/todosAPI.js
import axios from 'axios';
const API_URL = "http://localhost:5000/api/todos";

export const getTodos = async (params = {}) => {
  const res = await axios.get(API_URL, { params });
  return res.data;
};

export const getTodoById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const createTodo = async (payload) => {
  const res = await axios.post(API_URL, payload);
  return res.data;
};

export const updateTodo = async (id, payload) => {
  const res = await axios.put(`${API_URL}/${id}`, payload);
  return res.data;
};

export const deleteTodo = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
