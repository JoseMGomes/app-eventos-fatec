import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { AppNavigationProp } from "../../../navigation/types";
import { COLORS } from "../../../styles/colors";
import { styles } from "./LoginScreen.styles";
import { authService } from "../../../services/authService";
import { saveToken } from "../../../utils/tokenSave";

type ViewState = "login" | "2fa" | "recovery" | "student" | "visitor";

const LoginScreen = () => {
  const navigation = useNavigation<AppNavigationProp>();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [viewState, setViewState] = useState<ViewState>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code2FA, setCode2FA] = useState("");
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [raAluno, setRaAluno] = useState("");
  const [emailUsuario, setEmailUsuario] = useState("");
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const switchViewAnimada = (novaView: ViewState) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setViewState(novaView);
      slideAnim.setValue(20);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleAcessoLocal = async (tipo: "ALUNO" | "VISITANTE") => {
    if (
      !nomeUsuario.trim() ||
      !emailUsuario.trim() ||
      (tipo === "ALUNO" && !raAluno.trim())
    ) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
      return;
    }

    setIsLoading(true);
    const perfil = {
      nome: nomeUsuario.trim(),
      email: emailUsuario.trim().toLowerCase(),
      ra: tipo === "ALUNO" ? raAluno.trim() : null,
      instituicao: tipo === "VISITANTE" ? "Visitante Externo" : "FATEC",
      tipo: tipo,
    };

    try {
      await SecureStore.setItemAsync("perfil_aluno", JSON.stringify(perfil));
      setIsLoading(false);
      navigation.replace("AlunoTabs" as any);
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Erro", "Falha ao criar passaporte local.");
    }
  };

  const handleAcessarAdmin = async () => {
    if (!email.includes("@") || !password) {
      Alert.alert("Erro", "Por favor, preencha o e-mail e a senha.");
      return;
    }

    setIsLoading(true);
    const emailFormatado = email.trim().toLowerCase();
    const senhaFormatada = password.trim();

    try {
      await authService.getCSRF();
      const response = await authService.requestLogin(
        emailFormatado,
        senhaFormatada,
      );
      setIsLoading(false);
      switchViewAnimada("2fa");
    } catch (error: any) {
      setIsLoading(false);
      const mensagemErro =
        error.response?.data?.message ||
        error.message ||
        "Erro de conexão com o servidor.";
      Alert.alert(
        "Acesso Negado",
        `Não foi possível entrar.\n\nDetalhe: ${mensagemErro}`,
      );
    }
  };

  const handleVerificarCodigo = async () => {
    if (code2FA.length < 6) {
      Alert.alert("Erro", "O código deve conter 6 dígitos.");
      return;
    }
    setIsLoading(true);
    try {
      await authService.getCSRF();
      const response = await authService.login(code2FA);
      if (response.data && response.data.token) {
        await saveToken(response.data.token);
      }
      setIsLoading(false);
      navigation.replace("MainTabs");
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert(
        "Erro na Validação",
        error.response?.data?.message || "Código inválido.",
      );
    }
  };

  const renderFormContent = () => {
    if (viewState === "student") {
      return (
        <>
          <Text style={styles.cardTitle}>Acesso do Aluno</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="account-outline"
              size={20}
              color={COLORS.textoSecundario}
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Nome Completo"
              value={nomeUsuario}
              onChangeText={setNomeUsuario}
            />
          </View>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="card-account-details-outline"
              size={20}
              color={COLORS.textoSecundario}
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Seu RA"
              value={raAluno}
              onChangeText={setRaAluno}
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="email-outline"
              size={20}
              color={COLORS.textoSecundario}
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="E-mail Institucional"
              value={emailUsuario}
              onChangeText={setEmailUsuario}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => handleAcessoLocal("ALUNO")}
          >
            <Text style={styles.mainButtonText}>Acessar como Aluno</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => switchViewAnimada("visitor")}
          >
            <Text style={styles.secondaryButtonText}>
              Não sou aluno (Visitante)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => switchViewAnimada("login")}
          >
            <Text style={styles.secondaryButtonText}>
              Sou Professor / Coordenador
            </Text>
          </TouchableOpacity>
        </>
      );
    }

    if (viewState === "visitor") {
      return (
        <>
          <Text style={styles.cardTitle}>Acesso Visitante</Text>
          <Text style={styles.codeHelperText}>
            Para público externo e convidados.
          </Text>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="account-outline"
              size={20}
              color={COLORS.textoSecundario}
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Nome Completo"
              value={nomeUsuario}
              onChangeText={setNomeUsuario}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="email-outline"
              size={20}
              color={COLORS.textoSecundario}
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="E-mail para contato"
              value={emailUsuario}
              onChangeText={(text) =>
                setEmailUsuario(text.trim().toLowerCase())
              }
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => handleAcessoLocal("VISITANTE")}
          >
            <Text style={styles.mainButtonText}>Acessar Eventos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => switchViewAnimada("student")}
          >
            <Text style={styles.secondaryButtonText}>
              Voltar para Acesso Aluno
            </Text>
          </TouchableOpacity>
        </>
      );
    }

    if (viewState === "login") {
      return (
        <>
          <Text style={styles.cardTitle}>Área do Colaborador</Text>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="email-outline"
              size={20}
              color={COLORS.textoSecundario}
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="E-mail Institucional"
              value={email}
              onChangeText={(text) => setEmail(text.trim().toLowerCase())}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="lock-outline"
              size={20}
              color={COLORS.textoSecundario}
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              value={password}
              onChangeText={(text) => setPassword(text.trim())}
              secureTextEntry={!showPassword}
              editable={!isLoading}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={{ padding: 5 }}
              activeOpacity={0.7}
              disabled={isLoading}
            >
              <MaterialCommunityIcons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color={COLORS.textoSecundario}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => switchViewAnimada("recovery")}
            disabled={isLoading}
          >
            <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mainButton}
            onPress={handleAcessarAdmin}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.branco} />
            ) : (
              <Text style={styles.mainButtonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => switchViewAnimada("student")}
            disabled={isLoading}
          >
            <Text style={styles.secondaryButtonText}>
              Voltar para Acesso de Aluno
            </Text>
          </TouchableOpacity>
        </>
      );
    }

    if (viewState === "2fa") {
      return (
        <>
          <Text style={styles.cardTitle}>Verificação de Segurança</Text>
          <Text style={styles.codeHelperText}>
            Enviamos um código de 6 dígitos para o e-mail:{"\n"}
            <Text style={{ fontWeight: "bold" }}>{email}</Text>
          </Text>

          <View style={styles.otpContainer}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <View
                key={index}
                style={[
                  styles.otpBox,
                  code2FA.length === index && styles.otpBoxActive,
                ]}
              >
                <Text style={styles.otpText}>{code2FA[index] || ""}</Text>
              </View>
            ))}
            <TextInput
              style={styles.hiddenInput}
              value={code2FA}
              onChangeText={setCode2FA}
              keyboardType="number-pad"
              maxLength={6}
              caretHidden={true}
              autoFocus={true}
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity
            style={styles.mainButton}
            onPress={handleVerificarCodigo}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.branco} />
            ) : (
              <Text style={styles.mainButtonText}>Validar Código</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => switchViewAnimada("login")}
            disabled={isLoading}
          >
            <Text style={styles.secondaryButtonText}>Voltar</Text>
          </TouchableOpacity>
        </>
      );
    }

    if (viewState === "recovery") {
      return (
        <>
          <Text style={styles.cardTitle}>Recuperar Senha</Text>
          <Text style={styles.codeHelperText}>
            Digite o seu e-mail institucional. Enviaremos as instruções para
            você criar uma nova senha.
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
              placeholder="E-mail Institucional"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => {
              Alert.alert("E-mail Enviado!", "Verifique sua caixa de entrada.");
              switchViewAnimada("login");
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.mainButtonText}>Enviar Instruções</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => switchViewAnimada("login")}
          >
            <Text style={styles.secondaryButtonText}>Voltar para o Login</Text>
          </TouchableOpacity>
        </>
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.topBackground}>
        <View style={styles.logoPlaceholder}>
          <MaterialCommunityIcons
            name="calendar-check"
            size={70}
            color={COLORS.branco}
          />
          <Text style={styles.title}>Fatec Eventos</Text>
          <Text style={{ color: "#FFF", opacity: 0.8 }}>
            Seja muito bem-vindo.
          </Text>
        </View>
      </View>
      <View style={styles.formContainer}>
        <Animated.View
          style={[
            styles.card,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {renderFormContent()}
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
