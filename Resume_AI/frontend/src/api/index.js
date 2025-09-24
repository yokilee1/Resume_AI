import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  config => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle errors globally
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Resume API
export const resumeApi = {
  getResumes() {
    return api.get('/resumes');
  },
  
  getResumeDetail(id) {
    return api.get(`/resumes/${id}`);
  },
  
  createResume(data) {
    return api.post('/resumes', data);
  },
  
  updateResume(id, data) {
    return api.put(`/resumes/${id}`, data);
  },
  
  deleteResume(id) {
    return api.delete(`/resumes/${id}`);
  }
};

// User API
export const userApi = {
  login(credentials) {
    return api.post('/auth/login', credentials);
  },
  
  register(userData) {
    return api.post('/auth/register', userData);
  },
  
  getUserProfile() {
    return api.get('/user/profile');
  },
  
  updateUserProfile(data) {
    return api.put('/user/profile', data);
  }
};

export default api;