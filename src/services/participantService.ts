import { api } from "../factory/api";
import { authService } from "./authService";

export const participantService = {
  getByEventId: async (eventId: string | number) => {
    try {
      return await api.get(`/participants/event/${eventId}`);
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        await authService.getMe();
        await authService.getCSRF();
        return await api.get(`/participants/event/${eventId}`);
      }
      throw error;
    }
  },

  togglePresence: async (id: string | number, isPresent: boolean) => {
    await authService.getCSRF();
    return await api.patch(`/participants/patch/${id}`, { isPresent });
  },
};
