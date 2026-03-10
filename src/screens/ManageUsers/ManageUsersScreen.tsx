import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../styles/colors";
import { styles } from "./ManageUsersScreen.styles";

const MOCK_USUARIOS = [
  {
    id: "1",
    nome: "Vinicius Leal",
    email: "vinicius.leal@fatec.sp.gov.br",
    nivel: "ADMIN",
  },
  {
    id: "2",
    nome: "José Lucas",
    email: "jose.gomes35@fatec.sp.gov.br",
    nivel: "ADMIN",
  },
  {
    id: "3",
    nome: "Sergio Salgado",
    email: "sergio.salgado@fatec.sp.gov.br",
    nivel: "ADMIN",
  },
  {
    id: "4",
    nome: "Guilherme Pereira",
    email: "guilherme.pereira@fatec.sp.gov.br",
    nivel: "ADMIN",
  },
  {
    id: "5",
    nome: "Patrícia Silva",
    email: "patricia.silva98@fatec.sp.gov.br",
    nivel: "COORDENADOR",
  },
];

const NIVEIS = ["Auxiliar Docente", "Administrador", "Coordenador"];

const getRoleColor = (role: string) => {
  switch (role) {
    case "ADMIN":
    case "Administrador":
      return "#800000"; 
    case "COORDENADOR":
    case "Coordenador":
      return "#E67E22"; 
    default:
      return "#2980B9"; 
  }
};

const ManageUsersScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nivelSelecionado, setNivelSelecionado] = useState("Auxiliar Docente");

  const handleCriarUsuario = () => {
    if (!nome || !email || !senha) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
      return;
    }
    Alert.alert("Sucesso", "Usuário criado com sucesso!");
    setModalVisible(false);
    setNome("");
    setEmail("");
    setSenha("");
    setNivelSelecionado("Auxiliar Docente");
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.userCard}>
      <Text style={styles.userName}>{item.nome}</Text>
      <Text style={styles.userEmail}>{item.email}</Text>

      <View style={styles.cardFooter}>
        <View
          style={[
            styles.roleBadge,
            { backgroundColor: getRoleColor(item.nivel) },
          ]}
        >
          <Text style={styles.roleText}>{item.nivel}</Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={() => Alert.alert("Editar", item.nome)}>
            <MaterialCommunityIcons
              name="pencil"
              size={22}
              color={COLORS.textoSecundario}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Alert.alert("Excluir", `Deseja remover ${item.nome}?`)
            }
          >
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Usuários ({MOCK_USUARIOS.length})</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <MaterialCommunityIcons
            name="account-plus"
            size={20}
            color={COLORS.branco}
          />
          <Text style={styles.addButtonText}>Criar novo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={MOCK_USUARIOS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <MaterialCommunityIcons
                  name="account-plus"
                  size={28}
                  color={COLORS.textoPrincipal}
                />
                <Text style={styles.modalTitle}>Criar novo usuário</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
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
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="********"
                  secureTextEntry={!mostrarSenha}
                  value={senha}
                  onChangeText={setSenha}
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

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nível de usuário</Text>
              <View style={styles.rolesContainer}>
                {NIVEIS.map((nivel) => (
                  <TouchableOpacity
                    key={nivel}
                    style={[
                      styles.roleChip,
                      nivelSelecionado === nivel && styles.roleChipActive,
                    ]}
                    onPress={() => setNivelSelecionado(nivel)}
                  >
                    <Text
                      style={[
                        styles.roleChipText,
                        nivelSelecionado === nivel && styles.roleChipTextActive,
                      ]}
                    >
                      {nivel}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleCriarUsuario}
            >
              <Text style={styles.submitButtonText}>Criar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ManageUsersScreen;
