import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AppNavigationProp } from "../../../navigation/types";
import { COLORS } from "../../../styles/colors";
import { styles } from "./RegisterScreen.styles";
import CustomAlert from "../../../components/CustomAlert";

type TipoUsuario = "ALUNO" | "EXTERNO";

const RegisterScreen = () => {
  const navigation = useNavigation<AppNavigationProp>();
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>("ALUNO");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [documento, setDocumento] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    title: string;
    message: string;
    tipo: "sucesso" | "erro" | "aviso";
    onCloseAcao?: () => void;
  }>({
    title: "",
    message: "",
    tipo: "aviso",
  });

  const mostrarAlerta = (
    title: string,
    message: string,
    tipo: "sucesso" | "erro" | "aviso",
    onCloseAcao?: () => void,
  ) => {
    setAlertConfig({ title, message, tipo, onCloseAcao });
    setAlertVisible(true);
  };

  const handleRegister = () => {
    if (!nome.trim() || !email.trim() || !documento.trim()) {
      mostrarAlerta(
        "Campos Obrigatórios",
        "Por favor, preencha todos os campos para criar sua conta.",
        "aviso",
      );
      return;
    }

    if (
      tipoUsuario === "ALUNO" &&
      !email.toLowerCase().includes("@fatec.sp.gov.br")
    ) {
      mostrarAlerta(
        "E-mail Inválido",
        "Para cadastro de aluno, utilize o seu e-mail @fatec.sp.gov.br",
        "erro",
      );
      return;
    }
    mostrarAlerta(
      "Sucesso!",
      `Cadastro de ${tipoUsuario.toLowerCase()} realizado com sucesso! Verifique seu e-mail.`,
      "sucesso",
      () => navigation.navigate("Login"),
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <View style={styles.header}>
        <MaterialCommunityIcons
          name="account-plus-outline"
          size={50}
          color={COLORS.branco}
        />
        <Text style={styles.headerTitle}>Criar Conta</Text>
        <Text style={styles.headerSubtitle}>
          Junte-se à plataforma de eventos da Fatec
        </Text>
      </View>

      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                tipoUsuario === "ALUNO" && styles.toggleButtonActive,
              ]}
              onPress={() => {
                setTipoUsuario("ALUNO");
                setDocumento("");
                setEmail("");
              }}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.toggleText,
                  tipoUsuario === "ALUNO" && styles.toggleTextActive,
                ]}
              >
                Sou Aluno Fatec
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                tipoUsuario === "EXTERNO" && styles.toggleButtonActive,
              ]}
              onPress={() => {
                setTipoUsuario("EXTERNO");
                setDocumento("");
                setEmail("");
              }}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.toggleText,
                  tipoUsuario === "EXTERNO" && styles.toggleTextActive,
                ]}
              >
                Público Externo
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome Completo</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="account-outline"
                size={20}
                color={COLORS.textoSecundario}
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                value={nome}
                onChangeText={setNome}
                placeholder="Digite seu nome"
                placeholderTextColor="#999"
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {tipoUsuario === "ALUNO"
                ? "E-mail Institucional"
                : "E-mail Pessoal"}
            </Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="email-outline"
                size={20}
                color={COLORS.textoSecundario}
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#999"
                placeholder={
                  tipoUsuario === "ALUNO"
                    ? "aluno@fatec.sp.gov.br"
                    : "seuemail@gmail.com"
                }
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {tipoUsuario === "ALUNO" ? "RA (Registro do Aluno)" : "CPF"}
            </Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="card-account-details-outline"
                size={20}
                color={COLORS.textoSecundario}
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                value={documento}
                onChangeText={setDocumento}
                placeholderTextColor="#999"
                placeholder={
                  tipoUsuario === "ALUNO"
                    ? "Apenas números do RA"
                    : "Apenas números do CPF"
                }
                keyboardType="number-pad"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.mainButton}
            onPress={handleRegister}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="check"
              size={20}
              color={COLORS.branco}
            />
            <Text style={styles.mainButtonText}>Finalizar Cadastro</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>
              Já tenho conta. Fazer Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        tipo={alertConfig.tipo}
        onClose={() => {
          setAlertVisible(false);
          if (alertConfig.onCloseAcao) {
            alertConfig.onCloseAcao();
          }
        }}
      />
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
