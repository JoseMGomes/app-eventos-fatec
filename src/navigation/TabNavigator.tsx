import React, { useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, Platform, Animated } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../styles/colors';
import { useNavigation } from '@react-navigation/native';
import { AppNavigationProp } from './types';
import HomeScreen from '../screens/Home/HomeScreen';
import AdminDashboardScreen from '../screens/Admin/AdminDashboardScreen';

type AnimatedIconProps = {
  focused: boolean;
  name: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
  size: number;
  label: string;
};

const AnimatedTabBarIcon = ({ focused, name, color, size, label }: AnimatedIconProps) => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: focused ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15] 
  });

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -4] 
  });

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', minWidth: 80 }}>
      <Animated.View style={{ transform: [{ scale }, { translateY }] }}>
        <MaterialCommunityIcons name={name} size={size} color={color} />
      </Animated.View>
      
      <Text 
        numberOfLines={1}
        adjustsFontSizeToFit
        style={{ 
          color: color, 
          fontSize: 10, 
          fontWeight: focused ? 'bold' : 'normal',
          marginTop: 2,
          textAlign: 'center'
        }}
      >
        {label}
      </Text>

      {focused && (
        <View 
          style={{
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: COLORS.vermelhoPrincipal,
            marginTop: 4,
          }} 
        />
      )}
    </View>
  );
};

const ProfileScreen = () => {
  const navigation = useNavigation<AppNavigationProp>();
  return (
    <View style={styles.center}>
      <MaterialCommunityIcons name="account-circle" size={80} color={COLORS.textoSecundario} />
      <Text style={styles.profileName}>Administrador</Text>
      <Text style={styles.profileEmail}>admin@fatec.sp.gov.br</Text>
      
      <View style={{ marginTop: 30, width: '100%', paddingHorizontal: 40 }}>
        <Button 
          title="Sair do Sistema" 
          color={COLORS.vermelhoPrincipal} 
          onPress={() => {
              navigation.reset({index: 0, routes:[{name: 'Login'}]})
          }} 
        />
      </View>
    </View>
  );
};

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, 
        tabBarActiveTintColor: COLORS.vermelhoPrincipal,
        tabBarInactiveTintColor: COLORS.textoSecundario,
        tabBarStyle: { 
          backgroundColor: COLORS.branco,
          borderTopWidth: 0,
          elevation: 10,
          shadowOpacity: 0.1,
          shadowRadius: 10,
          height: Platform.OS === "android" ? 110 : 90, 
          paddingBottom: Platform.OS === "android" ? 30 : 20,
          paddingTop: 15, 
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: 'absolute',
          bottom: 0,
        },
      }}
    >
      <Tab.Screen 
        name="Eventos" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <AnimatedTabBarIcon 
              focused={focused} 
              name={focused ? "calendar-month" : "calendar-month-outline"} 
              color={color} 
              size={24} 
              label="Eventos"
            />
          ),
        }}
      />

      <Tab.Screen 
        name="Gestão" 
        component={AdminDashboardScreen} 
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <AnimatedTabBarIcon 
              focused={focused} 
              name={focused ? "view-dashboard" : "view-dashboard-outline"} 
              color={color} 
              size={24}
              label="Gestão"
            />
          ),
        }}
      />

      <Tab.Screen 
        name="Perfil" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <AnimatedTabBarIcon 
              focused={focused} 
              name={focused ? "account" : "account-outline"} 
              color={color} 
              size={24}
              label="Perfil"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.cinzaFundo },
  profileName: { fontSize: 22, fontWeight: 'bold', color: COLORS.textoPrincipal, marginTop: 10 },
  profileEmail: { fontSize: 16, color: COLORS.textoSecundario, marginBottom: 20 }
});

export default TabNavigator;