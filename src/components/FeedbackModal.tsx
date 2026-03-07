import React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../styles/colors";

type FeedbackModalProps = {
  visible: boolean;
  type: "success" | "error";
  title: string;
  message: string;
  onClose: () => void;
};

const FeedbackModal = ({
  visible,
  type,
  title,
  message,
  onClose,
}: FeedbackModalProps) => {
  const isSuccess = type === "success";

  const iconName = isSuccess ? "check-bold" : "close-thick";
  const themeColor = isSuccess ? "#10B981" : "#EF4444"; 

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContainer}>
          
          <View style={[styles.iconCircle, { backgroundColor: themeColor }]}>
            <MaterialCommunityIcons name={iconName} size={40} color={COLORS.branco} />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: themeColor }]}
            activeOpacity={0.8}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>{isSuccess ? "Continuar Leitura" : "Tentar Novamente"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: COLORS.branco,
    borderRadius: 24,
    padding: 30,
    paddingTop: 50,
    alignItems: "center",
    width: "100%",
    maxWidth: 340,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  iconCircle: {
    position: 'absolute',
    top: -35,
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: COLORS.branco,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textoPrincipal,
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: COLORS.textoSecundario,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  button: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.branco,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FeedbackModal;