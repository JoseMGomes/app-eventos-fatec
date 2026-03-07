import { StyleSheet } from "react-native";
import { COLORS } from "../../styles/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cinzaFundo,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50, 
    paddingBottom: 10,
  },
  saudacao: {
    fontSize: 16,
    color: COLORS.textoSecundario,
    marginBottom: 4,
  },
  tituloDescubra: {
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.textoPrincipal,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.branco,
    marginHorizontal: 20,
    marginTop: 15,
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 12,
    elevation: 3, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.textoPrincipal,
  },
  categoriasContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  chip: {
    backgroundColor: COLORS.branco,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  chipAtivo: {
    backgroundColor: COLORS.vermelhoPrincipal,
    borderColor: COLORS.vermelhoPrincipal,
  },
  textoChip: {
    fontSize: 14,
    color: COLORS.textoSecundario,
    fontWeight: "600",
  },
  textoChipAtivo: {
    color: COLORS.branco,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 120, 
  },
  listaVazia: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: COLORS.textoSecundario,
  }
});