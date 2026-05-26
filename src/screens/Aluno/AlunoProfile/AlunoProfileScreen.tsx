import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Modal,
  FlatList,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../../styles/colors";
import { styles } from "./AlunoProfileScreen.styles";
import { AppNavigationProp } from "../../../navigation/types";
import { courseService } from "../../../services/courseService";
import CustomAlert from "../../../components/CustomAlert";

const LISTA_SEMESTRES = ["1º", "2º", "3º", "4º", "5º", "6º", "Especial"];

const AlunoProfileScreen = () => {
  const navigation = useNavigation<AppNavigationProp>();
  const insets = useSafeAreaInsets();

  const [nome, setNome] = useState("");
  const [ra, setRa] = useState("");
  const [email, setEmail] = useState("");
  const [curso, setCurso] = useState("");
  const [semestre, setSemestre] = useState("");
  const [telefone, setTelefone] = useState("");
  const [tipo, setTipo] = useState("");
  const [listaCursos, setListaCursos] = useState<string[]>([]);
  const [loadingCursos, setLoadingCursos] = useState(true);
  const [modalCursoVisible, setModalCursoVisible] = useState(false);
  const [modalSemestreVisible, setModalSemestreVisible] = useState(false);
  const [porcentagem, setPorcentagem] = useState(0);
  const widthAnim = React.useRef(new Animated.Value(0)).current;
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    title: string;
    message: string;
    tipo: "sucesso" | "erro" | "aviso";
    onConfirm?: () => void;
    textoConfirmar?: string;
    textoCancelar?: string;
  }>({
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
    carregarPerfilLocal();
    carregarCursosSilenciosamente();
  }, []);

  const carregarPerfilLocal = async () => {
    try {
      const perfilJson = await SecureStore.getItemAsync("perfil_aluno");
      if (perfilJson) {
        const perfil = JSON.parse(perfilJson);
        setNome(perfil.nome || "");
        setRa(perfil.ra || "");
        setEmail(perfil.email || "");
        setCurso(perfil.curso || "");
        setSemestre(perfil.semestre || "");
        setTelefone(perfil.telefone || "");
        setTipo(perfil.tipo || "ALUNO");
      }
    } catch (error) {
      console.warn("Erro ao carregar perfil do SecureStore", error);
    }
  };

  const carregarCursosSilenciosamente = async () => {
    setLoadingCursos(true);
    try {
      const response = await courseService.getAllPublic();
      const nomesDosCursos = response.data.map((c: any) => c.name);
      setListaCursos(nomesDosCursos);
    } catch (error: any) {
      console.warn("Erro ao buscar cursos da API", error);
    } finally {
      setLoadingCursos(false);
    }
  };

  useEffect(() => {
    const camposObrigatorios =
      tipo === "VISITANTE"
        ? [nome, email, telefone]
        : [nome, ra, curso, semestre, telefone];

    const camposPreenchidos = camposObrigatorios.filter(
      (campo) => campo && String(campo).trim().length > 0,
    ).length;

    const calculo =
      camposObrigatorios.length > 0
        ? Math.round((camposPreenchidos / camposObrigatorios.length) * 100)
        : 0;

    setPorcentagem(calculo);
    Animated.timing(widthAnim, {
      toValue: calculo,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [nome, ra, email, curso, semestre, telefone, tipo]);

  const handleSalvarPerfil = async () => {
    if (porcentagem < 100) {
      mostrarAlerta(
        "Atenção",
        "Complete 100% do perfil para liberar a inscrição com 1 clique.",
        "aviso",
      );
      return;
    }
    try {
      const perfilAtualizado = {
        nome,
        ra,
        email,
        curso,
        semestre,
        telefone,
        tipo,
      };
      await SecureStore.setItemAsync(
        "perfil_aluno",
        JSON.stringify(perfilAtualizado),
      );
      mostrarAlerta(
        "Sucesso!",
        "Seus dados foram atualizados com sucesso.",
        "sucesso",
      );
    } catch (error) {
      mostrarAlerta("Erro", "Falha ao salvar no dispositivo.", "erro");
    }
  };

  const handleLogout = () => {
    mostrarAlerta(
      "Sair da Conta",
      "Tem certeza que deseja sair do aplicativo?",
      "aviso",
      async () => {
        await SecureStore.deleteItemAsync("sessao_aluno_ativa");
        setAlertVisible(false);
        navigation.replace("Login" as any);
      },
      "Sim, Sair",
      "Cancelar",
    );
  };

  const handleTelefoneChange = (text: string) => {
    let value = text.replace(/\D/g, "");
    if (value.length > 11) value = value.substring(0, 11);
    if (value.length > 2) {
      value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
    }
    if (value.length > 9) {
      value = `${value.substring(0, 10)}-${value.substring(10)}`;
    }

    setTelefone(value);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <View
        style={[styles.header, { paddingTop: Math.max(insets.top + 10, 40) }]}
      >
        <View style={styles.headerTopRow}>
          <Text style={styles.headerTitle}>Meu Perfil</Text>
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.logoutIconArea}
          >
            <MaterialCommunityIcons
              name="logout"
              size={24}
              color={COLORS.branco}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressTextRow}>
            <Text style={styles.progressTitle}>
              {porcentagem === 100
                ? "Perfil 100% Completo!"
                : "Complete seu perfil"}
            </Text>
            <Text style={styles.progressPercent}>{porcentagem}%</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: widthAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["0%", "100%"],
                  }),
                  backgroundColor: porcentagem === 100 ? "#2ECC71" : "#F39C12",
                },
              ]}
            />
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.formContainer,
            { paddingBottom: Math.max(insets.bottom + 120, 140) },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Dados Pessoais & Acadêmicos</Text>

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
                placeholderTextColor="#999"
                onChangeText={setNome}
                placeholder="Seu nome"
              />
            </View>
          </View>

          {tipo !== "VISITANTE" && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>RA (Registro do Aluno)</Text>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="card-account-details-outline"
                  size={20}
                  color={COLORS.textoSecundario}
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  value={ra}
                  onChangeText={setRa}
                  placeholderTextColor="#999"
                  placeholder="Seu RA"
                  keyboardType="number-pad"
                />
              </View>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {tipo === "VISITANTE" ? "Empresa/Instituição" : "Curso"}
            </Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => setModalCursoVisible(true)}
            >
              <MaterialCommunityIcons
                name="school-outline"
                size={20}
                color={COLORS.textoSecundario}
                style={styles.icon}
              />
              <Text
                style={[
                  styles.input,
                  { color: curso ? COLORS.textoPrincipal : "#999" },
                ]}
              >
                {curso || "Selecione..."}
              </Text>
              <MaterialCommunityIcons
                name="chevron-down"
                size={20}
                color={COLORS.textoSecundario}
              />
            </TouchableOpacity>
          </View>

          {tipo !== "VISITANTE" && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Semestre</Text>
              <TouchableOpacity
                style={styles.inputContainer}
                onPress={() => setModalSemestreVisible(true)}
              >
                <MaterialCommunityIcons
                  name="calendar-clock-outline"
                  size={20}
                  color={COLORS.textoSecundario}
                  style={styles.icon}
                />
                <Text
                  style={[
                    styles.input,
                    { color: semestre ? COLORS.textoPrincipal : "#999" },
                  ]}
                >
                  {semestre || "Selecione..."}
                </Text>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={20}
                  color={COLORS.textoSecundario}
                />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telefone</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="phone-outline"
                size={20}
                color={COLORS.textoSecundario}
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                value={telefone}
                onChangeText={handleTelefoneChange}
                placeholderTextColor="#999"
                placeholder="(11) 99999-9999"
                keyboardType="phone-pad"
                maxLength={15}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            activeOpacity={0.8}
            onPress={handleSalvarPerfil}
          >
            <MaterialCommunityIcons
              name="content-save-outline"
              size={20}
              color={COLORS.branco}
            />
            <Text style={styles.saveButtonText}>Salvar Dados</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={modalCursoVisible} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#FFF",
              borderRadius: 20,
              padding: 20,
              maxHeight: "70%",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 20,
                color: COLORS.textoPrincipal,
              }}
            >
              Escolha seu Curso
            </Text>

            {loadingCursos ? (
              <View style={{ padding: 30, alignItems: "center" }}>
                <ActivityIndicator
                  size="large"
                  color={COLORS.vermelhoPrincipal}
                />
                <Text style={{ marginTop: 10, color: COLORS.textoSecundario }}>
                  Carregando cursos...
                </Text>
              </View>
            ) : listaCursos.length > 0 ? (
              <FlatList
                data={listaCursos}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      paddingVertical: 15,
                      borderBottomWidth: 1,
                      borderBottomColor: "#EEE",
                    }}
                    onPress={() => {
                      setCurso(item);
                      setModalCursoVisible(false);
                    }}
                  >
                    <Text
                      style={{ fontSize: 16, color: COLORS.textoPrincipal }}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <View style={{ alignItems: "center", padding: 20 }}>
                <Text
                  style={{
                    textAlign: "center",
                    color: "#999",
                    marginBottom: 15,
                  }}
                >
                  Não foi possível carregar os cursos no momento.
                </Text>
                <TouchableOpacity onPress={carregarCursosSilenciosamente}>
                  <Text
                    style={{
                      color: COLORS.vermelhoPrincipal,
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    Tentar Novamente
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              onPress={() => setModalCursoVisible(false)}
              style={{ marginTop: 20, alignItems: "center" }}
            >
              <Text
                style={{ color: COLORS.vermelhoPrincipal, fontWeight: "bold" }}
              >
                Fechar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={modalSemestreVisible} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#FFF",
              borderRadius: 20,
              padding: 20,
              maxHeight: "70%",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 20,
                color: COLORS.textoPrincipal,
              }}
            >
              Em qual Semestre?
            </Text>
            <FlatList
              data={LISTA_SEMESTRES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    paddingVertical: 15,
                    borderBottomWidth: 1,
                    borderBottomColor: "#EEE",
                  }}
                  onPress={() => {
                    setSemestre(item);
                    setModalSemestreVisible(false);
                  }}
                >
                  <Text style={{ fontSize: 16, color: COLORS.textoPrincipal }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setModalSemestreVisible(false)}
              style={{ marginTop: 20, alignItems: "center" }}
            >
              <Text
                style={{ color: COLORS.vermelhoPrincipal, fontWeight: "bold" }}
              >
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        tipo={alertConfig.tipo}
        onClose={() => setAlertVisible(false)}
        onConfirm={alertConfig.onConfirm}
        textoConfirmar={alertConfig.textoConfirmar}
        textoCancelar={alertConfig.textoCancelar}
      />
    </View>
  );
};

export default AlunoProfileScreen;
