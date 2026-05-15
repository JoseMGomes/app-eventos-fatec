import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../../../styles/colors";
import { styles } from "./ManageCategoriesScreen.styles";
import { categoryService } from "../../../../services/categoryService";
import CustomAlert from "../../../../components/CustomAlert";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  simpleNameSchema,
  SimpleNameFormData,
} from "../../../../validations/schemas";

const ManageCategoriesScreen = () => {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [categoriaEmEdicao, setCategoriaEmEdicao] = useState<string | null>(
    null,
  );

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SimpleNameFormData>({
    resolver: zodResolver(simpleNameSchema),
    defaultValues: {
      name: "",
    },
  });

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    title: string;
    message: string;
    tipo: "sucesso" | "erro" | "aviso";
    onConfirm?: () => void;
    textoConfirmar?: string;
    textoCancelar?: string;
  }>({
    title: "",
    message: "",
    tipo: "aviso",
  });

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
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    setIsLoading(true);
    try {
      const response = await categoryService.getAll();
      setCategorias(response.data);
    } catch (error: any) {
      console.warn("Erro ao carregar categorias:", error);
      if (
        !error.response &&
        (error.request || error.message === "Network Error")
      ) {
        mostrarAlerta(
          "Sem Conexão",
          "Não foi possível carregar as categorias. Verifique a rede.",
          "erro",
        );
      } else {
        mostrarAlerta(
          "Erro",
          "Ocorreu um problema ao buscar a lista de categorias.",
          "erro",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const abrirModalCriacao = () => {
    setCategoriaEmEdicao(null);
    reset({ name: "" });
    setModalVisible(true);
  };

  const abrirModalEdicao = (categoria: any) => {
    setCategoriaEmEdicao(categoria.id);
    setValue("name", categoria.name);
    setModalVisible(true);
  };

  const fecharModal = () => {
    setModalVisible(false);
    reset({ name: "" });
    setCategoriaEmEdicao(null);
  };

  const onSalvarCategoria = async (data: SimpleNameFormData) => {
    setIsSaving(true);
    try {
      if (categoriaEmEdicao) {
        await categoryService.update(categoriaEmEdicao, data.name.trim());
        mostrarAlerta(
          "Sucesso",
          "Categoria atualizada com sucesso!",
          "sucesso",
        );
      } else {
        await categoryService.create(data.name.trim());
        mostrarAlerta("Sucesso", "Categoria criada com sucesso!", "sucesso");
      }

      fecharModal();
      carregarCategorias();
    } catch (error: any) {
      let tituloErro = "Falha ao Salvar";
      let msg = "Não foi possível salvar a categoria.";

      if (error.response) {
        msg = error.response.data?.message || "Erro retornado pelo servidor.";
      } else if (error.request || error.message === "Network Error") {
        tituloErro = "Sem Conexão";
        msg = "Falha de conexão com a API. Tente novamente.";
      }

      mostrarAlerta(tituloErro, msg, "erro");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (categoria: any) => {
    mostrarAlerta(
      "Confirmar exclusão",
      `Você tem certeza que deseja excluir a categoria "${categoria.name}"?`,
      "aviso",
      async () => {
        setAlertVisible(false);
        try {
          setIsLoading(true);
          await categoryService.delete(categoria.id);
          mostrarAlerta(
            "Excluída",
            "Categoria removida com sucesso.",
            "sucesso",
          );
          carregarCategorias();
        } catch (error: any) {
          setIsLoading(false);
          let tituloErro = "Erro ao Excluir";
          let msg = "Não foi possível excluir a categoria no momento.";

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
          <MaterialCommunityIcons
            name="calendar-plus"
            size={14}
            color={COLORS.textoSecundario}
          />
          <Text style={styles.dateText}>
            Criado: {formatarData(item.createdAt)}
          </Text>
        </View>

        <View style={styles.dateInfo}>
          <MaterialCommunityIcons
            name="calendar-edit"
            size={14}
            color={COLORS.textoSecundario}
          />
          <Text style={styles.dateText}>
            Editado: {formatarData(item.updatedAt)}
          </Text>
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
        <TouchableOpacity onPress={() => handleDelete(item)}>
          <MaterialCommunityIcons
            name="trash-can"
            size={24}
            color={COLORS.vermelhoPrincipal}
          />
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
          <MaterialCommunityIcons
            name="tag-plus"
            size={20}
            color={COLORS.branco}
          />
          <Text style={styles.addButtonText}>Criar nova</Text>
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
          data={categorias}
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
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      errors.name && {
                        borderColor: COLORS.vermelhoPrincipal,
                        borderWidth: 1,
                      },
                    ]}
                    placeholder="Ex: Minicurso"
                    placeholderTextColor="#999"
                    value={value}
                    onChangeText={onChange}
                    autoFocus
                    editable={!isSaving}
                  />
                )}
              />
              {errors.name && (
                <Text
                  style={{
                    color: COLORS.vermelhoPrincipal,
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  {errors.name.message}
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={[styles.submitButton, isSaving && { opacity: 0.7 }]}
              onPress={handleSubmit(onSalvarCategoria)}
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

export default ManageCategoriesScreen;
