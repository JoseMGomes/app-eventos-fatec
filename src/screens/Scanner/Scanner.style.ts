import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../../styles/colors";

const { width } = Dimensions.get("window");
const scannerSize = 280;
const maskColor = "rgba(0, 0, 0, 0.75)";

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#000" 
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: COLORS.cinzaFundo,
  },
  permissionText: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 20,
    color: COLORS.textoPrincipal,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  maskRow: {
    flex: 1,
    backgroundColor: maskColor,
  },
  maskCenter: {
    flexDirection: "row",
    height: scannerSize,
  },
  scannerHole: {
    width: scannerSize,
    height: scannerSize,
    backgroundColor: "transparent", 
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: COLORS.branco,
    borderWidth: 5,
    borderRadius: 8,
  },
  topLeft: {
    top: 0, left: 0,
    borderRightWidth: 0, borderBottomWidth: 0,
  },
  topRight: {
    top: 0, right: 0,
    borderLeftWidth: 0, borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0, left: 0,
    borderRightWidth: 0, borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0, right: 0,
    borderLeftWidth: 0, borderTopWidth: 0,
  },
  laser: {
    width: "100%",
    height: 3,
    backgroundColor: COLORS.vermelhoPrincipal,
    shadowColor: COLORS.vermelhoPrincipal,
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  uiContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "center", 
    paddingHorizontal: 20,
  },
  eventPill: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    maxWidth: '80%', 
  },
  headerText: {
    color: COLORS.branco,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  infoPill: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    color: COLORS.branco,
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "500",
  },
});