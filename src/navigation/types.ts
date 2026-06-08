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
  presenceSecret?: string;
};

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  EventDetail: { evento: Evento };
  Scanner: { eventId: string; eventName: string }; 
  AttendanceList: { eventId: string | number }; 
  CreateEvent: undefined;
  ManageUsers: undefined;
  ManageCategories: undefined;
  ManageCourses: undefined;
  EditProfile: undefined;
  Settings: undefined;
  Register: undefined;
  CheckinAluno: { eventId: string | number; participantId: string | number };
};

export type AppNavigationProp = StackNavigationProp<RootStackParamList>;