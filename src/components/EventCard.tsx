import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Evento } from "../navigation/types";
import { COLORS } from "../styles/colors";

type EventCardProps = {
  evento: Evento;
  onPress: () => void;
};

const EventCard = ({ evento, onPress }: EventCardProps) => {
  const formatarData = (dataISO: string) => {
    try {
      if (!dataISO) return "Data não definida";

      const dataCorrigida = dataISO.includes("Z") ? dataISO : `${dataISO}Z`;
      const dataObj = new Date(dataCorrigida);

      if (isNaN(dataObj.getTime())) return "Data a confirmar";
      const dataFormatada = dataObj.toLocaleDateString("pt-BR", {
        timeZone: "UTC",
      });

      const horaFormatada = dataObj.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      });

      return `${dataFormatada} às ${horaFormatada}`;
    } catch (error) {
      return "Data inválida";
    }
  };

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: evento.imagemUrl || "https://via.placeholder.com/300" }}
        style={styles.cardImage}
      />

      {evento.eventoRestrito && (
        <View style={styles.tagContainer}>
          <Text style={styles.tagText}>Exclusivo Fatecanos</Text>
        </View>
      )}

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{evento.nome}</Text>
        <Text style={styles.cardInfo}>
          🗓️ Data: {formatarData(evento.data)}
        </Text>
        <Text style={styles.cardInfo}>📍 Local: {evento.local}</Text>
        <Text style={styles.cardInfo}>
          🗣️ Palestrante: {evento.palestrante}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.cardButton}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={styles.cardButtonText}>Ver Detalhes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.branco,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: "#E0E0E0",
  },
  tagContainer: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: COLORS.vermelhoPrincipal,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  tagText: {
    color: COLORS.branco,
    fontSize: 12,
    fontWeight: "bold",
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textoPrincipal,
    marginBottom: 10,
  },
  cardInfo: {
    fontSize: 14,
    color: COLORS.textoSecundario,
    marginBottom: 5,
  },
  cardButton: {
    backgroundColor: COLORS.vermelhoPrincipal,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  cardButtonText: {
    color: COLORS.branco,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EventCard;
