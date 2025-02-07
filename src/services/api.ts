import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const userApi = {
  getProjects: async (params?: { status?: string; search?: string }) => {
    const response = await api.get('/projects', { params });
    return response.data;
  },

  createProject: async (data: {
    name: string;
    description: string;
    service_type: string;
    priority: string;
    category: string;
  }) => {
    const response = await api.post('/projects', data);
    return response.data;
  },

  getMessages: async (projectId: string) => {
    const response = await api.get(`/projects/${projectId}/messages`);
    return response.data;
  },

  sendMessage: async (projectId: string, content: string) => {
    const response = await api.post(`/projects/${projectId}/messages`, { content });
    return response.data;
  },

  uploadFile: async (projectId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/projects/${projectId}/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export const adminApi = {
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getUsers: async (params?: { role?: string; search?: string }) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  createUser: async (data: {
    name: string;
    email: string;
    password: string;
    role: string;
    school_name: string;
  }) => {
    const response = await api.post('/admin/users', data);
    return response.data;
  },

  updateUser: async (id: number, data: {
    name?: string;
    email?: string;
    role?: string;
    school_name?: string;
    status?: string;
  }) => {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: number) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  getProjects: async (params?: { status?: string; search?: string }) => {
    const response = await api.get('/admin/projects', { params });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  }
};