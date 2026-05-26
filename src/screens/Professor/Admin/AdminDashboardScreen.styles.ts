import { StyleSheet } from "react-native";
import { COLORS } from "../../../styles/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cinzaFundo,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textoPrincipal,
  },
  subtitleText: {
    fontSize: 16,
    color: COLORS.textoSecundario,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textoPrincipal,
    marginBottom: 15,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  optionCard: {
    backgroundColor: COLORS.branco,
    width: "48%",
    paddingVertical: 25,
    paddingHorizontal: 15,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textoPrincipal,
    textAlign: "center",
  },
});
