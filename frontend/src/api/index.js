import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication API
export const authAPI = {
  login: async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await api.post('/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/users/', userData);
    return response.data;
  },
};

// User API
export const userAPI = {
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
  
  updateUser: async (userData) => {
    const response = await api.put('/users/me', userData);
    return response.data;
  },
  
  getUserInterests: async () => {
    const response = await api.get('/users/me/interests');
    return response.data;
  },
  
  createUserInterests: async (interestsData) => {
    const response = await api.post('/users/me/interests', interestsData);
    return response.data;
  },
  
  updateUserInterests: async (interestsData) => {
    const response = await api.put('/users/me/interests', interestsData);
    return response.data;
  },
};

// Organization API
export const organizationAPI = {
  getOrganizations: async () => {
    const response = await api.get('/organizations/');
    return response.data;
  },
  
  getOrganization: async (orgId) => {
    const response = await api.get(`/organizations/${orgId}`);
    return response.data;
  },
  
  createOrganization: async (orgData) => {
    const response = await api.post('/organizations/', orgData);
    return response.data;
  },
  
  updateOrganization: async (orgId, orgData) => {
    const response = await api.put(`/organizations/${orgId}`, orgData);
    return response.data;
  },
  
  deleteOrganization: async (orgId) => {
    const response = await api.delete(`/organizations/${orgId}`);
    return response.data;
  },
  
  getOrganizationMembers: async (orgId) => {
    const response = await api.get(`/organizations/${orgId}/members`);
    return response.data;
  },
  
  addOrganizationMember: async (orgId, memberData) => {
    const response = await api.post(`/organizations/${orgId}/members`, memberData);
    return response.data;
  },
  
  updateOrganizationMember: async (orgId, userId, memberData) => {
    const response = await api.put(`/organizations/${orgId}/members/${userId}`, memberData);
    return response.data;
  },
  
  removeOrganizationMember: async (orgId, userId) => {
    const response = await api.delete(`/organizations/${orgId}/members/${userId}`);
    return response.data;
  },
};

export default api;

