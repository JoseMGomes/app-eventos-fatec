import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AppNavigationProp } from "../../../navigation/types";
import { COLORS } from "../../../styles/colors";
import { styles } from "./AlunoIncricoesScreens.styles";
import CustomAlert from "../../../components/CustomAlert";

const MINHAS_INSCRICOES_MOCK = [
  {
    id: "101",
    nome: "Palestra: O Futuro da IA",
    data: "2026-04-20T20:00:00Z",
    local: "Auditório 2",
    checkinLiberado: true,
    presencaConfirmada: false,
  },
  {
    id: "102",
    nome: "Semana da Tecnologia 2026",
    data: "2026-04-25T19:00:00Z",
    local: "Auditório Principal",
    checkinLiberado: false,
    presencaConfirmada: false,
  },
];

const AlunoInscricoesScreen = () => {
  const navigation = useNavigation<AppNavigationProp>();
  const [inscricoes, setInscricoes] = useState(MINHAS_INSCRICOES_MOCK);
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
  const formatarData = (dataISO: string) => {
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

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Inscrições</Text>
        <Text style={styles.headerSubtitle}>
          Acompanhe seus eventos e valide sua presença
        </Text>
      </View>

      <FlatList
        data={inscricoes}
        keyExtractor={(item) => item.id}
        renderItem={renderInscricao}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
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
