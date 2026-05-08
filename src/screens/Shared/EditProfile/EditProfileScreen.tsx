import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../../styles/colors";
import { styles } from "./EditProfileScreen.styles";
import { authService } from "../../../services/authService";
import CustomAlert from "../../../components/CustomAlert";

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    title: string;
    message: string;
    tipo: "sucesso" | "erro" | "aviso";
    onCloseAcao?: () => void;
  }>({
    title: "",
    message: "",
    tipo: "aviso",
  });

  const mostrarAlerta = (
    title: string,
    message: string,
    tipo: "sucesso" | "erro" | "aviso",
    onCloseAcao?: () => void,
  ) => {
    setAlertConfig({ title, message, tipo, onCloseAcao });
    setAlertVisible(true);
  };

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const response = await authService.getMe();
        if (response.data) {
          setNome(response.data.name || "");
          setEmail(response.data.email || "");
        }
      } catch (error: any) {
        console.warn("Erro ao buscar dados do perfil:", error);

        if (
          !error.response &&
          (error.request || error.message === "Network Error")
        ) {
          mostrarAlerta(
            "Sem Conexão",
            "Não foi possível carregar seus dados. Verifique a internet.",
            "erro",
          );
        } else {
          mostrarAlerta(
            "Erro",
            "Ocorreu um problema ao buscar os dados do seu perfil.",
            "erro",
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    carregarDados();
  }, []);

  const handleSalvarPerfil = async () => {
    if (!nome.trim() || !email.trim()) {
      mostrarAlerta(
        "Atenção",
        "Os campos Nome e E-mail não podem ficar vazios.",
        "aviso",
      );
      return;
    }

    setIsSaving(true);

    try {
      await authService.getCSRF();
      await authService.updateProfile(nome.trim(), email.trim().toLowerCase());
      setIsSaving(false);

      mostrarAlerta(
        "Sucesso",
        "Perfil atualizado com sucesso!",
        "sucesso",
        () => navigation.goBack(),
      );
    } catch (error: any) {
      setIsSaving(false);

      console.log(
        "ERRO AO SALVAR PERFIL:",
        error.response?.data || error.message,
      );

      let tituloErro = "Erro ao Salvar";
      let msg = "Não foi possível atualizar os dados.";

      if (error.response) {
        msg =
          error.response.data?.message || "O servidor recusou a atualização.";
      } else if (error.request || error.message === "Network Error") {
        tituloErro = "Sem Conexão";
        msg = "Falha de rede. Verifique sua internet e tente novamente.";
      }

      mostrarAlerta(tituloErro, msg, "erro");
    }
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={COLORS.vermelhoPrincipal} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Digite seu nome"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Digite seu e-mail"
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isSaving && { opacity: 0.7 }]}
          onPress={handleSalvarPerfil}
          activeOpacity={0.8}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color={COLORS.branco} />
          ) : (
            <Text style={styles.submitButtonText}>Salvar Alterações</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        tipo={alertConfig.tipo}
        onClose={() => {
          setAlertVisible(false);
          if (alertConfig.onCloseAcao) {
            alertConfig.onCloseAcao();
          }
        }}
      />
    </View>
  );
};

export default EditProfileScreen;
