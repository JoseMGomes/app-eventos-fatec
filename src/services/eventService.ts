import { api } from "../factory/api";
import { authService } from "./authService";

export const eventService = {
  getPublicEvents: async () => {
    return await api.get('/events/publicAllEvents');
  },

  getAllAdminEvents: async () => {
    try {
      return await api.get("/events");
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        await authService.getMe();
        await authService.getCSRF();
        return await api.get("/events");
      }
      throw error;
    }
  },

  createEvent: async (formData: FormData) => {
    await authService.getCSRF();
    return await api.post("/events/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  updateEvent: async (id: string | number, formData: FormData) => {
    await authService.getCSRF();
    return await api.patch(`/events/patch/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  deleteEvent: async (id: string | number) => {
    await authService.getCSRF();
    return await api.delete(`/events/delete/${id}`);
  },

  getAvailabilityDates: async (locationId: number | string) => {
    return await api.get(`/events/availability/dates?locationId=${locationId}`);
  },

  getAvailabilityTimes: async (locationId: number | string, date: string) => {
    return await api.get(
      `/events/availability/times?locationId=${locationId}&date=${date}`,
    );
  },
};
