import { StyleSheet } from "react-native";
import { COLORS } from "../../../styles/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cinzaFundo,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: COLORS.vermelhoPrincipal, 
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.branco,
    borderWidth: 1,
    borderColor: COLORS.vermelhoPrincipal,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.textoPrincipal,
  },
  imageUploadContainer: {
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 30,
    overflow: "hidden", 
  },
  imageUploadMain: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  imageUploadIcons: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  iconDivider: {
    width: 2,
    height: 24,
    backgroundColor: COLORS.textoPrincipal,
    marginHorizontal: 15,
  },
  imageUploadText: {
    fontSize: 14,
    color: COLORS.textoPrincipal,
    textAlign: "center",
    lineHeight: 20,
  },
  imageUploadFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FCE8E8", 
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  submitButton: {
    backgroundColor: COLORS.vermelhoPrincipal,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: COLORS.branco,
    fontSize: 16,
    fontWeight: "bold",
  },
});