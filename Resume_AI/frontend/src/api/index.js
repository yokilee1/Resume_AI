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
  // 获取所有简历
  getResumes() {
    return api.get('/resumes');
  },
  
  // 获取简历详情
  getResumeDetail(id) {
    return api.get(`/resumes/${id}`);
  },
  
  // 创建简历
  createResume(data) {
    return api.post('/resumes', data);
  },
  
  // 更新简历
  updateResume(id, data) {
    return api.put(`/resumes/${id}`, data);
  },
  
  // 删除简历
  deleteResume(id) {
    return api.delete(`/resumes/${id}`);
  },

  // 根据用户ID获取简历
  getResumesByUserId(userId) {
    return api.get(`/resumes/user/${userId}`);
  }
};

// User API
export const userApi = {
  // 登录
  login(credentials) {
    return api.post('/auth/login', credentials);
  },
  
  // 注册
  register(userData) {
    return api.post('/auth/register', userData);
  },
  
  // 获取用户个人信息
  getUserProfile() {
    return api.get('/user/profile');
  },
  
  // 更新用户个人信息
  updateUserProfile(data) {
    return api.put('/user/profile', data);
  }
};

// AI API
export const aiApi = {
  // AI润色
  polishResume(data) {
    return api.post('/ai/polish', data);
  },

  // AI评估
  evaluateResume(data) {
    return api.post('/ai/evaluate', data);
  },

  // 简历匹配
  matchResume(data) {
    return api.post('/ai/match', data);
  }
};

// 岗位 API
export const jobApi = {
  // 获取所有岗位
  getJobs() {
    return api.get('/jobs');
  },

  // 获取岗位详情
  getJobDetail(id) {
    return api.get(`/jobs/${id}`);
  }
}

export default api;