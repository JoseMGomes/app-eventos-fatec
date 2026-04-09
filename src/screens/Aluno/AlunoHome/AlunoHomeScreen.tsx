import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../../styles/colors";
import { styles } from "./AlunoHomeScreen.styles";

const EVENTOS_MOCK = [
  {
    id: "1",
    nome: "Semana da Tecnologia 2026",
    data: "2026-04-10T19:00:00Z",
    local: "Auditório Principal",
    categoria: "Tecnologia",
    imagemUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "2",
    nome: "Workshop de React Native",
    data: "2026-04-15T14:00:00Z",
    local: "Laboratório 3",
    categoria: "Minicurso",
    imagemUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "3",
    nome: "Palestra: O Futuro da IA",
    data: "2026-04-20T20:00:00Z",
    local: "Auditório 2",
    categoria: "Palestra",
    imagemUrl:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop",
  },
];

const AlunoHomeScreen = () => {
  const [eventos, setEventos] = useState(EVENTOS_MOCK);

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

  const renderEvento = ({ item }: any) => (
    <View style={styles.eventCard}>
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
          <Text style={styles.infoText}>{item.local}</Text>
        </View>

        <TouchableOpacity
          style={styles.enrollButton}
          activeOpacity={0.8}
          onPress={() => alert(`Inscrição solicitada para: ${item.nome}`)}
        >
          <MaterialCommunityIcons
            name="ticket-confirmation-outline"
            size={18}
            color={COLORS.branco}
          />
          <Text style={styles.enrollButtonText}>Garantir Vaga</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, José Lucas!</Text>
        <Text style={styles.subtitle}>Pronto para aprender coisas novas?</Text>
      </View>
      <Text style={styles.sectionTitle}>Próximos Eventos na Fatec</Text>
      <FlatList
        data={eventos}
        keyExtractor={(item) => item.id}
        renderItem={renderEvento}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default AlunoHomeScreen;
