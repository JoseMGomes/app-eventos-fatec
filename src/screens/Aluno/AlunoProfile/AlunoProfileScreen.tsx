import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Alert,
  Modal,
  FlatList,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { COLORS } from "../../../styles/colors";
import { styles } from "./AlunoProfileScreen.styles";
import { AppNavigationProp } from "../../../navigation/types";
import { courseService } from "../../../services/courseService";

const LISTA_SEMESTRES = ["1º", "2º", "3º", "4º", "5º", "6º", "Especial"];

const ProfileScreen = () => {
  const navigation = useNavigation<AppNavigationProp>();

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

  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  const carregarDadosIniciais = async () => {
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

      const response = await courseService.getAllPublic();
      const nomesDosCursos = response.data.map((c: any) => c.name);
      setListaCursos(nomesDosCursos);
    } catch (error) {
      console.log("Erro ao carregar dados iniciais:", error);
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
      (campo) => campo && campo.trim().length > 0,
    ).length;
    const calculo = Math.round(
      (camposPreenchidos / camposObrigatorios.length) * 100,
    );

    setPorcentagem(calculo);
    Animated.timing(widthAnim, {
      toValue: calculo,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [nome, ra, email, curso, semestre, telefone, tipo]);

  const handleSalvarPerfil = async () => {
    if (porcentagem < 100) {
      Alert.alert(
        "Atenção",
        "Complete 100% do perfil para liberar a inscrição com 1 clique.",
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
      Alert.alert("Sucesso!", "Seus dados foram atualizados com sucesso.");
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar no dispositivo.");
    }
  };

  const SelecaoModal = ({
    visible,
    data,
    onSelect,
    onClose,
    title,
    loading,
  }: any) => (
    <Modal visible={visible} transparent animationType="fade">
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
            {title}
          </Text>
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.vermelhoPrincipal} />
          ) : (
            <FlatList
              data={data}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    paddingVertical: 15,
                    borderBottomWidth: 1,
                    borderBottomColor: "#EEE",
                  }}
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                >
                  <Text style={{ fontSize: 16, color: COLORS.textoPrincipal }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
          <TouchableOpacity
            onPress={onClose}
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
  );

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
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

      <ScrollView
        contentContainerStyle={styles.formContainer}
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
                {
                  color: curso ? COLORS.textoPrincipal : "#999",
                  paddingTop: 12,
                },
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
                  {
                    color: semestre ? COLORS.textoPrincipal : "#999",
                    paddingTop: 12,
                  },
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
              onChangeText={setTelefone}
              placeholder="(11) 99999-9999"
              keyboardType="phone-pad"
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

        <TouchableOpacity
          style={{
            marginTop: 40,
            flexDirection: "row",
            justifyContent: "center",
          }}
          onPress={() => {
            Alert.alert("Sair", "Deseja sair da conta?", [
              { text: "Não" },
              {
                text: "Sim",
                onPress: async () => {
                  await SecureStore.deleteItemAsync("perfil_aluno");
                  navigation.replace("Login" as any);
                },
              },
            ]);
          }}
        >
          <MaterialCommunityIcons
            name="logout"
            size={20}
            color={COLORS.vermelhoPrincipal}
          />
          <Text
            style={{
              color: COLORS.vermelhoPrincipal,
              fontWeight: "bold",
              marginLeft: 8,
            }}
          >
            Sair da Conta
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <SelecaoModal
        visible={modalCursoVisible}
        title="Escolha seu Curso"
        data={listaCursos}
        loading={loadingCursos}
        onSelect={setCurso}
        onClose={() => setModalCursoVisible(false)}
      />

      <SelecaoModal
        visible={modalSemestreVisible}
        title="Em qual Semestre?"
        data={LISTA_SEMESTRES}
        onSelect={setSemestre}
        onClose={() => setModalSemestreVisible(false)}
      />
    </View>
  );
};

export default ProfileScreen;
