export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

async function request(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  };

  const token = localStorage.getItem('eduxcel_token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

export const api = {
  auth: {
    login: (email: string, password: string, role: string) =>
      request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password, role }) }),
    register: (email: string, password: string, name: string, role: string, department?: string) =>
      request('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name, role, department }) }),
    googleLogin: (accessToken: string, role: string) =>
      request('/auth/google', { method: 'POST', body: JSON.stringify({ accessToken, role }) }),
    getProfile: () => request('/auth/profile'),
    getStreak: () => request('/auth/streak'),
    onboard: (payload: any) => request('/auth/onboard', { method: 'PUT', body: JSON.stringify(payload) }),
  },

  student: {
    getDashboard: () => request('/students/dashboard'),
    getSubjects: () => request('/students/subjects'),
    getAssignments: () => request('/students/assignments'),
    getHistory: () => request('/students/history'),
    getRecoveryPlan: () => request('/students/recovery'),
    runPrediction: (data: any) => request('/predictions/run', { method: 'POST', body: JSON.stringify(data) }),
  },

  faculty: {
    getDashboard: () => request('/faculty/dashboard'),
    getAllStudents: (filters?: Record<string, string>) => {
      const params = new URLSearchParams(filters as any).toString();
      return request(`/faculty/students${params ? `?${params}` : ''}`);
    },
    getStudentDetail: (id: string) => request(`/faculty/students/${id}`),
    updateMarks: (id: string, data: any) => request(`/faculty/students/${id}/marks`, { method: 'POST', body: JSON.stringify(data) }),
    updateAttendance: (id: string, data: any) => request(`/faculty/students/${id}/attendance`, { method: 'POST', body: JSON.stringify(data) }),
    getAnalytics: () => request('/faculty/analytics'),
    createAssignment: (data: any) => request('/faculty/assignments', { method: 'POST', body: JSON.stringify(data) }),
    getAssignments: () => request('/faculty/assignments'),
  },

  admin: {
    getOverview: () => request('/admin/overview'),
    getAllUsers: () => request('/admin/users'),
    getStats: () => request('/admin/stats'),
  },

  predictions: {
    run: (data: any) => request('/predictions/run', { method: 'POST', body: JSON.stringify(data) }),
    getHistory: () => request('/predictions/history'),
    whatIf: (data: any) => request('/predictions/what-if', { method: 'POST', body: JSON.stringify(data) }),
    getRecommendations: (subjects: string[], userData?: any) =>
      request('/predictions/recommend', { method: 'POST', body: JSON.stringify({ subjects, ...userData }) }),
    getRecoveryPlan: () => request('/predictions/recovery-plan'),
  },

  chat: {
    send: (message: string, context: string, history: any[]) =>
      request('/chat', { method: 'POST', body: JSON.stringify({ message, context, history }) }),
  },
};

export default api;
