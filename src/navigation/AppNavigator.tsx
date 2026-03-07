import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/Login/LoginScreen';
import ScannerScreen from '../screens/Scanner/ScannerScreen';
import EventDetailScreen from '../screens/EventDetail/EventDetailScreen';
import AttendanceListScreen from '../screens/AttendanceList/AttendanceListScreen';
import TabNavigator from './TabNavigator'; 

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
          options={{ title: 'Validar Presença' }} 
        />
        <Stack.Screen 
          name="EventDetail" 
          component={EventDetailScreen} 
          options={{ title: 'Gerenciar Evento' }} 
        />
        <Stack.Screen 
          name="AttendanceList" 
          component={AttendanceListScreen} 
          options={{ title: 'Lista de Presença' }} 
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;