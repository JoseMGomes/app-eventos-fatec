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
import { styles } from "./ManageCategoriesScreen.styles";

const MOCK_CATEGORIAS = [
  { id: "1", nome: "Competição acadêmica", criadoEm: "30/09/2025 - 16:26:21", editadoEm: "30/09/2025 - 16:26:21" },
  { id: "2", nome: "Exposição", criadoEm: "30/09/2025 - 16:26:16", editadoEm: "30/09/2025 - 16:26:28" },
  { id: "3", nome: "Conferência", criadoEm: "30/09/2025 - 16:26:12", editadoEm: "30/09/2025 - 16:26:33" },
  { id: "4", nome: "Workshop", criadoEm: "30/09/2025 - 16:26:05", editadoEm: "30/09/2025 - 16:26:05" },
  { id: "5", nome: "Seminário", criadoEm: "30/09/2025 - 16:26:01", editadoEm: "30/09/2025 - 16:26:01" },
];

const ManageCategoriesScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [nomeCategoria, setNomeCategoria] = useState("");
  // Estado para saber se estamos editando (guarda o ID) ou criando (fica null)
  const [categoriaEmEdicao, setCategoriaEmEdicao] = useState<string | null>(null);

  // Função para abrir o modal limpo para CRIAR
  const abrirModalCriacao = () => {
    setCategoriaEmEdicao(null);
    setNomeCategoria("");
    setModalVisible(true);
  };

  // Função para abrir o modal preenchido para EDITAR
  const abrirModalEdicao = (categoria: any) => {
    setCategoriaEmEdicao(categoria.id);
    setNomeCategoria(categoria.nome);
    setModalVisible(true);
  };

  // Função para fechar e limpar tudo
  const fecharModal = () => {
    setModalVisible(false);
    setNomeCategoria("");
    setCategoriaEmEdicao(null);
  };

  // Função unificada de salvar (Serve para criar e editar)
  const handleSalvarCategoria = () => {
    if (!nomeCategoria.trim()) {
      Alert.alert("Atenção", "Por favor, insira o nome da categoria.");
      return;
    }

    if (categoriaEmEdicao) {
      Alert.alert("Sucesso", `Categoria atualizada para "${nomeCategoria}" com sucesso!`);
      // Aqui no futuro você fará o PUT para a sua API
    } else {
      Alert.alert("Sucesso", `Categoria "${nomeCategoria}" criada com sucesso!`);
      // Aqui no futuro você fará o POST para a sua API
    }
    
    fecharModal();
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.categoryCard}>
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName}>{item.nome}</Text>
        
        <View style={styles.dateInfo}>
          <MaterialCommunityIcons name="calendar-plus" size={14} color={COLORS.textoSecundario} />
          <Text style={styles.dateText}>Criado: {item.criadoEm}</Text>
        </View>
        
        <View style={styles.dateInfo}>
          <MaterialCommunityIcons name="calendar-edit" size={14} color={COLORS.textoSecundario} />
          <Text style={styles.dateText}>Editado: {item.editadoEm}</Text>
        </View>
      </View>

      <View style={styles.actionsColumn}>
        {/* Agora o botão de editar chama a função passando a categoria atual */}
        <TouchableOpacity onPress={() => abrirModalEdicao(item)}>
          <MaterialCommunityIcons name="pencil" size={24} color={COLORS.textoSecundario} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Alert.alert("Excluir", `Deseja remover a categoria ${item.nome}?`)}>
          <MaterialCommunityIcons name="trash-can" size={24} color={COLORS.vermelhoPrincipal} />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Variáveis para mudar a cara do modal dinamicamente
  const isEditando = categoriaEmEdicao !== null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categorias ({MOCK_CATEGORIAS.length})</Text>
        <TouchableOpacity style={styles.addButton} onPress={abrirModalCriacao}>
          <MaterialCommunityIcons name="tag-plus" size={20} color={COLORS.branco} />
          <Text style={styles.addButtonText}>Criar nova</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={MOCK_CATEGORIAS}
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
                {/* Muda o ícone dependendo se é criação ou edição */}
                <MaterialCommunityIcons 
                  name={isEditando ? "tag-edit" : "tag-plus"} 
                  size={28} 
                  color={COLORS.textoPrincipal} 
                />
                <Text style={styles.modalTitle}>
                  {isEditando ? "Editar categoria" : "Criar nova categoria"}
                </Text>
              </View>
              <TouchableOpacity onPress={fecharModal}>
                <MaterialCommunityIcons name="close-circle-outline" size={28} color={COLORS.vermelhoPrincipal} />
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
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSalvarCategoria}>
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

export default ManageCategoriesScreen;