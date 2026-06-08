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

  createParticipant: async (data: {
    eventId: number;
    name: string;
    email: string;
    courseId?: number;
    semester?: string | null;
    ra?: string | null;
  }) => {
    await authService.getCSRF();
    return await api.post("/participants/create", data);
  },

  getParticipantsByEmail: async (email: string) => {
    return await api.get(`/participants/user/${email}`);
  },

  confirmPresenceWithSecret: async (
    eventId: string | number,
    participantId: string | number,
    presenceSecret: string,
  ) => {
    return await api.patch(
      `/events/${eventId}/participants/${participantId}/presence`,
      {
        presenceSecret: presenceSecret,
      },
    );
  },
};
