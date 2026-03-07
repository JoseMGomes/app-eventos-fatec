import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, StatusBar } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import {
  RootStackParamList,
  AppNavigationProp,
  Evento,
} from "../../navigation/types";
import { styles } from "./EventDetail.style";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../styles/colors";

type EventDetailRouteProp = RouteProp<RootStackParamList, "EventDetail">;

type Props = {
  navigation: AppNavigationProp;
};

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
}) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIconContainer}>
      <MaterialCommunityIcons name={icon} size={22} style={styles.infoIcon} />
    </View>
    <View style={styles.infoTextContainer}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const EventDetailScreen = ({ navigation }: Props) => {
  const route = useRoute<EventDetailRouteProp>();
  const { evento } = route.params;

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

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} bounces={false}>
        
        <Image source={{ uri: evento.imagemUrl }} style={styles.banner} />
        
        <View style={styles.contentCard}>
          <Text style={styles.title}>{evento.nome}</Text>

          <InfoRow icon="calendar-month-outline" label="Data do Evento" value={formatarData(evento.data)} />
          <InfoRow icon="map-marker-outline" label="Localização" value={evento.local} />
          <InfoRow icon="account-tie" label="Palestrante" value={evento.palestrante} />
          <InfoRow icon="book-open-variant" label="Curso Destinado" value={evento.curso} />
          <InfoRow icon="school-outline" label="Semestre" value={evento.semestre} />
          
          <InfoRow
            icon={evento.eventoRestrito ? "lock" : "lock-open-variant"}
            label="Acesso ao Evento"
            value={evento.eventoRestrito ? "Restrito a alunos e colaboradores" : "Aberto ao público"}
          />
          
          <InfoRow icon="text-box-outline" label="Descrição" value={evento.descricao} />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate("Scanner", {
                  eventId: evento.id,
                  eventName: evento.nome,
                })
              }
            >
              <MaterialCommunityIcons name="qrcode-scan" size={20} color={COLORS.branco} />
              <Text style={styles.actionButtonText}>Escanear QR Code</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("AttendanceList", { evento })}
            >
              <MaterialCommunityIcons name="clipboard-list-outline" size={20} color={COLORS.vermelhoPrincipal} />
              <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
                Ver Lista de Presença
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default EventDetailScreen;