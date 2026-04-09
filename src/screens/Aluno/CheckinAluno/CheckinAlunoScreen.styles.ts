import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../../styles/colors";

const { height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cinzaFundo,
  },
  mapContainer: {
    height: height * 0.45, 
    width: "100%",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  panel: {
    flex: 1,
    backgroundColor: COLORS.branco,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30, 
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.textoPrincipal,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textoSecundario,
    marginBottom: 20,
  },
  badgesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  distanceBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 6,
    flexShrink: 1,
  },
  routeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  routeButtonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.textoPrincipal,
    marginLeft: 4,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textoSecundario,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    height: 55,
    paddingHorizontal: 15,
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textoPrincipal,
    textAlign: "center",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: COLORS.vermelhoPrincipal,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 55,
    borderRadius: 12,
    shadowColor: COLORS.vermelhoPrincipal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonDisabled: {
    backgroundColor: "#CCCCCC",
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmButtonText: {
    color: COLORS.branco,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }
});