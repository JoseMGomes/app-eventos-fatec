import { api } from "../factory/api";
import { authService } from "./authService";

export const courseService = {
  getAll: async () => {
    try {
      return await api.get("/courses");
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        await authService.getCSRF();
        return await api.get("/courses");
      }
      throw error;
    }
  },

  create: async (dados: { name: string }) => {
    await authService.getCSRF();
    return await api.post("/courses/create", dados);
  },

  update: async (id: string | number, dados: { name: string }) => {
    await authService.getCSRF();
    return await api.patch(`/courses/patch/${id}`, dados);
  },

  delete: async (id: string | number) => {
    await authService.getCSRF();
    return await api.delete(`/courses/delete/${id}`);
  },
};
