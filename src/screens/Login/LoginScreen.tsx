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
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AppNavigationProp } from "../../navigation/types";
import { COLORS } from "../../styles/colors";
import { styles } from "./LoginScreen.styles";

type ViewState = "login" | "2fa" | "recovery";

const USUARIOS_TESTE: any = {
  "prof@fatec.sp.gov.br": {
    senha: "123",
    tipo: "PROFESSOR",
    nome: "Professor",
  },
  "aluno@fatec.sp.gov.br": {
    senha: "123",
    tipo: "ALUNO",
    nome: "José Lucas",
  },
};

const LoginScreen = () => {
  const navigation = useNavigation<AppNavigationProp>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code2FA, setCode2FA] = useState("");

  const [viewState, setViewState] = useState<ViewState>("login");
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const getGreeting = () => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) return "Bom dia";
    if (hora >= 12 && hora < 18) return "Boa tarde";
    return "Boa noite";
  };

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

  const handleAcessar = () => {
    const emailFormatado = email.trim().toLowerCase();
    const usuarioBanco = USUARIOS_TESTE[emailFormatado];

    if (!usuarioBanco || usuarioBanco.senha !== password) {
      Alert.alert(
        "Acesso Negado",
        "Tente usar prof@fatec.sp.gov.br ou aluno@fatec.sp.gov.br com a senha 123.",
      );
      return;
    }

    switchViewAnimada("2fa");
  };

  const handleVerificarCodigo = () => {
    if (code2FA.length < 6) {
      Alert.alert("Erro", "O código deve conter 6 dígitos.");
      return;
    }

    const emailFormatado = email.trim().toLowerCase();
    const usuarioLogado = USUARIOS_TESTE[emailFormatado];

    if (usuarioLogado.tipo === "PROFESSOR") {
      navigation.replace("MainTabs");
    } else {
      navigation.replace("AlunoTabs" as any);
    }
  };

  const renderFormContent = () => {
    if (viewState === "login") {
      return (
        <>
          <Text style={styles.cardTitle}>Acesse sua conta</Text>

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
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
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
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity onPress={() => switchViewAnimada("recovery")}>
            <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mainButton}
            onPress={handleAcessar}
            activeOpacity={0.8}
          >
            <Text style={styles.mainButtonText}>Entrar</Text>
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
            />
          </View>

          <TouchableOpacity
            style={styles.mainButton}
            onPress={handleVerificarCodigo}
            activeOpacity={0.8}
          >
            <Text style={styles.mainButtonText}>Validar Código</Text>
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
              placeholderTextColor="#999"
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
          <Text style={styles.subtitle}>
            {getGreeting()}! Seja muito bem-vindo.
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
