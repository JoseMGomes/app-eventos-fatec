import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { AppNavigationProp } from "../../../navigation/types";
import { COLORS } from "../../../styles/colors";
import { styles } from "./AlunoIncricoesScreens.styles";
import CustomAlert from "../../../components/CustomAlert";
import { participantService } from "../../../services/participantService";
import { eventService } from "../../../services/eventService";

const AlunoInscricoesScreen = () => {
  const navigation = useNavigation<AppNavigationProp>();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();

  const [inscricoes, setInscricoes] = useState<any[]>([]);
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
    if (isFocused) {
      buscarInscricoes();
    }
  }, [isFocused]);

  const buscarInscricoes = async () => {
    setIsLoading(true);
    try {
      const perfilStr = await SecureStore.getItemAsync("perfil_aluno");
      if (!perfilStr) {
        setIsLoading(false);
        return;
      }

      const perfil = JSON.parse(perfilStr);
      if (!perfil.email) {
        setIsLoading(false);
        return;
      }

      const eventosResponse = await eventService.getPublicEvents();
      const todosEventos = eventosResponse.data || [];

      let minhasInscricoesEncontradas: any[] = [];

      await Promise.all(
        todosEventos.map(async (evento: any) => {
          try {
            const participantesReq = await participantService.getByEventId(
              evento.id,
            );
            const listaParticipantes = participantesReq.data || [];

            const minhaInscricao = listaParticipantes.find(
              (p: any) => p.email.toLowerCase() === perfil.email.toLowerCase(),
            );

            if (minhaInscricao) {
              minhasInscricoesEncontradas.push({
                id: minhaInscricao.id.toString(),
                nome: evento.name || evento.nome,
                data:
                  evento.startDate || evento.data || minhaInscricao.createdAt,
                local: evento.locationName || evento.local || "A definir",
                checkinLiberado: true,
                presencaConfirmada: minhaInscricao.isPresent,
              });
            }
          } catch (err) {}
        }),
      );

      setInscricoes(minhasInscricoesEncontradas);
    } catch (error) {
      console.warn("Erro ao buscar eventos e inscrições:", error);
      mostrarAlerta(
        "Ops!",
        "Não foi possível carregar as inscrições. Tente puxar a tela para atualizar.",
        "erro",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatarData = (dataISO: string) => {
    if (!dataISO) return "--/--/----";
    const dataObj = new Date(dataISO);
    const dia = dataObj.toLocaleDateString("pt-BR", { timeZone: "UTC" });
    const hora = dataObj.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
    return `${dia} às ${hora}`;
  };

  const renderInscricao = ({ item }: any) => {
    const isLiberado = item.checkinLiberado;
    const isConfirmado = item.presencaConfirmada;

    let badgeColor = "#E0E0E0";
    let badgeTextColor = COLORS.textoSecundario;
    let badgeText = "Aguardando";

    if (isConfirmado) {
      badgeColor = "#E8F5E9";
      badgeTextColor = "#27AE60";
      badgeText = "Presença Confirmada";
    } else if (isLiberado) {
      badgeColor = "#FCE8E8";
      badgeTextColor = COLORS.vermelhoPrincipal;
      badgeText = "Check-in Aberto";
    }

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.eventTitle}>{item.nome}</Text>
            <Text style={styles.dateText}>{formatarData(item.data)}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: badgeColor }]}>
            <Text style={[styles.statusText, { color: badgeTextColor }]}>
              {badgeText}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={18}
            color={COLORS.textoSecundario}
          />
          <Text style={styles.infoText}>{item.local}</Text>
        </View>

        {isLiberado && !isConfirmado && (
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: COLORS.vermelhoPrincipal },
            ]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("CheckinAluno")}
          >
            <MaterialCommunityIcons
              name="qrcode-scan"
              size={20}
              color={COLORS.branco}
            />
            <Text style={styles.actionButtonText}>Validar Presença Agora</Text>
          </TouchableOpacity>
        )}

        {isConfirmado && (
          <View style={[styles.actionButton, { backgroundColor: "#27AE60" }]}>
            <MaterialCommunityIcons
              name="check-decagram"
              size={20}
              color={COLORS.branco}
            />
            <Text style={styles.actionButtonText}>Presença Validada</Text>
          </View>
        )}
      </View>
    );
  };

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
        <Text style={styles.headerTitle}>Minhas Inscrições</Text>
        <Text style={styles.headerSubtitle}>
          Acompanhe seus eventos e valide sua presença
        </Text>
      </View>

      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={COLORS.vermelhoPrincipal} />
          <Text style={{ marginTop: 10, color: COLORS.textoSecundario }}>
            Procurando suas inscrições...
          </Text>
        </View>
      ) : (
        <FlatList
          data={inscricoes}
          keyExtractor={(item) => item.id}
          renderItem={renderInscricao}
          contentContainerStyle={[
            styles.listContainer,
            { paddingBottom: Math.max(insets.bottom + 80, 100) },
          ]}
          showsVerticalScrollIndicator={false}
          refreshing={isLoading}
          onRefresh={buscarInscricoes}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="ticket-outline"
                size={80}
                color="#D1D1D1"
              />
              <Text style={styles.emptyText}>Nenhuma inscrição ativa</Text>
              <Text style={styles.emptySubtext}>
                Os eventos em que você se inscrever aparecerão aqui.
              </Text>
            </View>
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

export default AlunoInscricoesScreen;
