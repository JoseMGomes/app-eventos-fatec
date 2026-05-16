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
import { styles } from "./ManageCoursesScreen.styles";
import { courseService } from "../../../../services/courseService";
import CustomAlert from "../../../../components/CustomAlert";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  simpleNameSchema,
  SimpleNameFormData,
} from "../../../../validations/schemas";

const formatarData = (dataIso: string) => {
  if (!dataIso) return "--/--/----";
  const data = new Date(dataIso);
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  const horas = String(data.getHours()).padStart(2, "0");
  const min = String(data.getMinutes()).padStart(2, "0");
  const seg = String(data.getSeconds()).padStart(2, "0");
  return `${dia}/${mes}/${ano} - ${horas}:${min}:${seg}`;
};

const ManageCoursesScreen = () => {
  const insets = useSafeAreaInsets();

  const [cursos, setCursos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [cursoEmEdicao, setCursoEmEdicao] = useState<string | null>(null);

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
    carregarCursos();
  }, []);

  const carregarCursos = async () => {
    setIsLoading(true);
    try {
      const response = await courseService.getAll();
      setCursos(response.data);
    } catch (error: any) {
      console.warn("Erro ao carregar cursos:", error);
      if (
        !error.response &&
        (error.request || error.message === "Network Error")
      ) {
        mostrarAlerta(
          "Sem Conexão",
          "Não foi possível carregar a lista de cursos. Verifique a rede.",
          "erro",
        );
      } else {
        mostrarAlerta(
          "Erro",
          "Ocorreu um problema ao buscar a lista de cursos.",
          "erro",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const abrirModalCriacao = () => {
    setCursoEmEdicao(null);
    reset({ name: "" });
    setModalVisible(true);
  };

  const abrirModalEdicao = (curso: any) => {
    setCursoEmEdicao(curso.id);
    setValue("name", curso.name);
    setModalVisible(true);
  };

  const fecharModal = () => {
    setModalVisible(false);
    reset({ name: "" });
    setCursoEmEdicao(null);
  };

  const onSalvarCurso = async (data: SimpleNameFormData) => {
    setIsSaving(true);

    try {
      if (cursoEmEdicao) {
        await courseService.update(cursoEmEdicao, { name: data.name.trim() });
        mostrarAlerta("Sucesso", "Curso atualizado com sucesso!", "sucesso");
      } else {
        await courseService.create({ name: data.name.trim() });
        mostrarAlerta("Sucesso", "Novo curso criado com sucesso!", "sucesso");
      }

      fecharModal();
      carregarCursos();
    } catch (error: any) {
      let tituloErro = "Falha ao Salvar";
      let msg = "Não foi possível salvar o curso.";

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

  const handleDelete = (curso: any) => {
    mostrarAlerta(
      "Confirmar exclusão",
      `Deseja realmente remover o curso "${curso.name}"?`,
      "aviso",
      async () => {
        setAlertVisible(false);
        try {
          setIsLoading(true);
          await courseService.delete(curso.id);
          mostrarAlerta("Excluído", "Curso removido com sucesso.", "sucesso");
          carregarCursos();
        } catch (error: any) {
          setIsLoading(false);
          let tituloErro = "Erro ao Excluir";
          let msg = "Não foi possível excluir o curso no momento.";

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
    <View style={styles.courseCard}>
      <View style={styles.courseInfo}>
        <Text style={styles.courseName}>{item.name}</Text>

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

  const isEditando = cursoEmEdicao !== null;

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
        <Text style={styles.title}>Cursos ({cursos.length})</Text>
        <TouchableOpacity style={styles.addButton} onPress={abrirModalCriacao}>
          <MaterialCommunityIcons name="plus" size={20} color={COLORS.branco} />
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
          data={cursos}
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
              Nenhum curso cadastrado.
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
                  name={isEditando ? "pencil" : "school"}
                  size={28}
                  color={COLORS.textoPrincipal}
                />
                <Text style={styles.modalTitle}>
                  {isEditando ? "Editar curso" : "Criar novo curso"}
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
                <Text style={styles.label}>Nome do Curso</Text>
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
                      placeholder="Ex: Gestão Financeira"
                      placeholderTextColor="#999"
                      value={value}
                      onChangeText={onChange}
                      editable={!isSaving}
                      autoFocus
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
                style={[
                  styles.submitButton,
                  isSaving && { opacity: 0.7 },
                  { marginBottom: 10 },
                ]} 
                onPress={handleSubmit(onSalvarCurso)}
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

export default ManageCoursesScreen;
