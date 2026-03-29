import { api } from '../factory/api';

export const eventService = {
  getPublicEvents: async () => {
    return await api.get('/publicAllEvents');
  },

  getAllAdminEvents: async () => {
    return await api.get('/events');
  },

  createEvent: async (eventData: any) => {
    return await api.post('/events/create', eventData);
  },

  updateEvent: async (id: string, eventData: any) => {
    return await api.patch(`/events/patch/${id}`, eventData);
  },

  deleteEvent: async (id: string) => {
    return await api.delete(`/events/delete/${id}`);
  }
};