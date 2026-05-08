import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../styles/colors"; 

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  tipo?: "sucesso" | "erro" | "aviso";
  onClose: () => void;
  onConfirm?: () => void;
  textoConfirmar?: string;
  textoCancelar?: string;
}

const CustomAlert = ({
  visible,
  title,
  message,
  tipo = "aviso",
  onClose,
  onConfirm,
  textoConfirmar = "OK",
  textoCancelar = "Cancelar",
}: CustomAlertProps) => {
  const getIconInfo = () => {
    switch (tipo) {
      case "sucesso":
        return { name: "check-circle", color: "#27AE60" };
      case "erro":
        return { name: "close-circle", color: COLORS.vermelhoPrincipal || "#B30000" };
      case "aviso":
      default:
        return { name: "alert-circle", color: "#F29C11" };
    }
  };

  const iconInfo = getIconInfo();

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <MaterialCommunityIcons
            name={iconInfo.name as any}
            size={50}
            color={iconInfo.color}
            style={styles.icon}
          />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            {onConfirm && (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>{textoCancelar}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: iconInfo.color },
                onConfirm ? styles.halfButton : styles.fullButton,
              ]}
              onPress={onConfirm ? onConfirm : onClose}
            >
              <Text style={styles.confirmButtonText}>{textoConfirmar}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  alertBox: {
    width: width * 0.85,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  icon: {
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  fullButton: {
    width: "100%",
  },
  halfButton: {
    width: "48%",
  },
  cancelButton: {
    backgroundColor: "#F2F2F2",
    width: "48%",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default CustomAlert;