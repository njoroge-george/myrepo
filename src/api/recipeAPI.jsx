// src/api/recipeAPI.jsx
import apiClient from './apiClient.jsx';

// Get all recipes
export const getRecipes = async () => {
  const res = await apiClient.get('/recipes');
  return Array.isArray(res.data) ? res.data : [];
};

// Get a single recipe by ID
export const getRecipeById = async (id) => {
  const res = await apiClient.get(`/recipes/${id}`);
  return res.data || {};
};

// Create a new recipe
export const createRecipe = async (recipeData) => {
  const res = await apiClient.post('/recipes', recipeData);
  return res.data || {};
};

// Update a recipe
export const updateRecipe = async (id, updatedData) => {
  const res = await apiClient.put(`/recipes/${id}`, updatedData);
  return res.data || {};
};

// Delete a recipe
export const deleteRecipe = async (id) => {
  const res = await apiClient.delete(`/recipes/${id}`);
  return res.data || {};
};
