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
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.textoSecundario,
    textTransform: "uppercase",
    marginBottom: 10,
    marginLeft: 5,
  },
  card: {
    backgroundColor: COLORS.branco,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: COLORS.branco,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  settingText: {
    fontSize: 16,
    color: COLORS.textoPrincipal,
    fontWeight: "500",
  },
  settingSubText: {
    fontSize: 14,
    color: COLORS.textoSecundario,
    marginTop: 2,
  },
  versionText: {
    textAlign: "center",
    color: COLORS.textoSecundario,
    fontSize: 14,
    marginTop: 20,
  },
});
