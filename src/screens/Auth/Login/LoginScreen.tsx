import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppNavigationProp } from "../../../navigation/types";
import { COLORS } from "../../../styles/colors";
import { styles } from "./LoginScreen.styles";
import { authService } from "../../../services/authService";
import { saveToken } from "../../../utils/tokenSave";
import CustomAlert from "../../../components/CustomAlert";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  alunoAuthSchema,
  AlunoAuthFormData,
  visitanteAuthSchema,
  VisitanteAuthFormData,
  loginAdminSchema,
  LoginAdminFormData,
  recoverySchema,
  RecoveryFormData,
} from "../../../validations/schemas";

type ViewState = "login" | "2fa" | "recovery" | "student" | "visitor";

interface AlertConfigState {
  title: string;
  message: string;
  tipo: "sucesso" | "erro" | "aviso";
  onConfirm?: () => void;
  textoConfirmar?: string;
  textoCancelar?: string;
  onCloseAcao?: () => void;
}

const LoginScreen = () => {
  const navigation = useNavigation<AppNavigationProp>();
  const insets = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [viewState, setViewState] = useState<ViewState>("student");
  const [code2FA, setCode2FA] = useState("");

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const formAluno = useForm<AlunoAuthFormData>({
    resolver: zodResolver(alunoAuthSchema),
    defaultValues: { nomeUsuario: "", raAluno: "", emailUsuario: "" },
  });

  const formVisitante = useForm<VisitanteAuthFormData>({
    resolver: zodResolver(visitanteAuthSchema),
    defaultValues: { nomeUsuario: "", emailUsuario: "" },
  });

  const formLogin = useForm<LoginAdminFormData>({
    resolver: zodResolver(loginAdminSchema),
    defaultValues: { email: "", password: "" },
  });

  const formRecovery = useForm<RecoveryFormData>({
    resolver: zodResolver(recoverySchema),
    defaultValues: { email: "" },
  });

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<AlertConfigState>({
    title: "",
    message: "",
    tipo: "aviso",
  });

  const mostrarAlerta = (
    title: string,
    message: string,
    tipo: "sucesso" | "erro" | "aviso",
    onConfirm?: () => void,
    textoConfirmar = "OK",
    textoCancelar = "Cancelar",
  ) => {
    setAlertConfig({
      title,
      message,
      tipo,
      onConfirm,
      textoConfirmar,
      textoCancelar,
    });
    setAlertVisible(true);
  };

  useEffect(() => {
    const verificarSessaoAtiva = async () => {
      try {
        const sessaoAluno =
          await SecureStore.getItemAsync("sessao_aluno_ativa");
        if (sessaoAluno === "true") {
          navigation.replace("AlunoTabs" as any);
        }
      } catch (error) {
        console.warn("Erro ao verificar sessão", error);
      }
    };
    verificarSessaoAtiva();
  }, []);

  const switchViewAnimada = (novaView: ViewState) => {
    if (novaView === "login") setShowPassword(false);

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

  const handleVerDadosSalvos = async () => {
    try {
      const perfilStr = await SecureStore.getItemAsync("perfil_aluno");
      if (perfilStr) {
        const perfil = JSON.parse(perfilStr);

        let mensagem = "";
        if (perfil.tipo === "ALUNO") {
          mensagem = `O seu aparelho está vinculado ao Aluno:\n\nNome: ${perfil.nome}\nRA: ${perfil.ra}\nE-mail: ${perfil.email}`;
        } else {
          mensagem = `O seu aparelho está vinculado ao Visitante:\n\nNome: ${perfil.nome}\nE-mail: ${perfil.email}`;
        }

        mensagem +=
          "\n\nDeseja limpar este vínculo para entrar com uma conta nova ou diferente?";

        mostrarAlerta(
          "Conta Vinculada",
          mensagem,
          "aviso",
          async () => {
            await SecureStore.deleteItemAsync("perfil_aluno");
            setAlertVisible(false);
            setTimeout(() => {
              setAlertConfig({
                title: "Feito!",
                message:
                  "Os dados foram apagados. Você já pode registrar uma nova conta.",
                tipo: "sucesso",
              });
              setAlertVisible(true);
            }, 400);
          },
          "Sim, Limpar Dados",
          "Fechar",
        );
      } else {
        setAlertConfig({
          title: "Tudo limpo",
          message:
            "Não existe nenhuma conta vinculada a este aparelho no momento.",
          tipo: "sucesso",
        });
        setAlertVisible(true);
      }
    } catch (error) {
      setAlertConfig({
        title: "Erro",
        message: "Falha ao ler os dados salvos.",
        tipo: "erro",
      });
      setAlertVisible(true);
    }
  };

  const onAcessoAluno = async (data: AlunoAuthFormData) => {
    setIsLoading(true);
    try {
      const emailFormatado = data.emailUsuario.trim().toLowerCase();
      const raFormatado = data.raAluno.trim();
      const nomeFormatado = data.nomeUsuario.trim();

      const perfilSalvoStr = await SecureStore.getItemAsync("perfil_aluno");

      if (perfilSalvoStr) {
        const perfilSalvo = JSON.parse(perfilSalvoStr);

        if (
          perfilSalvo.tipo === "ALUNO" &&
          perfilSalvo.email === emailFormatado &&
          perfilSalvo.ra === raFormatado
        ) {
          await SecureStore.setItemAsync("sessao_aluno_ativa", "true");
          navigation.replace("AlunoTabs" as any);
        } else {
          setAlertConfig({
            title: "Credenciais Incorretas",
            message:
              "Os dados digitados não batem com a conta vinculada neste aparelho. Se esqueceu, clique em 'Ver dados vinculados' abaixo.",
            tipo: "erro",
          });
          setAlertVisible(true);
        }
      } else {
        const novoPerfil = {
          nome: nomeFormatado,
          email: emailFormatado,
          ra: raFormatado,
          instituicao: "FATEC",
          tipo: "ALUNO",
        };
        await SecureStore.setItemAsync(
          "perfil_aluno",
          JSON.stringify(novoPerfil),
        );
        await SecureStore.setItemAsync("sessao_aluno_ativa", "true");
        navigation.replace("AlunoTabs" as any);
      }
    } catch (error) {
      setAlertConfig({
        title: "Erro",
        message: "Falha ao processar os dados locais.",
        tipo: "erro",
      });
      setAlertVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const onAcessoVisitante = async (data: VisitanteAuthFormData) => {
    setIsLoading(true);
    try {
      const emailFormatado = data.emailUsuario.trim().toLowerCase();
      const nomeFormatado = data.nomeUsuario.trim();

      const perfilSalvoStr = await SecureStore.getItemAsync("perfil_aluno");

      if (perfilSalvoStr) {
        const perfilSalvo = JSON.parse(perfilSalvoStr);
        if (
          perfilSalvo.tipo === "VISITANTE" &&
          perfilSalvo.email === emailFormatado
        ) {
          await SecureStore.setItemAsync("sessao_aluno_ativa", "true");
          navigation.replace("AlunoTabs" as any);
        } else {
          setAlertConfig({
            title: "Credenciais Incorretas",
            message:
              "Este e-mail não corresponde à conta salva, ou o aparelho está vinculado a um Aluno. Clique em 'Ver dados vinculados' abaixo.",
            tipo: "erro",
          });
          setAlertVisible(true);
        }
      } else {
        const novoPerfil = {
          nome: nomeFormatado,
          email: emailFormatado,
          ra: null,
          instituicao: "Visitante Externo",
          tipo: "VISITANTE",
        };
        await SecureStore.setItemAsync(
          "perfil_aluno",
          JSON.stringify(novoPerfil),
        );
        await SecureStore.setItemAsync("sessao_aluno_ativa", "true");
        navigation.replace("AlunoTabs" as any);
      }
    } catch (error) {
      setAlertConfig({
        title: "Erro",
        message: "Falha ao processar os dados locais.",
        tipo: "erro",
      });
      setAlertVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const onAcessarAdmin = async (data: LoginAdminFormData) => {
    setIsLoading(true);
    try {
      await authService.getCSRF();
      await authService.requestLogin(
        data.email.trim().toLowerCase(),
        data.password.trim(),
      );
      setIsLoading(false);
      switchViewAnimada("2fa");
    } catch (error: any) {
      setIsLoading(false);
      let tituloErro = "Acesso Negado";
      let mensagemErro = "Ocorreu um erro inesperado. Tente novamente.";

      if (error.response) {
        const status = error.response.status;
        if (status === 401 || status === 403 || status === 404) {
          mensagemErro =
            "E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.";
        } else {
          mensagemErro =
            "O servidor encontrou um problem. Tente novamente mais tarde.";
        }
      } else if (error.request || error.message === "Network Error") {
        tituloErro = "Sem Conexão";
        mensagemErro =
          "Não foi possível conectar ao servidor. Verifique sua internet.";
      }
      setAlertConfig({
        title: tituloErro,
        message: mensagemErro,
        tipo: "erro",
      });
      setAlertVisible(true);
    }
  };

  const handleVerificarCodigo = async () => {
    if (code2FA.length < 6) {
      setAlertConfig({
        title: "Atenção",
        message: "O código deve conter 6 dígitos.",
        tipo: "aviso",
      });
      setAlertVisible(true);
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
      let tituloErro = "Erro na Validação";
      let mensagemErro = "Não foi possível validar o código.";

      if (error.response?.status === 400 || error.response?.status === 401) {
        mensagemErro =
          "Código inválido ou expirado. Verifique e digite novamente.";
      } else if (error.request || error.message === "Network Error") {
        tituloErro = "Sem Conexão";
        mensagemErro =
          "Falha de conexão com o servidor. Tente novamente mais tarde.";
      }
      setAlertConfig({
        title: tituloErro,
        message: mensagemErro,
        tipo: "erro",
      });
      setAlertVisible(true);
    }
  };

  const onRecuperarSenha = (data: RecoveryFormData) => {
    setAlertConfig({
      title: "E-mail Enviado!",
      message: `Enviamos as instruções para ${data.email}`,
      tipo: "sucesso",
      onCloseAcao: () => switchViewAnimada("login"),
    });
    setAlertVisible(true);
  };

  const renderFormContent = () => {
    if (viewState === "student") {
      return (
        <View key="view_student" style={{ width: "100%" }}>
          <Text style={styles.cardTitle}>Acesso do Aluno</Text>

          <View style={{ marginBottom: 15 }}>
            <View
              style={[
                styles.inputContainer,
                formAluno.formState.errors.nomeUsuario && {
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
                control={formAluno.control}
                name="nomeUsuario"
                render={({ field }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Nome Completo"
                    placeholderTextColor="#999"
                    value={field.value || ""}
                    onChangeText={field.onChange}
                  />
                )}
              />
            </View>
            {formAluno.formState.errors.nomeUsuario && (
              <Text
                style={{
                  color: COLORS.vermelhoPrincipal,
                  fontSize: 12,
                  marginTop: 4,
                  marginLeft: 5,
                }}
              >
                {formAluno.formState.errors.nomeUsuario.message}
              </Text>
            )}
          </View>

          <View style={{ marginBottom: 15 }}>
            <View
              style={[
                styles.inputContainer,
                formAluno.formState.errors.raAluno && {
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
                control={formAluno.control}
                name="raAluno"
                render={({ field }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Seu RA"
                    placeholderTextColor="#999"
                    value={field.value || ""}
                    onChangeText={field.onChange}
                    keyboardType="number-pad"
                  />
                )}
              />
            </View>
            {formAluno.formState.errors.raAluno && (
              <Text
                style={{
                  color: COLORS.vermelhoPrincipal,
                  fontSize: 12,
                  marginTop: 4,
                  marginLeft: 5,
                }}
              >
                {formAluno.formState.errors.raAluno.message}
              </Text>
            )}
          </View>

          <View style={{ marginBottom: 15 }}>
            <View
              style={[
                styles.inputContainer,
                formAluno.formState.errors.emailUsuario && {
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
                control={formAluno.control}
                name="emailUsuario"
                render={({ field }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="E-mail Institucional"
                    placeholderTextColor="#999"
                    value={field.value || ""}
                    onChangeText={field.onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                )}
              />
            </View>
            {formAluno.formState.errors.emailUsuario && (
              <Text
                style={{
                  color: COLORS.vermelhoPrincipal,
                  fontSize: 12,
                  marginTop: 4,
                  marginLeft: 5,
                }}
              >
                {formAluno.formState.errors.emailUsuario.message}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.mainButton}
            onPress={formAluno.handleSubmit(onAcessoAluno)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.branco} />
            ) : (
              <Text style={styles.mainButtonText}>Acessar como Aluno</Text>
            )}
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
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleVerDadosSalvos}
          >
            <Text style={styles.secondaryButtonText}>
              Ver dados vinculados a este aparelho
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (viewState === "visitor") {
      return (
        <View key="view_visitor" style={{ width: "100%" }}>
          <Text style={styles.cardTitle}>Acesso Visitante</Text>
          <Text style={styles.codeHelperText}>
            Para público externo e convidados.
          </Text>

          <View style={{ marginBottom: 15 }}>
            <View
              style={[
                styles.inputContainer,
                formVisitante.formState.errors.nomeUsuario && {
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
                control={formVisitante.control}
                name="nomeUsuario"
                render={({ field }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Nome Completo"
                    placeholderTextColor="#999"
                    value={field.value || ""}
                    onChangeText={field.onChange}
                  />
                )}
              />
            </View>
            {formVisitante.formState.errors.nomeUsuario && (
              <Text
                style={{
                  color: COLORS.vermelhoPrincipal,
                  fontSize: 12,
                  marginTop: 4,
                  marginLeft: 5,
                }}
              >
                {formVisitante.formState.errors.nomeUsuario.message}
              </Text>
            )}
          </View>

          <View style={{ marginBottom: 15 }}>
            <View
              style={[
                styles.inputContainer,
                formVisitante.formState.errors.emailUsuario && {
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
                control={formVisitante.control}
                name="emailUsuario"
                render={({ field }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="E-mail para contato"
                    placeholderTextColor="#999"
                    value={field.value || ""}
                    onChangeText={field.onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                )}
              />
            </View>
            {formVisitante.formState.errors.emailUsuario && (
              <Text
                style={{
                  color: COLORS.vermelhoPrincipal,
                  fontSize: 12,
                  marginTop: 4,
                  marginLeft: 5,
                }}
              >
                {formVisitante.formState.errors.emailUsuario.message}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.mainButton}
            onPress={formVisitante.handleSubmit(onAcessoVisitante)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.branco} />
            ) : (
              <Text style={styles.mainButtonText}>Acessar Eventos</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => switchViewAnimada("student")}
          >
            <Text style={styles.secondaryButtonText}>
              Voltar para Acesso Aluno
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleVerDadosSalvos}
          >
            <Text style={styles.secondaryButtonText}>
              Ver dados vinculados a este aparelho
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (viewState === "login") {
      return (
        <View key="view_login" style={{ width: "100%" }}>
          <Text style={styles.cardTitle}>Área do Colaborador</Text>

          <View style={{ marginBottom: 15 }}>
            <View
              style={[
                styles.inputContainer,
                formLogin.formState.errors.email && {
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
                control={formLogin.control}
                name="email"
                render={({ field }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="E-mail Institucional"
                    placeholderTextColor="#999"
                    value={field.value || ""}
                    onChangeText={field.onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!isLoading}
                  />
                )}
              />
            </View>
            {formLogin.formState.errors.email && (
              <Text
                style={{
                  color: COLORS.vermelhoPrincipal,
                  fontSize: 12,
                  marginTop: 4,
                  marginLeft: 5,
                }}
              >
                {formLogin.formState.errors.email.message}
              </Text>
            )}
          </View>

          <View style={{ marginBottom: 15 }}>
            <View
              style={[
                styles.inputContainer,
                formLogin.formState.errors.password && {
                  borderColor: COLORS.vermelhoPrincipal,
                  borderWidth: 1,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="lock-outline"
                size={20}
                color={COLORS.textoSecundario}
                style={styles.icon}
              />
              <Controller
                control={formLogin.control}
                name="password"
                render={({ field }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    placeholderTextColor="#999"
                    value={field.value || ""}
                    onChangeText={field.onChange}
                    secureTextEntry={!showPassword}
                    editable={!isLoading}
                  />
                )}
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
            {formLogin.formState.errors.password && (
              <Text
                style={{
                  color: COLORS.vermelhoPrincipal,
                  fontSize: 12,
                  marginTop: 4,
                  marginLeft: 5,
                }}
              >
                {formLogin.formState.errors.password.message}
              </Text>
            )}
          </View>

          <TouchableOpacity
            onPress={() => switchViewAnimada("recovery")}
            disabled={isLoading}
          >
            <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mainButton}
            onPress={formLogin.handleSubmit(onAcessarAdmin)}
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
        </View>
      );
    }

    if (viewState === "2fa") {
      return (
        <View key="view_2fa" style={{ width: "100%" }}>
          <Text style={styles.cardTitle}>Verificação de Segurança</Text>
          <Text style={styles.codeHelperText}>
            Enviamos um código de 6 dígitos para o e-mail:{"\n"}
            <Text style={{ fontWeight: "bold" }}>
              {formLogin.getValues("email")}
            </Text>
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
        </View>
      );
    }

    if (viewState === "recovery") {
      return (
        <View key="view_recovery" style={{ width: "100%" }}>
          <Text style={styles.cardTitle}>Recuperar Senha</Text>
          <Text style={styles.codeHelperText}>
            Digite o seu e-mail institucional. Enviaremos as instruções para
            você criar uma nova senha.
          </Text>

          <View style={{ marginBottom: 15 }}>
            <View
              style={[
                styles.inputContainer,
                formRecovery.formState.errors.email && {
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
                control={formRecovery.control}
                name="email"
                render={({ field }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="E-mail Institucional"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={field.value || ""}
                    onChangeText={field.onChange}
                  />
                )}
              />
            </View>
            {formRecovery.formState.errors.email && (
              <Text
                style={{
                  color: COLORS.vermelhoPrincipal,
                  fontSize: 12,
                  marginTop: 4,
                  marginLeft: 5,
                }}
              >
                {formRecovery.formState.errors.email.message}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.mainButton}
            onPress={formRecovery.handleSubmit(onRecuperarSenha)}
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
        </View>
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <View style={styles.topBackground} />

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: Math.max(insets.bottom + 20, 20),
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        style={{ width: "100%" }}
      >
        <View
          style={{
            alignItems: "center",
            marginTop: Math.max(insets.top + 40, 60),
            marginBottom: 40,
          }}
        >
          <Image
            source={require("../../../assets/logoFatecBranco.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.subtitle}>Seja muito bem-vindo.</Text>
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
        onConfirm={alertConfig.onConfirm}
        textoConfirmar={alertConfig.textoConfirmar}
        textoCancelar={alertConfig.textoCancelar}
      />
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
