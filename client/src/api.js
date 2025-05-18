import axios from 'axios';

const api = axios.create({
  //baseURL: 'http://localhost:8080',
  baseURL: 'https://gateway-97.up.railway.app',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/auth/signin', { username, password });
    if (response.data.token) {
      return response.data;
    }
    throw new Error(response.data.error || 'Login failed');
  },

  register: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    if (typeof response.data === 'string' || response.data.error) {
      return { success: !response.data.error };
    }
    throw new Error('Unexpected response format');
  }
};

export const bookAPI = {
  getAll: () => api.get('/books'),
  getById: (id) => api.get(`/books/${id}`),
  create: (bookData) => api.post('/books', bookData),
  update: (id, bookData) => api.put(`/books/${id}`, bookData),
  delete: (id) => api.delete(`/books/${id}`)
};

export const shelfAPI = {
  getAll: () => api.get('/shelfs'),
  create: (shelfData) => api.post('/shelfs', shelfData),
  getById: (id) => api.get(`/shelfs/${id}`),
  update: (id, shelfData) => api.put(`/shelfs/${id}`, shelfData),
  delete: (id) => api.delete(`/shelfs/${id}`),
  addBook: (shelfId, bookId) => api.post(`/shelfs/${shelfId}/books/${bookId}`),
  getBooks: (shelfId) => api.get(`/shelfs/${shelfId}/books`),
  removeBook: (shelfId, bookId) => api.delete(`/shelfs/${shelfId}/books/${bookId}`),
  getPublicShelves: () => api.get('/shelfs/public')
};
