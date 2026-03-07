import { StyleSheet, Platform } from "react-native";
import { COLORS } from "../../styles/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cinzaFundo,
  },
  scrollContent: {
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 40,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.textoPrincipal,
  },
  subTitle: {
    fontSize: 16,
    color: COLORS.textoSecundario,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: COLORS.branco,
    width: "31%",
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.vermelhoPrincipal,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textoSecundario,
    textAlign: "center",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textoPrincipal,
    marginBottom: 15,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  optionCard: {
    width: "48%",
    backgroundColor: COLORS.branco,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  iconContainer: {
    backgroundColor: "rgba(169, 0, 0, 0.1)",
    padding: 16,
    borderRadius: 50,
    marginBottom: 12,
  },
  optionText: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.textoPrincipal,
    textAlign: "center",
  },
});
