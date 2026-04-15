import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../../../styles/colors";
import { styles } from "./ManageUsersScreen.styles";
import { userService } from "../../../../services/userService";

const OPCOES_NIVEL = [
  { label: "Auxiliar Docente", value: "AUXILIAR" },
  { label: "Administrador", value: "ADMIN" },
  { label: "Coordenador", value: "COORDENADOR" },
];

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
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [usuarioEmEdicao, setUsuarioEmEdicao] = useState<string | null>(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nivelSelecionado, setNivelSelecionado] = useState("AUXILIAR");

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    setIsLoading(true);
    try {
      const response = await userService.getAll();
      setUsuarios(response.data);
    } catch (error) {
      console.warn("Erro ao carregar usuários:", error);
      Alert.alert("Erro", "Não foi possível carregar a lista de usuários.");
    } finally {
      setIsLoading(false);
    }
  };

  const abrirModalCriacao = () => {
    setUsuarioEmEdicao(null);
    setNome("");
    setEmail("");
    setSenha("");
    setNivelSelecionado("AUXILIAR");
    setMostrarSenha(false);
    setModalVisible(true);
  };

  const abrirModalEdicao = (user: any) => {
    setUsuarioEmEdicao(user.id);
    setNome(user.name);
    setEmail(user.email);
    setSenha("");
    setNivelSelecionado(user.role);
    setModalVisible(true);
  };

  const fecharModal = () => {
    setModalVisible(false);
  };

  const handleSalvarUsuario = async () => {
    if (!nome.trim() || !email.trim()) {
      Alert.alert("Atenção", "Preencha os campos de Nome e E-mail.");
      return;
    }
    if (!usuarioEmEdicao && !senha.trim()) {
      Alert.alert("Atenção", "A senha é obrigatória para novos usuários.");
      return;
    }

    setIsSaving(true);

    try {
      if (usuarioEmEdicao) {
        await userService.update(usuarioEmEdicao, {
          name: nome.trim(),
          email: email.trim().toLowerCase(),
          role: nivelSelecionado,
        });
        Alert.alert("Sucesso", "Usuário atualizado!");
      } else {
        await userService.create({
          name: nome.trim(),
          email: email.trim().toLowerCase(),
          password: senha,
          role: nivelSelecionado,
        });
        Alert.alert("Sucesso", "Novo usuário criado!");
      }

      fecharModal();
      carregarUsuarios();
    } catch (error: any) {
      const msg =
        error.response?.data?.message || "Ocorreu um erro no servidor.";
      Alert.alert(
        "Erro",
        `Não foi possível salvar o usuário.\nDetalhe: ${msg}`,
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (user: any) => {
    Alert.alert(
      "Confirmar exclusão",
      `Deseja realmente remover o usuário ${user.name}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sim, excluir",
          style: "destructive",
          onPress: async () => {
            try {
              setIsLoading(true);
              await userService.delete(user.id);
              Alert.alert("Excluído", "Usuário removido com sucesso.");
              carregarUsuarios();
            } catch (error: any) {
              setIsLoading(false);
              const msg = error.response?.data?.message || "Erro ao excluir.";
              Alert.alert("Erro", msg);
            }
          },
        },
      ],
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
      <View style={styles.header}>
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
          contentContainerStyle={styles.listContainer}
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
        <View style={styles.modalOverlay}>
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

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: João Silva"
                  value={nome}
                  onChangeText={setNome}
                  editable={!isSaving}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="email@fatec.sp.gov.br"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  editable={!isSaving}
                />
              </View>
            </View>

            {!isEditando && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Senha</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="********"
                    secureTextEntry={!mostrarSenha}
                    value={senha}
                    onChangeText={setSenha}
                    editable={!isSaving}
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
                      nivelSelecionado === opcao.value && styles.roleChipActive,
                    ]}
                    onPress={() => setNivelSelecionado(opcao.value)}
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
              style={[styles.submitButton, isSaving && { opacity: 0.7 }]}
              onPress={handleSalvarUsuario}
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
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ManageUsersScreen;
