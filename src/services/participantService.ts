import { api } from '../factory/api';

export const participantService = {
  createParticipant: async (eventId: string, userId: string) => {
    return await api.post('/participants/create', { eventId, userId });
  },

  updatePresence: async (participantId: string, isPresent: boolean) => {
    return await api.patch(`/participants/patch/${participantId}`, { isPresent });
  }
};