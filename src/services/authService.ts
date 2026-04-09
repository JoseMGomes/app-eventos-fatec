import { api } from '../factory/api';

export const authService = {
  getCSRF: async () => {
    try {
      const response = await api.get('/csrf-token');
      const tokenRecebido = response.data.csrfToken; 
      
      if (tokenRecebido) {
        api.defaults.headers.common['X-CSRF-Token'] = tokenRecebido;
        api.defaults.headers.common['X-XSRF-TOKEN'] = tokenRecebido; 
      }
      return true;
    } catch (error) {
      console.warn("Erro ao buscar o token CSRF:", error);
      return false;
    }
  },

  requestLogin: async (email: string, password: string) => {
    return await api.post('/auth/request-login', { email, password });
  },

  login: async (code: string) => {
    return await api.post('/auth/login', { code });
  },

  getMe: async () => {
    return await api.get('/auth/me');
  },

  logout: async () => {
    return await api.post('/auth/logout');
  }
};