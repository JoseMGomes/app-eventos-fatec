import React from 'react';
import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const navigation = useNavigation<any>(); 

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Tela de Login
      </Text>
      <Button 
        title="Fazer Login" 
        onPress={() => navigation.replace('MainTabs')} 
      />
    </View>
  );
}