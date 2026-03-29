import { api } from '../factory/api';

export const authService = {
  requestLogin: async (email: string) => {
    return await api.post('/auth/request-login', { email });
  },

  login: async (email: string, code: string) => {
    return await api.post('/auth/login', { email, code });
  },

  getMe: async () => {
    return await api.get('/auth/me');
  },

  logout: async () => {
    return await api.post('/auth/logout');
  }
};