import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { COLORS } from "../../../styles/colors";
import { styles } from "./AlunoHomeScreen.styles";
import { eventService } from "../../../services/eventService";

const AlunoHomeScreen = () => {
  const [userName, setUserName] = useState("Aluno");
  const [eventos, setEventos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        const pedacoHora = ev.startTime ? ev.startTime.split("T")[1] : "00:00:00.000Z";
        const dataCorrigida = `${pedacoData}T${pedacoHora}`;

        return {
          id: String(ev.id),
          nome: ev.name,
          data: dataCorrigida,
          local: ev.locationName?.toLowerCase() === "outros" ? ev.customLocation : ev.locationName,
          categoria: ev.categoryName || "Geral",
          imagemUrl: ev.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop", 
        };
      });

      setEventos(eventosFormatados);
    } catch (error) {
      console.warn("Erro ao carregar Home do Aluno:", error);
      Alert.alert("Erro", "Não foi possível carregar os eventos da Fatec.");
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
          <Text style={styles.infoText}>{item.local || "A definir"}</Text>
        </View>

        <TouchableOpacity
          style={styles.enrollButton}
          activeOpacity={0.8}
          onPress={() => Alert.alert("Oba!", `Vamos preparar a sua inscrição para o evento: ${item.nome}`)}
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
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, {userName}!</Text>
        <Text style={styles.subtitle}>Pronto para aprender coisas novas?</Text>
      </View>
      
      <Text style={styles.sectionTitle}>Próximos Eventos na Fatec</Text>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={COLORS.vermelhoPrincipal} />
          <Text style={{ marginTop: 10, color: COLORS.textoSecundario }}>Buscando eventos...</Text>
        </View>
      ) : (
        <FlatList
          data={eventos}
          keyExtractor={(item) => item.id}
          renderItem={renderEvento}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", color: COLORS.textoSecundario, marginTop: 40 }}>
              Nenhum evento público disponível no momento.
            </Text>
          }
        />
      )}
    </View>
  );
};

export default AlunoHomeScreen;