import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../../styles/colors";
import { styles } from "./AlunoHomeScreen.styles";
import { eventService } from "../../../services/eventService";
import { useNavigation } from "@react-navigation/native";
import CustomAlert from "../../../components/CustomAlert";

const AlunoHomeScreen = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [userName, setUserName] = useState("Aluno");
  const [eventos, setEventos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    title: string;
    message: string;
    tipo: "sucesso" | "erro" | "aviso";
  }>({
    title: "",
    message: "",
    tipo: "aviso",
  });

  const mostrarAlerta = (
    title: string,
    message: string,
    tipo: "sucesso" | "erro" | "aviso",
  ) => {
    setAlertConfig({ title, message, tipo });
    setAlertVisible(true);
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const perfilJson = await SecureStore.getItemAsync("perfil_aluno");
      if (perfilJson) {
        const perfil = JSON.parse(perfilJson);
        const primeiroNome = perfil.nome.split(" ")[0];
        setUserName(primeiroNome);
      }

      const response = await eventService.getPublicEvents();

      const eventosFormatados = response.data.map((ev: any) => {
        const pedacoData = ev.startDate ? ev.startDate.split("T")[0] : "";
        const pedacoHora = ev.startTime
          ? ev.startTime.split("T")[1]
          : "00:00:00.000Z";
        const dataCorrigida = `${pedacoData}T${pedacoHora}`;

        return {
          id: String(ev.id),
          nome: ev.name,
          data: dataCorrigida,
          local:
            ev.locationName?.toLowerCase() === "outros"
              ? ev.customLocation
              : ev.locationName,
          categoria: ev.categoryName || "Geral",
          imagemUrl:
            ev.imageUrl ||
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
          ...ev,
        };
      });

      setEventos(eventosFormatados);
    } catch (error: any) {
      console.warn("Erro ao carregar Home do Aluno:", error);
      let tituloErro = "Ops!";
      let mensagemErro =
        "Não foi possível carregar os eventos da Fatec no momento.";

      if (error.response) {
        mensagemErro =
          "Tivemos um problema ao buscar os eventos. Tente atualizar a página.";
      } else if (error.request || error.message === "Network Error") {
        tituloErro = "Sem Conexão";
        mensagemErro = "Verifique sua internet ou tente novamente mais tarde.";
      }

      mostrarAlerta(tituloErro, mensagemErro, "erro");
    } finally {
      setIsLoading(false);
    }
  };

  const formatarData = (dataISO: string) => {
    if (!dataISO) return "Data indefinida";
    const dataObj = new Date(dataISO);
    const dia = dataObj.toLocaleDateString("pt-BR", { timeZone: "UTC" });
    const hora = dataObj.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
    return `${dia} às ${hora}`;
  };

  const renderEvento = ({ item }: any) => (
    <TouchableOpacity
      style={styles.eventCard}
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate("AlunoEventoDetalhes", { evento: item })
      }
    >
      <Image source={{ uri: item.imagemUrl }} style={styles.eventImage} />
      <View style={styles.cardContent}>
        <View style={styles.tagContainer}>
          <Text style={styles.tagText}>{item.categoria}</Text>
        </View>
        <Text style={styles.eventTitle}>{item.nome}</Text>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons
            name="calendar-month-outline"
            size={16}
            color={COLORS.textoSecundario}
          />
          <Text style={styles.infoText}>{formatarData(item.data)}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={16}
            color={COLORS.textoSecundario}
          />
          <Text style={styles.infoText}>{item.local || "A definir"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <View
        style={[styles.header, { paddingTop: Math.max(insets.top + 20, 50) }]}
      >
        <Text style={styles.greeting}>Olá, {userName}!</Text>
        <Text style={styles.subtitle}>Pronto para aprender coisas novas?</Text>
      </View>

      <Text style={styles.sectionTitle}>Próximos Eventos na Fatec</Text>

      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={COLORS.vermelhoPrincipal} />
          <Text style={{ marginTop: 10, color: COLORS.textoSecundario }}>
            Buscando eventos...
          </Text>
        </View>
      ) : (
        <FlatList
          data={eventos}
          keyExtractor={(item) => item.id}
          renderItem={renderEvento}
          contentContainerStyle={[
            styles.listContainer,
            { paddingBottom: Math.max(insets.bottom + 80, 100) },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text
              style={{
                textAlign: "center",
                color: COLORS.textoSecundario,
                marginTop: 40,
              }}
            >
              Nenhum evento público disponível no momento.
            </Text>
          }
        />
      )}
      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        tipo={alertConfig.tipo}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
};

export default AlunoHomeScreen;
