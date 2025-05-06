import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Articles
export const getArticles = async (params = {}) => {
  const response = await api.get('/articles/', { params });
  return response.data;
};

export const getArticle = async (id) => {
  const response = await api.get(`/articles/${id}`);
  return response.data;
};

export const createArticle = async (articleData) => {
  const response = await api.post('/articles/', articleData);
  return response.data;
};

export const updateArticle = async (id, articleData) => {
  const response = await api.put(`/articles/${id}`, articleData);
  return response.data;
};

export const deleteArticle = async (id) => {
  const response = await api.delete(`/articles/${id}`);
  return response.data;
};

// Categories
export const getCategories = async () => {
  const response = await api.get('/categories/');
  return response.data;
};

export const createCategory = async (categoryData) => {
  const response = await api.post('/categories/', categoryData);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};

// Tags
export const getTags = async () => {
  const response = await api.get('/tags/');
  return response.data;
};

export const createTag = async (tagData) => {
  const response = await api.post('/tags/', tagData);
  return response.data;
};

export const deleteTag = async (id) => {
  const response = await api.delete(`/tags/${id}`);
  return response.data;
};

export default api;

