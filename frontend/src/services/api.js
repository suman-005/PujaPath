const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://pujapath-lt0c.onrender.com/api/v1';

const TOKEN_KEY = 'pujapath_access_token';
const USER_KEY = 'pujapath_user';

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
  getUser: () => {
    try {
      const u = localStorage.getItem(USER_KEY);
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  clearUser: () => localStorage.removeItem(USER_KEY),
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const token = authStorage.getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, { ...options, headers });
    if (response.status === 204) {
      return null;
    }
    const data = await response.json();
    if (!response.ok) {
      const errorMsg = data.detail || (typeof data === 'string' ? data : 'API request failed');
      throw new Error(errorMsg);
    }
    return data;
  } catch (err) {
    if (err instanceof TypeError && err.message.includes('fetch')) {
      throw new Error('Unable to reach server. Please check your network connection or server status.');
    }
    throw err;
  }
}

export const api = {
  // Auth
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: async (credentials) => {
    const data = await request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
    if (data.access_token) {
      authStorage.setToken(data.access_token);
      authStorage.setUser(data.user);
    }
    return data;
  },
  getCurrentUser: () => request('/auth/me'),
  logout: () => {
    authStorage.clear();
  },

  // Admin
  getAdminDashboard: () => request('/admin/dashboard'),
  getAdminUsers: (params = {}) => {
    const q = new URLSearchParams();
    if (params.page) q.append('page', params.page);
    if (params.pageSize) q.append('page_size', params.pageSize);
    if (params.role) q.append('role', params.role);
    return request(`/admin/users?${q.toString()}`);
  },
  updateUserRole: (id, role) =>
    request(`/admin/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    }),

  // Pujas (Public discovery + Admin mutations)
  getPujas: ({ search = '', area = '', theme = '', page = 1, pageSize = 20 } = {}) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (area) params.append('area', area);
    if (theme) params.append('theme', theme);
    params.append('page', page);
    params.append('page_size', pageSize);
    return request(`/pujas?${params.toString()}`);
  },
  getPujaById: (id) => request(`/pujas/${id}`),
  createPuja: (data) => request('/pujas', { method: 'POST', body: JSON.stringify(data) }),
  updatePuja: (id, data) => request(`/pujas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePuja: (id) => request(`/pujas/${id}`, { method: 'DELETE' }),

  // Gallery
  getPujaImages: (pujaId) => request(`/pujas/${pujaId}/images`),
  createPujaImage: (pujaId, data) => request(`/pujas/${pujaId}/images`, { method: 'POST', body: JSON.stringify(data) }),
  deleteImage: (id) => request(`/images/${id}`, { method: 'DELETE' }),

  // Themes
  getThemes: () => request('/themes'),
  createTheme: (data) => request('/themes', { method: 'POST', body: JSON.stringify(data) }),
  updateTheme: (id, data) => request(`/themes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTheme: (id) => request(`/themes/${id}`, { method: 'DELETE' }),

  // Emergency Contacts
  getEmergencyContacts: (category = '') => {
    const params = category ? `?category=${encodeURIComponent(category)}` : '';
    return request(`/emergency${params}`);
  },
  createEmergencyContact: (data) => request('/emergency', { method: 'POST', body: JSON.stringify(data) }),
  updateEmergencyContact: (id, data) => request(`/emergency/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEmergencyContact: (id) => request(`/emergency/${id}`, { method: 'DELETE' }),

  // Contact
  submitContact: (data) => request('/contact', { method: 'POST', body: JSON.stringify(data) }),

  // Reports
  submitReport: (data) => request('/reports', { method: 'POST', body: JSON.stringify(data) }),
  getReports: (status = '', page = 1) => {
    const q = new URLSearchParams();
    if (status) q.append('status', status);
    q.append('page', page);
    return request(`/reports?${q.toString()}`);
  },
  updateReport: (id, data) => request(`/reports/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Crowd Reports
  submitCrowdReport: (data) => request('/crowd-reports', { method: 'POST', body: JSON.stringify(data) }),
  getPujaCrowdReports: (pujaId) => request(`/pujas/${pujaId}/crowd-reports`),
};

export default api;

export const askAssistant = async (question) => {
  const res = await fetch(\/assistant/query\, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question })
  });
  if (!res.ok) throw new Error('Failed to query assistant');
  return res.json();
};
