import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../styles/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type ParticipantRowProps = {
  nome: string;
  curso: string;
  presente: boolean;
};

const ParticipantRow = ({ nome, curso, presente }: ParticipantRowProps) => {
  return (
    <View style={styles.row}>
      <View style={styles.infoContainer}>
        <Text style={styles.nome}>{nome}</Text>
        <Text style={styles.curso}>{curso}</Text>
      </View>
      <View
        style={[
          styles.statusContainer,
          { backgroundColor: presente ? "#28a745" : COLORS.vermelhoPrincipal },
        ]}
      >
        <MaterialCommunityIcons
          name={presente ? "check-circle-outline" : "close-circle-outline"}
          size={20}
          color={COLORS.branco}
        />
        <Text style={styles.statusText}>
          {presente ? "Presente" : "Ausente"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.branco,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoContainer: { flex: 1 },
  nome: { fontSize: 16, fontWeight: "bold", color: COLORS.textoPrincipal },
  curso: { fontSize: 14, color: COLORS.textoSecundario },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  statusText: {
    color: COLORS.branco,
    fontWeight: "bold",
    marginLeft: 5,
    fontSize: 12,
  },
});

export default ParticipantRow;
