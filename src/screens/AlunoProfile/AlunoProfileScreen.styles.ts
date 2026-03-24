import { StyleSheet } from "react-native";
import { COLORS } from "../../styles/colors";



export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cinzaFundo,
  },
  header: {
    backgroundColor: COLORS.vermelhoPrincipal,
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.branco,
    textAlign: "center",
    marginBottom: 20,
  },
  progressContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    padding: 15,
    borderRadius: 16,
  },
  progressTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    alignItems: "center",
  },
  progressTitle: {
    color: COLORS.branco,
    fontSize: 14,
    fontWeight: "bold",
  },
  progressPercent: {
    color: COLORS.branco,
    fontSize: 18,
    fontWeight: 900,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 16,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#2ecc71",
    borderRadius: 16,
  },
  formContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textoPrincipal,
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.branco,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 45,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textoPrincipal,
  },
  saveButton: {
    backgroundColor: COLORS.vermelhoPrincipal,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 45,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: COLORS.vermelhoPrincipal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  saveButtonText: {
    color: COLORS.branco,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  helperText: {
    textAlign: "center",
    color: COLORS.textoSecundario,
    fontSize: 13,
    marginTop: 15,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 14,
    color: COLORS.textoSecundario,
    marginBottom: 6,
    fontWeight: "600",
  },
});
