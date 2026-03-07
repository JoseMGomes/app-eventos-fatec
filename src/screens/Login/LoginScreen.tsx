import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { styles } from "./LoginScreen.styles";
import { RootStackParamList } from "../../navigation/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { COLORS } from "../../styles/colors";

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleLogin = () => {
    console.log("Tentando logar com:", email);
    navigation.reset({
      index: 0,
      routes: [{ name: "MainTabs" }],
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.vermelhoPrincipal} />
      <Text style={styles.titulo}>Fatec Itu</Text>
      <Text style={styles.subtitulo}>Dom Amaury Castanho</Text>

      <TextInput
        style={styles.input}
        placeholder="Email Institucional"
        placeholderTextColor={COLORS.placeholderText}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputSenha}
          placeholder="Senha"
          placeholderTextColor={COLORS.placeholderText}
          secureTextEntry={!mostrarSenha}
          value={senha}
          onChangeText={setSenha}
        />
        <TouchableOpacity
          style={styles.iconeOlho}
          onPress={() => setMostrarSenha(!mostrarSenha)}
        >
          <MaterialCommunityIcons
            name={mostrarSenha ? "eye-off" : "eye"}
            size={24}
            color={COLORS.placeholderText}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.botaoEntrar} onPress={handleLogin}>
        <Text style={styles.textoBotaoEntrar}>Entrar</Text>
      </TouchableOpacity>

      <Text style={styles.textoConta}>Acesso restrito a colaboradores</Text>
    </View>
  );
};

export default LoginScreen;
