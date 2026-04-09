import { StyleSheet } from "react-native";
import { COLORS } from "../../../styles/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cinzaFundo,
  },
  header: {
    backgroundColor: COLORS.vermelhoPrincipal,
    paddingTop: 60,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.branco,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textoPrincipal,
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 15,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100, 
  },
  eventCard: {
    backgroundColor: COLORS.branco,
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  eventImage: {
    width: "100%",
    height: 140,
    backgroundColor: "#E0E0E0",
  },
  cardContent: {
    padding: 15,
  },
  tagContainer: {
    backgroundColor: "rgba(169, 0, 0, 0.1)",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
  },
  tagText: {
    color: COLORS.vermelhoPrincipal,
    fontSize: 12,
    fontWeight: "bold",
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textoPrincipal,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.textoSecundario,
    marginLeft: 6,
  },
  enrollButton: {
    backgroundColor: COLORS.vermelhoPrincipal,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 15,
  },
  enrollButtonText: {
    color: COLORS.branco,
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 8,
  },
});
