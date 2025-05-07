import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authApi = {
  login: (email: string, password: string) => 
    axios.post(`${API_URL}/token`, 
      new URLSearchParams({
        'username': email,
        'password': password,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    ),
  register: (userData: any) => axios.post(`${API_URL}/register`, userData),
};

// User endpoints
export const userApi = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (userData: any) => api.put('/users/me', userData),
  getInterests: () => api.get('/users/interests'),
  createInterests: (interests: any) => api.post('/users/interests', interests),
  updateInterests: (interests: any) => api.put('/users/interests', interests),
};

// Articles endpoints
export const articlesApi = {
  getArticles: (params?: any) => {
    // Check if there's a special endpoint like 'recommended' or 'popular'
    if (params && params.endpoint) {
      const endpoint = params.endpoint;
      delete params.endpoint;
      return api.get(`/articles/${endpoint}`, { params });
    }
    return api.get('/articles', { params });
  },
  getArticle: (id: string) => api.get(`/articles/${id}`),
  createArticle: (article: any) => api.post('/articles', article),
  updateArticle: (id: string, article: any) => api.put(`/articles/${id}`, article),
  deleteArticle: (id: string) => api.delete(`/articles/${id}`),
  getRecommendedArticles: (params?: any) => api.get('/articles/recommended', { params }),
  getPopularArticles: (params?: any) => api.get('/articles/popular', { params }),
};

// Organizations endpoints
export const organizationsApi = {
  getOrganizations: () => api.get('/organizations'),
  getOrganization: (id: string) => api.get(`/organizations/${id}`),
  createOrganization: (org: any) => api.post('/organizations', org),
  updateOrganization: (id: string, org: any) => api.put(`/organizations/${id}`, org),
  getMembers: (id: string) => api.get(`/organizations/${id}/members`),
  addMember: (id: string, member: any) => api.post(`/organizations/${id}/members`, member),
  updateMember: (orgId: string, userId: string, data: any) => 
    api.put(`/organizations/${orgId}/members/${userId}`, data),
  removeMember: (orgId: string, userId: string) => 
    api.delete(`/organizations/${orgId}/members/${userId}`),
};

export default api;
