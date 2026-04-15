import { api } from "../factory/api";
import { authService } from "./authService";

export const userService = {
  getAll: async () => {
    return await api.get("/users");
  },

  create: async (dados: any) => {
    await authService.getCSRF();
    return await api.post("/users/create", dados);
  },

  update: async (id: string | number, dados: any) => {
    await authService.getCSRF();
    return await api.patch(`/users/patch/${id}`, dados);
  },

  delete: async (id: string | number) => {
    await authService.getCSRF();
    return await api.delete(`/users/delete/${id}`);
  },
};
