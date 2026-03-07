import { StyleSheet } from "react-native";
import { COLORS } from "../../styles/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.vermelhoPrincipal,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  titulo: {
    fontSize: 48,
    fontWeight: "bold",
    color: COLORS.branco,
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 18,
    color: COLORS.branco,
    marginBottom: 40,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.branco,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  inputContainer: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.branco,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  inputSenha: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 15,
    fontSize: 16,
  },
  iconeOlho: {
    padding: 10,
  },
  botaoEntrar: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.preto,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  textoBotaoEntrar: {
    color: COLORS.branco,
    fontSize: 18,
    fontWeight: "bold",
  },
  textoConta: {
    color: COLORS.branco,
    marginTop: 20,
    fontSize: 16,
  },
});
