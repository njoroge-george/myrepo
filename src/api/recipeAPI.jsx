// src/api/recipesAPI.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/recipes"; // Change to your backend URL

// Get all recipes
export const getRecipes = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

// Get a single recipe by ID
export const getRecipeById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

// Create a new recipe
export const createRecipe = async (recipeData) => {
  const res = await axios.post(API_URL, recipeData);
  return res.data;
};

// Update a recipe
export const updateRecipe = async (id, updatedData) => {
  const res = await axios.put(`${API_URL}/${id}`, updatedData);
  return res.data;
};

// Delete a recipe
export const deleteRecipe = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
