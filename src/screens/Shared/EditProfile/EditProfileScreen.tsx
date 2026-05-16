import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView, 
  Platform, 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context"; 
import { COLORS } from "../../../styles/colors";
import { styles } from "./EditProfileScreen.styles";
import { authService } from "../../../services/authService";
import CustomAlert from "../../../components/CustomAlert";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileFormData } from "../../../validations/schemas";

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets(); 

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nome: "",
      email: "",
    },
  });

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
          setValue("nome", response.data.name || "");
          setValue("email", response.data.email || "");
        }
      } catch (error: any) {
        console.warn("Erro ao buscar dados do perfil:", error);

        if (
          !error.response &&
          (error.request || error.message === "Network Error")
        ) {
          mostrarAlerta(
            "Sem Conexão",
            "Verifique a internet para carregar seu perfil.",
            "erro",
          );
        } else {
          mostrarAlerta(
            "Erro",
            "Não foi possível buscar seus dados atuais.",
            "erro",
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    carregarDados();
  }, [setValue]);

  const handleSalvarPerfil = async (data: ProfileFormData) => {
    setIsSaving(true);

    try {
      await authService.getCSRF();
      await authService.updateProfile(
        data.nome.trim(),
        data.email.trim().toLowerCase(),
      );
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom + 20, 40) },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome Completo</Text>
          <Controller
            control={control}
            name="nome"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  errors.nome && {
                    borderColor: COLORS.vermelhoPrincipal,
                    borderWidth: 1,
                  },
                ]}
                value={value}
                onChangeText={onChange}
                placeholder="Digite seu nome"
                placeholderTextColor="#999"
              />
            )}
          />
          {errors.nome && (
            <Text
              style={{
                color: COLORS.vermelhoPrincipal,
                fontSize: 12,
                marginTop: 4,
              }}
            >
              {errors.nome.message}
            </Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-mail</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  errors.email && {
                    borderColor: COLORS.vermelhoPrincipal,
                    borderWidth: 1,
                  },
                ]}
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Digite seu e-mail"
                placeholderTextColor="#999"
              />
            )}
          />
          {errors.email && (
            <Text
              style={{
                color: COLORS.vermelhoPrincipal,
                fontSize: 12,
                marginTop: 4,
              }}
            >
              {errors.email.message}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isSaving && { opacity: 0.7 }]}
          onPress={handleSubmit(handleSalvarPerfil)}
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
    </KeyboardAvoidingView>
  );
};

export default EditProfileScreen;
