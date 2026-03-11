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
import { styles } from "./ManageCoursesScreen.styles";

const MOCK_CURSOS = [
  {
    id: "1",
    nome: "Análise e Desenvolvimento de Sistemas ( ADS )",
    criadoEm: "04/11/2025 - 18:29:44",
    editadoEm: "04/11/2025 - 18:29:44",
  },
  {
    id: "2",
    nome: "Análise e Desenvolvimento de Sistemas ( ADS-AMS )",
    criadoEm: "30/09/2025 - 16:27:32",
    editadoEm: "08/11/2025 - 11:41:58",
  },
  {
    id: "3",
    nome: "Gestão da Tecnologia da Informação",
    criadoEm: "30/09/2025 - 16:27:42",
    editadoEm: "30/09/2025 - 16:28:03",
  },
  {
    id: "4",
    nome: "Gestão de Eventos",
    criadoEm: "30/09/2025 - 16:27:51",
    editadoEm: "30/09/2025 - 16:27:51",
  },
  {
    id: "5",
    nome: "Gestão Empresarial",
    criadoEm: "30/09/2025 - 16:27:37",
    editadoEm: "30/09/2025 - 16:27:56",
  },
  {
    id: "6",
    nome: "Mecatrônica Industrial",
    criadoEm: "30/09/2025 - 16:27:46",
    editadoEm: "30/09/2025 - 16:28:07",
  },
  {
    id: "7",
    nome: "Processos Gerenciais - AMS",
    criadoEm: "08/11/2025 - 11:41:37",
    editadoEm: "08/11/2025 - 11:41:37",
  },
];

const ManageCoursesScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [nomeCurso, setNomeCurso] = useState("");
  const [cursoEmEdicao, setCursoEmEdicao] = useState<string | null>(null);

  const abrirModalCriacao = () => {
    setCursoEmEdicao(null);
    setNomeCurso("");
    setModalVisible(true);
  };

  const abrirModalEdicao = (curso: any) => {
    setCursoEmEdicao(curso.id);
    setNomeCurso(curso.nome);
    setModalVisible(true);
  };

  const fecharModal = () => {
    setModalVisible(false);
    setNomeCurso("");
    setCursoEmEdicao(null);
  };

  const handleSalvarCurso = () => {
    if (!nomeCurso.trim()) {
      Alert.alert("Atenção", "Por favor, insira o nome do curso.");
      return;
    }

    if (cursoEmEdicao) {
      Alert.alert(
        "Sucesso",
        `Curso atualizado para "${nomeCurso}" com sucesso!`,
      );
    } else {
      Alert.alert("Sucesso", `Curso "${nomeCurso}" criado com sucesso!`);
    }

    fecharModal();
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.courseCard}>
      <View style={styles.courseInfo}>
        <Text style={styles.courseName}>{item.nome}</Text>

        <View style={styles.dateInfo}>
          <MaterialCommunityIcons
            name="calendar-plus"
            size={14}
            color={COLORS.textoSecundario}
          />
          <Text style={styles.dateText}>Criado: {item.criadoEm}</Text>
        </View>

        <View style={styles.dateInfo}>
          <MaterialCommunityIcons
            name="calendar-edit"
            size={14}
            color={COLORS.textoSecundario}
          />
          <Text style={styles.dateText}>Editado: {item.editadoEm}</Text>
        </View>
      </View>

      <View style={styles.actionsColumn}>
        <TouchableOpacity onPress={() => abrirModalEdicao(item)}>
          <MaterialCommunityIcons
            name="pencil"
            size={24}
            color={COLORS.textoSecundario}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            Alert.alert("Excluir", `Deseja remover o curso ${item.nome}?`)
          }
        >
          <MaterialCommunityIcons
            name="trash-can"
            size={24}
            color={COLORS.vermelhoPrincipal}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const isEditando = cursoEmEdicao !== null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cursos ({MOCK_CURSOS.length})</Text>
        <TouchableOpacity style={styles.addButton} onPress={abrirModalCriacao}>
          <MaterialCommunityIcons name="plus" size={20} color={COLORS.branco} />
          <Text style={styles.addButtonText}>Criar novo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={MOCK_CURSOS}
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
                  name={isEditando ? "pencil" : "school"}
                  size={28}
                  color={COLORS.textoPrincipal}
                />
                <Text style={styles.modalTitle}>
                  {isEditando ? "Editar curso" : "Criar novo curso"}
                </Text>
              </View>
              <TouchableOpacity onPress={fecharModal}>
                <MaterialCommunityIcons
                  name="close-circle-outline"
                  size={28}
                  color={COLORS.vermelhoPrincipal}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome do Curso</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Gestão Financeira"
                value={nomeCurso}
                onChangeText={setNomeCurso}
                autoFocus
              />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSalvarCurso}
            >
              <Text style={styles.submitButtonText}>
                {isEditando ? "Salvar Alterações" : "Criar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ManageCoursesScreen;
