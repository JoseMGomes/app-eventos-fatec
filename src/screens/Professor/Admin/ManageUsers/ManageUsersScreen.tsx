import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  StatusBar, 
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context"; 
import { COLORS } from "../../../../styles/colors";
import { styles } from "./ManageUsersScreen.styles";
import { userService } from "../../../../services/userService";
import CustomAlert from "../../../../components/CustomAlert";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, UserFormData } from "../../../../validations/schemas";

const OPCOES_NIVEL = [
  { label: "Auxiliar Docente", value: "AUXILIAR" },
  { label: "Administrador", value: "ADMIN" },
  { label: "Coordenador", value: "COORDENADOR" },
] as const;

const getRoleColor = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "#800000";
    case "COORDENADOR":
      return "#E67E22";
    default:
      return "#2980B9";
  }
};

const getRoleLabel = (role: string) => {
  const enc = OPCOES_NIVEL.find((o) => o.value === role);
  return enc ? enc.label : "Auxiliar Docente";
};

const ManageUsersScreen = () => {
  const insets = useSafeAreaInsets();
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [usuarioEmEdicao, setUsuarioEmEdicao] = useState<string | null>(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      role: "AUXILIAR",
    },
  });

  const nivelSelecionado = watch("role");

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    title: string;
    message: string;
    tipo: "sucesso" | "erro" | "aviso";
    onConfirm?: () => void;
    textoConfirmar?: string;
    textoCancelar?: string;
  }>({ title: "", message: "", tipo: "aviso" });

  const mostrarAlerta = (
    title: string,
    message: string,
    tipo: "sucesso" | "erro" | "aviso",
    onConfirm?: () => void,
    textoConfirmar = "OK",
    textoCancelar = "Cancelar",
  ) => {
    setAlertConfig({
      title,
      message,
      tipo,
      onConfirm,
      textoConfirmar,
      textoCancelar,
    });
    setAlertVisible(true);
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    setIsLoading(true);
    try {
      const response = await userService.getAll();
      setUsuarios(response.data);
    } catch (error: any) {
      console.warn("Erro ao carregar usuários:", error);
      if (
        !error.response &&
        (error.request || error.message === "Network Error")
      ) {
        mostrarAlerta(
          "Sem Conexão",
          "Não foi possível carregar a lista de usuários. Verifique a rede.",
          "erro",
        );
      } else {
        mostrarAlerta(
          "Erro",
          "Ocorreu um problema ao buscar a lista de usuários.",
          "erro",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const abrirModalCriacao = () => {
    setUsuarioEmEdicao(null);
    setMostrarSenha(false);
    reset({ nome: "", email: "", senha: "", role: "AUXILIAR" });
    setModalVisible(true);
  };

  const abrirModalEdicao = (user: any) => {
    setUsuarioEmEdicao(user.id);
    reset({
      nome: user.name,
      email: user.email,
      senha: "",
      role: user.role,
    });
    setModalVisible(true);
  };

  const fecharModal = () => {
    setModalVisible(false);
    reset();
    setUsuarioEmEdicao(null);
  };

  const onSalvarUsuario = async (data: UserFormData) => {
    if (!usuarioEmEdicao && (!data.senha || data.senha.trim() === "")) {
      setError("senha", {
        type: "manual",
        message: "A senha é obrigatória para criar um novo usuário.",
      });
      return;
    }

    setIsSaving(true);

    try {
      if (usuarioEmEdicao) {
        await userService.update(usuarioEmEdicao, {
          name: data.nome.trim(),
          email: data.email.trim().toLowerCase(),
          role: data.role,
        });
        mostrarAlerta("Sucesso", "Usuário atualizado com sucesso!", "sucesso");
      } else {
        await userService.create({
          name: data.nome.trim(),
          email: data.email.trim().toLowerCase(),
          password: data.senha,
          role: data.role,
        });
        mostrarAlerta("Sucesso", "Novo usuário criado com sucesso!", "sucesso");
      }

      fecharModal();
      carregarUsuarios();
    } catch (error: any) {
      let tituloErro = "Falha ao Salvar";
      let msg = "Não foi possível salvar os dados do usuário.";

      if (error.response) {
        msg =
          error.response.data?.message ||
          "O servidor recusou o cadastro. Verifique se o e-mail já existe.";
      } else if (error.request || error.message === "Network Error") {
        tituloErro = "Sem Conexão";
        msg = "Falha de conexão com a API. Tente novamente.";
      }
      mostrarAlerta(tituloErro, msg, "erro");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (user: any) => {
    mostrarAlerta(
      "Confirmar exclusão",
      `Deseja realmente remover o usuário "${user.name}"?`,
      "aviso",
      async () => {
        setAlertVisible(false);
        try {
          setIsLoading(true);
          await userService.delete(user.id);
          mostrarAlerta("Excluído", "Usuário removido com sucesso.", "sucesso");
          carregarUsuarios();
        } catch (error: any) {
          setIsLoading(false);
          let tituloErro = "Erro ao Excluir";
          let msg = "Não foi possível excluir o usuário no momento.";

          if (error.response) {
            msg =
              error.response.data?.message || "O servidor recusou a exclusão.";
          } else if (error.request || error.message === "Network Error") {
            tituloErro = "Sem Conexão";
            msg = "Falha de rede. Verifique sua internet.";
          }
          mostrarAlerta(tituloErro, msg, "erro");
        }
      },
      "Sim, excluir",
      "Cancelar",
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.userCard}>
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.userEmail}>{item.email}</Text>

      <View style={styles.cardFooter}>
        <View
          style={[
            styles.roleBadge,
            { backgroundColor: getRoleColor(item.role) },
          ]}
        >
          <Text style={styles.roleText}>{getRoleLabel(item.role)}</Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={() => abrirModalEdicao(item)}>
            <MaterialCommunityIcons
              name="pencil"
              size={22}
              color={COLORS.textoSecundario}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item)}>
            <MaterialCommunityIcons
              name="trash-can"
              size={22}
              color={COLORS.vermelhoPrincipal}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const isEditando = usuarioEmEdicao !== null;

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <View
        style={[styles.header, { paddingTop: Math.max(insets.top + 10, 40) }]}
      >
        <Text style={styles.title}>Usuários ({usuarios.length})</Text>
        <TouchableOpacity style={styles.addButton} onPress={abrirModalCriacao}>
          <MaterialCommunityIcons
            name="account-plus"
            size={20}
            color={COLORS.branco}
          />
          <Text style={styles.addButtonText}>Criar novo</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={COLORS.vermelhoPrincipal} />
        </View>
      ) : (
        <FlatList
          data={usuarios}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContainer,
            { paddingBottom: Math.max(insets.bottom + 20, 40) },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text
              style={{
                textAlign: "center",
                color: COLORS.textoSecundario,
                marginTop: 20,
              }}
            >
              Nenhum usuário encontrado.
            </Text>
          }
        />
      )}

      <Modal visible={modalVisible} transparent animationType="fade">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <MaterialCommunityIcons
                  name={isEditando ? "account-edit" : "account-plus"}
                  size={28}
                  color={COLORS.textoPrincipal}
                />
                <Text style={styles.modalTitle}>
                  {isEditando ? "Editar Usuário" : "Criar novo usuário"}
                </Text>
              </View>
              <TouchableOpacity onPress={fecharModal} disabled={isSaving}>
                <MaterialCommunityIcons
                  name="close-circle-outline"
                  size={28}
                  color={COLORS.vermelhoPrincipal}
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.nome && {
                      borderColor: COLORS.vermelhoPrincipal,
                      borderWidth: 1,
                    },
                  ]}
                >
                  <Controller
                    control={control}
                    name="nome"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        style={styles.input}
                        placeholder="Ex: João Silva"
                        placeholderTextColor="#999"
                        value={value}
                        onChangeText={onChange}
                        editable={!isSaving}
                      />
                    )}
                  />
                </View>
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
                <View
                  style={[
                    styles.inputWrapper,
                    errors.email && {
                      borderColor: COLORS.vermelhoPrincipal,
                      borderWidth: 1,
                    },
                  ]}
                >
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        style={styles.input}
                        placeholder="email@fatec.sp.gov.br"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor="#999"
                        value={value}
                        onChangeText={onChange}
                        editable={!isSaving}
                      />
                    )}
                  />
                </View>
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

              {!isEditando && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Senha</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      errors.senha && {
                        borderColor: COLORS.vermelhoPrincipal,
                        borderWidth: 1,
                      },
                    ]}
                  >
                    <Controller
                      control={control}
                      name="senha"
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          style={styles.input}
                          placeholder="********"
                          placeholderTextColor="#999"
                          secureTextEntry={!mostrarSenha}
                          value={value}
                          onChangeText={onChange}
                          editable={!isSaving}
                        />
                      )}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setMostrarSenha(!mostrarSenha)}
                    >
                      <MaterialCommunityIcons
                        name={mostrarSenha ? "eye-off" : "eye"}
                        size={22}
                        color={COLORS.vermelhoPrincipal}
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.senha && (
                    <Text
                      style={{
                        color: COLORS.vermelhoPrincipal,
                        fontSize: 12,
                        marginTop: 4,
                      }}
                    >
                      {errors.senha.message}
                    </Text>
                  )}
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nível de usuário</Text>
                <View style={styles.rolesContainer}>
                  {OPCOES_NIVEL.map((opcao) => (
                    <TouchableOpacity
                      key={opcao.value}
                      style={[
                        styles.roleChip,
                        nivelSelecionado === opcao.value &&
                          styles.roleChipActive,
                      ]}
                      onPress={() => setValue("role", opcao.value)}
                      disabled={isSaving}
                    >
                      <Text
                        style={[
                          styles.roleChipText,
                          nivelSelecionado === opcao.value &&
                            styles.roleChipTextActive,
                        ]}
                      >
                        {opcao.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  isSaving && { opacity: 0.7 },
                  { marginBottom: 10 },
                ]}
                onPress={handleSubmit(onSalvarUsuario)}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color={COLORS.branco} />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {isEditando ? "Salvar Alterações" : "Criar Usuário"}
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        tipo={alertConfig.tipo}
        onClose={() => setAlertVisible(false)}
        onConfirm={alertConfig.onConfirm}
        textoConfirmar={alertConfig.textoConfirmar}
        textoCancelar={alertConfig.textoCancelar}
      />
    </View>
  );
};

export default ManageUsersScreen;
