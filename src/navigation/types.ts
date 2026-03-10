import { StackNavigationProp } from "@react-navigation/stack";

export type Evento = {
  id: string;
  nome: string;
  data: string;
  local: string;
  palestrante: string;
  imagemUrl: string;
  descricao: string;
  eventoRestrito: boolean;
  curso: string;
  semestre: string;
};

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  EventDetail: { evento: Evento };
  Scanner: { eventId: string; eventName: string };
  AttendanceList: { evento: Evento };
  CreateEvent: undefined;
  ManageUsers: undefined;
};

export type AppNavigationProp = StackNavigationProp<RootStackParamList>;
