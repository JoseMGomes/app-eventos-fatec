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
import { styles } from "./ManageCategoriesScreen.styles";
import { categoryService } from "../../../../services/categoryService"; 

const ManageCategoriesScreen = () => {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [nomeCategoria, setNomeCategoria] = useState("");
  const [categoriaEmEdicao, setCategoriaEmEdicao] = useState<string | null>(null);

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    setIsLoading(true);
    try {
      const response = await categoryService.getAll();
      setCategorias(response.data);
    } catch (error) {
      console.warn("Erro ao carregar categorias:", error);
      Alert.alert("Erro", "Não foi possível carregar a lista de categorias.");
    } finally {
      setIsLoading(false);
    }
  };

  const abrirModalCriacao = () => {
    setCategoriaEmEdicao(null);
    setNomeCategoria("");
    setModalVisible(true);
  };

  const abrirModalEdicao = (categoria: any) => {
    setCategoriaEmEdicao(categoria.id);
    setNomeCategoria(categoria.name); 
    setModalVisible(true);
  };

  const fecharModal = () => {
    setModalVisible(false);
    setNomeCategoria("");
    setCategoriaEmEdicao(null);
  };

  const handleSalvarCategoria = async () => {
    if (!nomeCategoria.trim()) {
      Alert.alert("Atenção", "Por favor, insira o nome da categoria.");
      return;
    }

    setIsSaving(true);

    try {
      if (categoriaEmEdicao) {
        await categoryService.update(categoriaEmEdicao, nomeCategoria.trim());
        Alert.alert("Sucesso", "Categoria atualizada!");
      } else {
        await categoryService.create(nomeCategoria.trim());
        Alert.alert("Sucesso", "Categoria criada!");
      }
      
      fecharModal();
      carregarCategorias(); 

    } catch (error: any) {
      const msg = error.response?.data?.message || "Ocorreu um erro no servidor.";
      Alert.alert("Erro", `Não foi possível salvar.\nDetalhe: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (categoria: any) => {
    Alert.alert(
      "Confirmar exclusão",
      `Você tem certeza que deseja excluir a categoria "${categoria.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sim, excluir",
          style: "destructive", 
          onPress: async () => {
            try {
              setIsLoading(true); 
              await categoryService.delete(categoria.id);
              Alert.alert("Excluída", "Categoria removida com sucesso.");
              carregarCategorias(); 
            } catch (error: any) {
              setIsLoading(false);
              const msg = error.response?.data?.message || "Ocorreu um erro ao excluir.";
              Alert.alert("Erro", `Não foi possível excluir a categoria.\nDetalhe: ${msg}`);
            }
          },
        },
      ]
    );
  };

  const formatarData = (dataISO: string) => {
    if (!dataISO) return "---";
    const date = new Date(dataISO);
    return `${date.toLocaleDateString("pt-BR")} - ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.categoryCard}>
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName}>{item.name}</Text>

        <View style={styles.dateInfo}>
          <MaterialCommunityIcons name="calendar-plus" size={14} color={COLORS.textoSecundario} />
          <Text style={styles.dateText}>Criado: {formatarData(item.createdAt)}</Text>
        </View>

        <View style={styles.dateInfo}>
          <MaterialCommunityIcons name="calendar-edit" size={14} color={COLORS.textoSecundario} />
          <Text style={styles.dateText}>Editado: {formatarData(item.updatedAt)}</Text>
        </View>
      </View>

      <View style={styles.actionsColumn}>
        <TouchableOpacity onPress={() => abrirModalEdicao(item)}>
          <MaterialCommunityIcons name="pencil" size={24} color={COLORS.textoSecundario} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item)}>
          <MaterialCommunityIcons name="trash-can" size={24} color={COLORS.vermelhoPrincipal} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const isEditando = categoriaEmEdicao !== null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categorias ({categorias.length})</Text>
        <TouchableOpacity style={styles.addButton} onPress={abrirModalCriacao}>
          <MaterialCommunityIcons name="tag-plus" size={20} color={COLORS.branco} />
          <Text style={styles.addButtonText}>Criar nova</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={COLORS.vermelhoPrincipal} />
        </View>
      ) : (
        <FlatList
          data={categorias}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', color: COLORS.textoSecundario, marginTop: 20 }}>
              Nenhuma categoria encontrada.
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
                  name={isEditando ? "tag-edit" : "tag-plus"}
                  size={28}
                  color={COLORS.textoPrincipal}
                />
                <Text style={styles.modalTitle}>
                  {isEditando ? "Editar categoria" : "Criar nova categoria"}
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
              <Text style={styles.label}>Nome da Categoria</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Minicurso"
                value={nomeCategoria}
                onChangeText={setNomeCategoria}
                autoFocus
                editable={!isSaving}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, isSaving && { opacity: 0.7 }]}
              onPress={handleSalvarCategoria}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color={COLORS.branco} />
              ) : (
                <Text style={styles.submitButtonText}>
                  {isEditando ? "Salvar Alterações" : "Criar"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ManageCategoriesScreen;