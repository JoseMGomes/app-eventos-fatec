import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/Auth/Login/LoginScreen";
import ScannerScreen from "../screens/Professor/Scanner/ScannerScreen";
import EventDetailScreen from "../screens/Shared/EventDetail/EventDetailScreen";
import AttendanceListScreen from "../screens/Professor/AttendanceList/AttendanceListScreen";
import TabNavigator from "./TabNavigator";
import CreateEventScreen from "../screens/Professor/CreateEvent/CreateEventScreen";
import ManageUsersScreen from "../screens/Professor/Admin/ManageUsers/ManageUsersScreen";
import ManageCategoriesScreen from "../screens/Professor/Admin/ManageCategories/ManageCategoriesScreen";
import ManageCoursesScreen from "../screens/Professor/Admin/ManageCourses/ManageCoursesScreen";
import EditProfileScreen from "../screens/Shared/EditProfile/EditProfileScreen";
import SettingsScreen from "../screens/Shared/Settings/SettingsScreen";
import AlunoTabNavigator from "./AlunoTabNavigator";
import CheckinAlunoScreen from "../screens/Aluno/CheckinAluno/CheckinAlunoScreen";
import RegisterScreen from "../screens/Auth/Register/RegisterScreen";
import AlunoEventoDetalhesScreen from "../screens/Aluno/AlunoEventDetail/AlunoEventoDetalhesScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="AlunoTabs"
          component={AlunoTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Scanner"
          component={ScannerScreen}
          options={{ title: "Validar Presença" }}
        />
        <Stack.Screen
          name="EventDetail"
          component={EventDetailScreen}
          options={{ title: "Gerenciar Evento" }}
        />
        <Stack.Screen
          name="AttendanceList"
          component={AttendanceListScreen}
          options={{ title: "Lista de Presença" }}
        />
        <Stack.Screen
          name="CreateEvent"
          component={CreateEventScreen}
          options={{ title: "Criar Novo Evento", headerShown: true }}
        />
        <Stack.Screen
          name="ManageUsers"
          component={ManageUsersScreen}
          options={{
            headerShown: true,
            title: "Gerenciar Usuários",
          }}
        />
        <Stack.Screen
          name="ManageCategories"
          component={ManageCategoriesScreen}
          options={{
            headerShown: true,
            title: "Gerenciar Categorias",
          }}
        />
        <Stack.Screen
          name="ManageCourses"
          component={ManageCoursesScreen}
          options={{
            headerShown: true,
            title: "Gerenciar Cursos",
          }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{
            headerShown: true,
            title: "Gerenciar perfil",
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            headerShown: true,
            title: "Configurações",
          }}
        />
        <Stack.Screen
          name="CheckinAluno"
          component={CheckinAlunoScreen}
          options={{
            title: "Validação de Presença",
          }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AlunoEventoDetalhes"
          component={AlunoEventoDetalhesScreen}
          options={{ title: "Detalhes do Evento" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
