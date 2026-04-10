import { api } from '../factory/api';
import { authService } from './authService';

export const categoryService = {
  getAll: async () => {
    return await api.get('/categories');
  },

  create: async (name: string) => {
    await authService.getCSRF();
    return await api.post('/categories/create', { name });
  },

  update: async (id: string | number, name: string) => {
    await authService.getCSRF();
    return await api.patch(`/categories/patch/${id}`, { name });
  },

  delete: async (id: string | number) => {
    await authService.getCSRF();
    return await api.delete(`/categories/delete/${id}`);
  }
};