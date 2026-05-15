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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "../../../validations/schemas";

const RegisterScreen = () => {
  const navigation = useNavigation<AppNavigationProp>();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      tipoUsuario: "ALUNO",
      nome: "",
      email: "",
      documento: "",
    },
  });

  const tipoUsuario = watch("tipoUsuario");

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    title: string;
    message: string;
    tipo: "sucesso" | "erro" | "aviso";
    onCloseAcao?: () => void;
  }>({ title: "", message: "", tipo: "aviso" });

  const mostrarAlerta = (
    title: string,
    message: string,
    tipo: "sucesso" | "erro" | "aviso",
    onCloseAcao?: () => void,
  ) => {
    setAlertConfig({ title, message, tipo, onCloseAcao });
    setAlertVisible(true);
  };

  const onRegisterValido = (data: RegisterFormData) => {
    mostrarAlerta(
      "Sucesso!",
      `Cadastro de ${data.tipoUsuario.toLowerCase()} realizado com sucesso! Verifique seu e-mail.`,
      "sucesso",
      () => navigation.navigate("Login"),
    );
  };

  const mudarTipoUsuario = (novoTipo: "ALUNO" | "EXTERNO") => {
    setValue("tipoUsuario", novoTipo);
    setValue("documento", "");
    setValue("email", "");
    clearErrors();
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
              onPress={() => mudarTipoUsuario("ALUNO")}
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
              onPress={() => mudarTipoUsuario("EXTERNO")}
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

          <View style={{ marginBottom: 15 }}>
            <Text style={styles.label}>Nome Completo</Text>
            <View
              style={[
                styles.inputContainer,
                errors.nome && {
                  borderColor: COLORS.vermelhoPrincipal,
                  borderWidth: 1,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="account-outline"
                size={20}
                color={COLORS.textoSecundario}
                style={styles.icon}
              />
              <Controller
                control={control}
                name="nome"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                    placeholder="Digite seu nome"
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                  />
                )}
              />
            </View>
            {errors.nome && (
              <Text
                style={{
                  color: COLORS.vermelhoPrincipal,
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                {errors.nome.message}
              </Text>
            )}
          </View>

          <View style={{ marginBottom: 15 }}>
            <Text style={styles.label}>
              {tipoUsuario === "ALUNO"
                ? "E-mail Institucional"
                : "E-mail Pessoal"}
            </Text>
            <View
              style={[
                styles.inputContainer,
                errors.email && {
                  borderColor: COLORS.vermelhoPrincipal,
                  borderWidth: 1,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="email-outline"
                size={20}
                color={COLORS.textoSecundario}
                style={styles.icon}
              />
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor="#999"
                    placeholder={
                      tipoUsuario === "ALUNO"
                        ? "aluno@fatec.sp.gov.br"
                        : "seuemail@gmail.com"
                    }
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                )}
              />
            </View>
            {errors.email && (
              <Text
                style={{
                  color: COLORS.vermelhoPrincipal,
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                {errors.email.message}
              </Text>
            )}
          </View>

          <View style={{ marginBottom: 15 }}>
            <Text style={styles.label}>
              {tipoUsuario === "ALUNO" ? "RA (Registro do Aluno)" : "CPF"}
            </Text>
            <View
              style={[
                styles.inputContainer,
                errors.documento && {
                  borderColor: COLORS.vermelhoPrincipal,
                  borderWidth: 1,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="card-account-details-outline"
                size={20}
                color={COLORS.textoSecundario}
                style={styles.icon}
              />
              <Controller
                control={control}
                name="documento"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor="#999"
                    placeholder={
                      tipoUsuario === "ALUNO"
                        ? "Apenas números do RA"
                        : "Apenas números do CPF"
                    }
                    keyboardType="number-pad"
                  />
                )}
              />
            </View>
            {errors.documento && (
              <Text
                style={{
                  color: COLORS.vermelhoPrincipal,
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                {errors.documento.message}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.mainButton}
            onPress={handleSubmit(onRegisterValido)}
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
          if (alertConfig.onCloseAcao) alertConfig.onCloseAcao();
        }}
      />
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
