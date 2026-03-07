import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../../styles/colors";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cinzaFundo,
  },
  banner: {
    width: width,
    height: 250, 
    resizeMode: 'cover',
  },
  contentCard: {
    backgroundColor: COLORS.branco,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30, 
    padding: 25,
    paddingBottom: 40, 
    minHeight: '100%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textoPrincipal,
    marginBottom: 25,
    textAlign: "center", 
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
    backgroundColor: '#F9F9F9', 
    padding: 12,
    borderRadius: 10,
  },
  infoIconContainer: {
    backgroundColor: 'rgba(169, 0, 0, 0.1)', 
    padding: 8,
    borderRadius: 8,
    marginRight: 15,
  },
  infoIcon: {
    color: COLORS.vermelhoPrincipal,
  },
  infoTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textoSecundario,
    textTransform: 'uppercase', 
    marginBottom: 2,
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 16,
    color: COLORS.textoPrincipal,
    fontWeight: "500",
  },
  buttonContainer: {
    marginTop: 30,
    gap: 15, 
  },
  actionButton: {
    backgroundColor: COLORS.vermelhoPrincipal,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 12, 
    shadowColor: COLORS.vermelhoPrincipal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    color: COLORS.branco,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  secondaryButton: {
    backgroundColor: COLORS.branco,
    borderWidth: 1.5,
    borderColor: COLORS.vermelhoPrincipal,
    elevation: 0, 
    shadowOpacity: 0,
  },
  secondaryButtonText: {
    color: COLORS.vermelhoPrincipal,
  },
});