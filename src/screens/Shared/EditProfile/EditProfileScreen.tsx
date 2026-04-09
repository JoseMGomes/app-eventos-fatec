import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../../styles/colors";
import { styles } from "./EditProfileScreen.styles";
import { authService } from "../../../services/authService";

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const response = await authService.getMe();
        if (response.data) {
          setNome(response.data.name || "");
          setEmail(response.data.email || "");
        }
      } catch (error) {
        console.warn("Erro ao buscar dados do perfil:", error);
        Alert.alert("Erro", "Não foi possível carregar seus dados atuais.");
      } finally {
        setIsLoading(false);
      }
    };

    carregarDados();
  }, []);

  const handleSalvarPerfil = async () => {
    if (!nome.trim() || !email.trim()) {
      Alert.alert("Atenção", "Os campos Nome e E-mail não podem ficar vazios.");
      return;
    }

    setIsSaving(true);

    try {
      await authService.getCSRF();
      await authService.updateProfile(nome.trim(), email.trim().toLowerCase());
      setIsSaving(false);
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      setIsSaving(false);

      console.log(
        "ERRO AO SALVAR PERFIL:",
        error.response?.data || error.message,
      );
      const msg =
        error.response?.data?.message || "Ocorreu um erro na conexão.";
      Alert.alert(
        "Erro ao Salvar",
        `Não foi possível atualizar os dados.\n\nDetalhe: ${msg}`,
      );
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
    </View>
  );
};

export default EditProfileScreen;
