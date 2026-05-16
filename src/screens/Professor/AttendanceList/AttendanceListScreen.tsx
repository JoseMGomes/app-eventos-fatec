import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView, 
  Platform, 
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context"; 
import { COLORS } from "../../../styles/colors";
import { styles } from "./AttendanceListScreen.styles";
import { participantService } from "../../../services/participantService";
import CustomAlert from "../../../components/CustomAlert";

const AttendanceListScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets(); 
  const { eventId } = (route.params as { eventId?: number | string }) || {};

  const [pesquisa, setPesquisa] = useState("");
  const [alunos, setAlunos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
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

  useEffect(() => {
    if (eventId) {
      carregarParticipantes();
    } else {
      setCarregando(false);
      mostrarAlerta(
        "Atenção",
        "O ID do evento não foi encontrado.",
        "aviso",
        () => navigation.goBack(),
      );
    }
  }, [eventId]);

  const carregarParticipantes = async () => {
    setCarregando(true);
    try {
      const response = await participantService.getByEventId(eventId!);
      setAlunos(response.data);
    } catch (error: any) {
      console.warn("Erro ao carregar participantes:", error);
      if (
        !error.response &&
        (error.request || error.message === "Network Error")
      ) {
        mostrarAlerta(
          "Sem Conexão",
          "Não foi possível carregar a lista de inscritos. Verifique a rede.",
          "erro",
        );
      } else {
        mostrarAlerta(
          "Erro",
          "Ocorreu um problema ao buscar os participantes no servidor.",
          "erro",
        );
      }
    } finally {
      setCarregando(false);
    }
  };

  const alternarPresenca = async (aluno: any) => {
    const novoStatus = !aluno.isPresent;
    setAlunos((estadoAnterior) =>
      estadoAnterior.map((a) =>
        a.id === aluno.id ? { ...a, isPresent: novoStatus } : a,
      ),
    );

    try {
      await participantService.togglePresence(aluno.id, novoStatus);
    } catch (error: any) {
      setAlunos((estadoAnterior) =>
        estadoAnterior.map((a) =>
          a.id === aluno.id ? { ...a, isPresent: aluno.isPresent } : a,
        ),
      );

      let msgErro = "Não foi possível salvar a presença. Tente novamente.";
      if (
        !error.response &&
        (error.request || error.message === "Network Error")
      ) {
        msgErro =
          "A presença não foi salva por falta de internet. Tente novamente.";
      }
      mostrarAlerta("Erro ao Salvar", msgErro, "erro");
    }
  };

  const alunosFiltrados = alunos.filter((aluno) => {
    const nome = aluno.name?.toLowerCase() || "";
    const ra = aluno.ra?.toLowerCase() || "";
    const termo = pesquisa.toLowerCase();
    return nome.includes(termo) || ra.includes(termo);
  });
  const totalInscritos = alunos.length;
  const totalPresentes = alunos.filter((a) => a.isPresent).length;
  const percentagem =
    totalInscritos > 0
      ? Math.round((totalPresentes / totalInscritos) * 100)
      : 0;

  const renderItem = ({ item }: any) => (
    <View style={styles.studentCard}>
      <View
        style={[
          styles.avatarContainer,
          { backgroundColor: item.isPresent ? "#E8F5E9" : "#F5F5F5" },
        ]}
      >
        <MaterialCommunityIcons
          name={item.isPresent ? "account-check" : "account"}
          size={24}
          color={item.isPresent ? "#27AE60" : COLORS.textoSecundario}
        />
      </View>

      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item.name}</Text>
        <Text style={styles.studentRa}>RA: {item.ra || "Não informado"}</Text>
      </View>

      <TouchableOpacity
        style={{ alignItems: "center", padding: 5 }}
        onPress={() => alternarPresenca(item)}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name={item.isPresent ? "checkbox-marked" : "checkbox-blank-outline"}
          size={32}
          color={item.isPresent ? "#27AE60" : COLORS.textoSecundario}
        />
        <Text
          style={[
            styles.statusText,
            { color: item.isPresent ? "#27AE60" : COLORS.textoSecundario },
          ]}
        >
          {item.isPresent ? "PRESENTE" : "FALTOU"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View
        style={[styles.header, { paddingTop: Math.max(insets.top + 10, 40) }]}
      >
        <Text style={styles.title}>Lista de Presença</Text>
        <View style={styles.progressSection}>
          <View style={styles.statsContainer}>
            <Text style={styles.statText}>Inscritos: {totalInscritos}</Text>
            <Text
              style={[
                styles.statText,
                { color: "#27AE60", fontWeight: "bold" },
              ]}
            >
              Presentes: {totalPresentes}
            </Text>
          </View>

          <View style={styles.progressBarContainer}>
            <View
              style={[styles.progressBarFill, { width: `${percentagem}%` }]}
            />
          </View>
          <Text style={styles.progressText}>{percentagem}% de Presença</Text>
        </View>

        <View style={styles.searchContainer}>
          <MaterialCommunityIcons
            name="magnify"
            size={22}
            color={COLORS.textoSecundario}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Procurar por Nome ou RA..."
            value={pesquisa}
            onChangeText={setPesquisa}
            placeholderTextColor="#999"
          />
          {pesquisa.length > 0 && (
            <TouchableOpacity onPress={() => setPesquisa("")}>
              <MaterialCommunityIcons
                name="close-circle"
                size={20}
                color={COLORS.textoSecundario}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {carregando ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={COLORS.vermelhoPrincipal} />
          <Text style={{ marginTop: 10, color: COLORS.textoSecundario }}>
            Buscando alunos inscritos...
          </Text>
        </View>
      ) : (
        <FlatList
          data={alunosFiltrados}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContainer,
            { paddingBottom: Math.max(insets.bottom + 20, 40) },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled" 
          ListEmptyComponent={
            <Text
              style={{
                textAlign: "center",
                color: COLORS.textoSecundario,
                marginTop: 20,
              }}
            >
              {pesquisa
                ? "Nenhum aluno encontrado com esse nome ou RA."
                : "Nenhum participante inscrito."}
            </Text>
          }
        />
      )}

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

export default AttendanceListScreen;
