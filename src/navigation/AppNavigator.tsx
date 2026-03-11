import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/Login/LoginScreen";
import ScannerScreen from "../screens/Scanner/ScannerScreen";
import EventDetailScreen from "../screens/EventDetail/EventDetailScreen";
import AttendanceListScreen from "../screens/AttendanceList/AttendanceListScreen";
import TabNavigator from "./TabNavigator";
import CreateEventScreen from "../screens/CreateEvent/CreateEventScreen";
import ManageUsersScreen from "../screens/ManageUsers/ManageUsersScreen";
import ManageCategoriesScreen from "../screens/ManageCategories/ManageCategoriesScreen";
import ManageCoursesScreen from "../screens/ManageCourses/ManageCoursesScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
