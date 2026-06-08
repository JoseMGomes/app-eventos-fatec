import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Image,
  ActivityIndicator,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { COLORS } from "../../../styles/colors";
import { styles } from "./CreateEventScreen.styles";
import { eventService } from "../../../services/eventService";
import { api } from "../../../factory/api";
import CustomAlert from "../../../components/CustomAlert";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createEventSchema,
  CreateEventFormData,
} from "../../../validations/schemas";

LocaleConfig.locales["pt-br"] = {
  monthNames: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
  monthNamesShort: [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ],
  dayNames: [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ],
  dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  today: "Hoje",
};
LocaleConfig.defaultLocale = "pt-br";

const OPCOES_SEMESTRE = [
  { id: "1SEMESTER", name: "1º Semestre" },
  { id: "2SEMESTER", name: "2º Semestre" },
  { id: "3SEMESTER", name: "3º Semestre" },
  { id: "4SEMESTER", name: "4º Semestre" },
  { id: "5SEMESTER", name: "5º Semestre" },
  { id: "6SEMESTER", name: "6º Semestre" },
  { id: "ALL", name: "Todos os Semestres" },
  { id: "ESPECIAL", name: "Especial" },
];

const formatarDataBR = (dataIso: string) => {
  if (!dataIso || !dataIso.includes("-")) return dataIso;
  const [ano, mes, dia] = dataIso.split("-");
  return `${dia}/${mes}/${ano}`;
};

function parseTime(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function formatTime(min: number): string {
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
}

const CreateEventScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [isSaving, setIsSaving] = useState(false);
  const [cursos, setCursos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [locais, setLocais] = useState<any[]>([]);
  const [datasLivres, setDatasLivres] = useState<string[]>([]);
  const [markedDates, setMarkedDates] = useState<any>({});
  const [blocosDeTempo, setBlocosDeTempo] = useState<any[]>([]);
  const [horariosInicioLivres, setHorariosInicioLivres] = useState<any[]>([]);
  const [horariosFimLivres, setHorariosFimLivres] = useState<any[]>([]);
  const [imagemUri, setImagemUri] = useState<string | null>(null);
  const [modalSelecaoVisible, setModalSelecaoVisible] = useState(false);
  const [modalCalendarioVisible, setModalCalendarioVisible] = useState(false);
  const [tipoSelecao, setTipoSelecao] = useState<
    "curso" | "categoria" | "local" | "semestre" | "horaInicio" | "horaFim"
  >("curso");

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateEventFormData & { presenceSecret?: string }>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      nome: "",
      localId: 0,
      data: "",
      horaInicio: "",
      horaFim: "",
      categoriaId: 0,
      cursoId: 0,
      semestre: "",
      limiteInscricoes: "",
      palestrante: "",
      eventoRestrito: false,
      descricao: "",
      presenceSecret: "",
    },
  });

  const localId = watch("localId");
  const data = watch("data");
  const horaInicio = watch("horaInicio");
  const horaFim = watch("horaFim");
  const cursoId = watch("cursoId");
  const categoriaId = watch("categoriaId");
  const semestre = watch("semestre");
  const eventoRestrito = watch("eventoRestrito");

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    title: string;
    message: string;
    tipo: "sucesso" | "erro" | "aviso";
    onCloseAcao?: () => void;
  }>({ title: "", message: "", tipo: "aviso" });

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
    carregarListasIniciais();
  }, []);

  const carregarListasIniciais = async () => {
    try {
      const [resCursos, resCat, resLocais] = await Promise.all([
        api.get("/courses"),
        api.get("/categories"),
        api.get("/locations").catch(() => ({ data: [] })),
      ]);
      setCursos(resCursos.data);
      setCategorias(resCat.data);
      setLocais(resLocais.data);
    } catch (error) {
      console.warn("Erro ao carregar listas:", error);
    }
  };

  useEffect(() => {
    if (localId && localId !== 0) {
      setValue("data", "");
      setValue("horaInicio", "");
      setValue("horaFim", "");

      const localSelecionado = locais.find((l) => l.id === localId);
      if (localSelecionado?.name.toLowerCase() === "outros") {
        setDatasLivres(["OUTROS"]);
        setMarkedDates({});
        return;
      }

      eventService
        .getAvailabilityDates(localId)
        .then((res) => {
          const marcadas: any = {};
          res.data.forEach((d: string) => {
            marcadas[d] = {
              disabled: false,
              textColor: COLORS.textoPrincipal,
              customStyles: { text: { fontWeight: "bold" } },
            };
          });
          setDatasLivres(res.data);
          setMarkedDates(marcadas);
        })
        .catch(() => {
          setDatasLivres([]);
          setMarkedDates({});
        });
    }
  }, [localId, locais, setValue]);

  useEffect(() => {
    if (localId && localId !== 0 && data) {
      setValue("horaInicio", "");
      setValue("horaFim", "");
      const localSelecionado = locais.find((l) => l.id === localId);

      const processarBlocos = (blocos: any[]) => {
        setBlocosDeTempo(blocos);
        const slotsIniciais = blocos.flatMap(({ start, end }) => {
          const s = parseTime(start);
          const e = parseTime(end);
          return Array.from(
            { length: Math.floor((e - 30 - s) / 30) + 1 },
            (_, i) => formatTime(s + i * 30),
          );
        });
        const unicos = [...new Set(slotsIniciais)].map((h) => ({
          id: h,
          name: h,
        }));
        setHorariosInicioLivres(unicos);
      };

      if (localSelecionado?.name.toLowerCase() === "outros") {
        processarBlocos([{ start: "07:00", end: "22:00" }]);
      } else {
        eventService
          .getAvailabilityTimes(localId, data)
          .then((res) => processarBlocos(res.data))
          .catch(() => setHorariosInicioLivres([]));
      }
    }
  }, [localId, data, locais, setValue]);

  useEffect(() => {
    if (horaInicio && blocosDeTempo.length > 0) {
      setValue("horaFim", "");
      const minInicio = parseTime(horaInicio);
      const m0 = minInicio + 30;
      const slotsFinais = blocosDeTempo.flatMap(({ start, end }) => {
        const s = parseTime(start);
        const eMax = parseTime(end);
        if (s <= minInicio && minInicio < eMax) {
          return Array.from(
            { length: Math.floor((eMax - m0) / 30) + 1 },
            (_, i) => formatTime(m0 + i * 30),
          );
        }
        return [];
      });

      const unicos = [...new Set(slotsFinais)].map((h) => ({ id: h, name: h }));
      setHorariosFimLivres(unicos);
    }
  }, [horaInicio, blocosDeTempo, setValue]);

  const escolherImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      mostrarAlerta(
        "Acesso Negado",
        "Precisamos de permissão para abrir a galeria.",
        "aviso",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled) setImagemUri(result.assets[0].uri);
  };

  const onSubmitValido = async (
    formData: CreateEventFormData & { presenceSecret?: string },
  ) => {
    if (!imagemUri) {
      mostrarAlerta("Atenção", "Adicione a imagem de capa do evento.", "aviso");
      return;
    }

    setIsSaving(true);
    try {
      const dataPayload = new FormData();
      dataPayload.append("name", formData.nome.trim());
      dataPayload.append(
        "description",
        formData.descricao?.trim() || "Sem descrição",
      );
      dataPayload.append("maxParticipants", formData.limiteInscricoes || "100");
      dataPayload.append("isRestricted", String(formData.eventoRestrito));
      dataPayload.append("locationId", String(formData.localId));
      dataPayload.append(
        "speakerName",
        formData.palestrante?.trim() || "A definir",
      );
      dataPayload.append("startDate", `${formData.data}T00:00:00Z`);
      dataPayload.append(
        "startTime",
        `${formData.data}T${formData.horaInicio}:00Z`,
      );
      dataPayload.append("endTime", `${formData.data}T${formData.horaFim}:00Z`);

      if (formData.cursoId && formData.cursoId !== 0)
        dataPayload.append("courseId", String(formData.cursoId));
      if (formData.semestre) dataPayload.append("semester", formData.semestre);
      if (formData.categoriaId && formData.categoriaId !== 0)
        dataPayload.append("categoryId", String(formData.categoriaId));

      if (formData.presenceSecret && formData.presenceSecret.trim() !== "") {
        dataPayload.append("presenceSecret", formData.presenceSecret.trim());
      }

      const filename = imagemUri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename || "");
      dataPayload.append("image", {
        uri: imagemUri,
        name: filename,
        type: match ? `image/${match[1]}` : `image`,
      } as any);

      await eventService.createEvent(dataPayload);
      mostrarAlerta("Sucesso!", "Evento criado com sucesso.", "sucesso", () =>
        navigation.goBack(),
      );
    } catch (error: any) {
      let tituloErro = "Falha ao Criar";
      let msg = "Não foi possível criar o evento no momento.";

      if (error.response) {
        msg =
          error.response.data?.message ||
          "O servidor recusou a criação do evento.";
      } else if (error.request || error.message === "Network Error") {
        tituloErro = "Sem Conexão";
        msg = "Falha de conexão. Verifique sua internet.";
      }
      mostrarAlerta(tituloErro, msg, "erro");
    } finally {
      setIsSaving(false);
    }
  };

  const abrirSelecao = (tipo: typeof tipoSelecao) => {
    setTipoSelecao(tipo);
    setModalSelecaoVisible(true);
  };

  const selecionarItem = (item: any) => {
    switch (tipoSelecao) {
      case "curso":
        setValue("cursoId", item.id);
        setValue("semestre", "");
        setValue("eventoRestrito", true);
        break;
      case "categoria":
        setValue("categoriaId", item.id);
        break;
      case "local":
        setValue("localId", item.id);
        break;
      case "semestre":
        setValue("semestre", item.id);
        break;
      case "horaInicio":
        setValue("horaInicio", item.id);
        break;
      case "horaFim":
        setValue("horaFim", item.id);
        break;
    }
    setModalSelecaoVisible(false);
  };

  const ehLocalOutros =
    locais.find((l) => l.id === localId)?.name.toLowerCase() === "outros";

  const getListaSelecao = () => {
    switch (tipoSelecao) {
      case "curso":
        return cursos;
      case "categoria":
        return categorias;
      case "local":
        return locais;
      case "semestre":
        return OPCOES_SEMESTRE;
      case "horaInicio":
        return horariosInicioLivres;
      case "horaFim":
        return horariosFimLivres;
      default:
        return [];
    }
  };

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
        <TouchableOpacity
          style={styles.imageUploadArea}
          activeOpacity={0.7}
          onPress={escolherImagem}
        >
          {imagemUri ? (
            <Image
              source={{ uri: imagemUri }}
              style={{ width: "100%", height: "100%", borderRadius: 10 }}
            />
          ) : (
            <>
              <MaterialCommunityIcons
                name="image-plus"
                size={40}
                color={COLORS.textoSecundario}
              />
              <Text style={styles.imageUploadText}>
                Adicionar imagem de capa *
              </Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do Evento *</Text>
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
                  placeholder="Ex: Hackathon FATEC"
                  placeholderTextColor="#999"
                  value={value}
                  onChangeText={onChange}
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
            <Text style={styles.label}>Sala / Localização *</Text>
            <TouchableOpacity
              style={[
                styles.input,
                errors.localId && {
                  borderColor: COLORS.vermelhoPrincipal,
                  borderWidth: 1,
                },
              ]}
              onPress={() => abrirSelecao("local")}
            >
              <Text
                style={{
                  color: localId
                    ? COLORS.textoPrincipal
                    : COLORS.textoSecundario,
                }}
              >
                {localId
                  ? locais.find((l) => l.id === localId)?.name
                  : "Selecione a sala..."}
              </Text>
            </TouchableOpacity>
            {errors.localId && (
              <Text
                style={{
                  color: COLORS.vermelhoPrincipal,
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                {errors.localId.message}
              </Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data Disponível *</Text>
            <TouchableOpacity
              style={[
                styles.input,
                !localId && styles.inputDisabled,
                errors.data && {
                  borderColor: COLORS.vermelhoPrincipal,
                  borderWidth: 1,
                },
              ]}
              onPress={() => {
                if (!localId) return;
                ehLocalOutros
                  ? abrirSelecao("data" as any)
                  : setModalCalendarioVisible(true);
              }}
            >
              <Text
                style={{
                  color: data ? COLORS.textoPrincipal : COLORS.textoSecundario,
                }}
              >
                {data
                  ? formatarDataBR(data)
                  : localId
                    ? "Escolher data..."
                    : "Escolha a sala primeiro"}
              </Text>
            </TouchableOpacity>
            {errors.data && (
              <Text
                style={{
                  color: COLORS.vermelhoPrincipal,
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                {errors.data.message}
              </Text>
            )}
          </View>

          {ehLocalOutros && !data && (
            <Controller
              control={control}
              name="data"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, { marginTop: -15, marginBottom: 15 }]}
                  placeholder="Digite a data (YYYY-MM-DD)"
                  placeholderTextColor="#999"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          )}

          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Início *</Text>
              <TouchableOpacity
                style={[
                  styles.input,
                  !data && styles.inputDisabled,
                  errors.horaInicio && {
                    borderColor: COLORS.vermelhoPrincipal,
                    borderWidth: 1,
                  },
                ]}
                onPress={() => data && abrirSelecao("horaInicio")}
              >
                <Text
                  style={{
                    color: horaInicio
                      ? COLORS.textoPrincipal
                      : COLORS.textoSecundario,
                  }}
                >
                  {horaInicio || "HH:MM"}
                </Text>
              </TouchableOpacity>
              {errors.horaInicio && (
                <Text
                  style={{
                    color: COLORS.vermelhoPrincipal,
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  {errors.horaInicio.message}
                </Text>
              )}
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Término *</Text>
              <TouchableOpacity
                style={[
                  styles.input,
                  !horaInicio && styles.inputDisabled,
                  errors.horaFim && {
                    borderColor: COLORS.vermelhoPrincipal,
                    borderWidth: 1,
                  },
                ]}
                onPress={() => horaInicio && abrirSelecao("horaFim")}
              >
                <Text
                  style={{
                    color: horaFim
                      ? COLORS.textoPrincipal
                      : COLORS.textoSecundario,
                  }}
                >
                  {horaFim || "HH:MM"}
                </Text>
              </TouchableOpacity>
              {errors.horaFim && (
                <Text
                  style={{
                    color: COLORS.vermelhoPrincipal,
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  {errors.horaFim.message}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Categoria</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => abrirSelecao("categoria")}
            >
              <Text
                style={{
                  color: categoriaId
                    ? COLORS.textoPrincipal
                    : COLORS.textoSecundario,
                }}
              >
                {categoriaId
                  ? categorias.find((c) => c.id === categoriaId)?.name
                  : "Selecione..."}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Curso Destinado</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => abrirSelecao("curso")}
            >
              <Text
                style={{
                  color: cursoId
                    ? COLORS.textoPrincipal
                    : COLORS.textoSecundario,
                }}
              >
                {cursoId
                  ? cursos.find((c) => c.id === cursoId)?.name
                  : "Selecione..."}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Semestre</Text>
            <TouchableOpacity
              style={[styles.input, !cursoId && styles.inputDisabled]}
              onPress={() => cursoId && abrirSelecao("semestre")}
            >
              <Text
                style={{
                  color: semestre
                    ? COLORS.textoPrincipal
                    : COLORS.textoSecundario,
                }}
              >
                {semestre
                  ? OPCOES_SEMESTRE.find((s) => s.id === semestre)?.name
                  : cursoId
                    ? "Selecione o semestre..."
                    : "Escolha o curso primeiro"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Limite de Inscrições</Text>
            <Controller
              control={control}
              name="limiteInscricoes"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 50"
                  placeholderTextColor="#999"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="numeric"
                />
              )}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Palestrante / Responsável</Text>
            <Controller
              control={control}
              name="palestrante"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Prof. Silva"
                  placeholderTextColor="#999"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          <View style={styles.switchGroup}>
            <Text style={styles.switchLabel}>
              Evento Restrito (Apenas alunos)?
            </Text>
            <Switch
              trackColor={{ false: "#E0E0E0", true: "rgba(169, 0, 0, 0.5)" }}
              thumbColor={eventoRestrito ? COLORS.vermelhoPrincipal : "#f4f3f4"}
              onValueChange={(val) => setValue("eventoRestrito", val)}
              value={eventoRestrito}
              disabled={!!cursoId}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição do Evento</Text>
            <Controller
              control={control}
              name="descricao"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Escreva os detalhes aqui..."
                  placeholderTextColor="#999"
                  value={value}
                  onChangeText={onChange}
                  multiline
                  numberOfLines={5}
                />
              )}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Palavra Secreta (Check-in)</Text>
            <Controller
              control={control}
              name="presenceSecret"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Ex: FATEC123 (Opcional)"
                  placeholderTextColor="#999"
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="characters"
                />
              )}
            />
            <Text
              style={{
                color: COLORS.textoSecundario,
                fontSize: 12,
                marginTop: 4,
              }}
            >
              Os alunos precisarão desta palavra para registrar presença.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isSaving && { opacity: 0.7 }]}
          activeOpacity={0.8}
          onPress={handleSubmit(onSubmitValido)}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color={COLORS.branco} />
          ) : (
            <Text style={styles.submitButtonText}>Criar Evento</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={modalCalendarioVisible} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View
            style={{ backgroundColor: "#FFF", borderRadius: 15, padding: 10 }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                fontWeight: "bold",
                marginVertical: 10,
                color: COLORS.textoPrincipal,
              }}
            >
              Escolha um dia (Números em negrito estão livres)
            </Text>
            <Calendar
              markedDates={markedDates}
              markingType={"custom"}
              minDate={new Date().toISOString().split("T")[0]}
              onDayPress={(day: any) => {
                if (datasLivres.includes(day.dateString)) {
                  setValue("data", day.dateString);
                  setModalCalendarioVisible(false);
                } else {
                  mostrarAlerta(
                    "Indisponível",
                    "Esta sala já está ocupada ou não possui horários neste dia.",
                    "aviso",
                  );
                }
              }}
              theme={{
                todayTextColor: COLORS.vermelhoPrincipal,
                arrowColor: COLORS.vermelhoPrincipal,
                textDisabledColor: "#d9e1e8",
              }}
            />
            <TouchableOpacity
              style={{ marginTop: 15, alignItems: "center", padding: 10 }}
              onPress={() => setModalCalendarioVisible(false)}
            >
              <Text
                style={{
                  color: COLORS.textoSecundario,
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={modalSelecaoVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "#FFF",
              padding: 20,
              paddingBottom: Math.max(insets.bottom + 20, 20),
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              maxHeight: "60%",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 15,
                color: COLORS.textoPrincipal,
              }}
            >
              Selecione uma opção
            </Text>
            <FlatList
              data={getListaSelecao()}
              keyExtractor={(item, index) =>
                item.id ? String(item.id) : String(index)
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    padding: 15,
                    borderBottomWidth: 1,
                    borderColor: "#EEE",
                  }}
                  onPress={() => selecionarItem(item)}
                >
                  <Text style={{ fontSize: 16, color: COLORS.textoPrincipal }}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <Text
                  style={{
                    padding: 15,
                    color: COLORS.textoSecundario,
                    textAlign: "center",
                  }}
                >
                  Nenhum item disponível.
                </Text>
              }
            />
            <TouchableOpacity
              style={{
                marginTop: 15,
                alignItems: "center",
                paddingVertical: 10,
              }}
              onPress={() => setModalSelecaoVisible(false)}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: COLORS.vermelhoPrincipal,
                  fontWeight: "bold",
                }}
              >
                Fechar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        tipo={alertConfig.tipo}
        onClose={() => {
          setAlertVisible(false);
          if (alertConfig.onCloseAcao) alertConfig.onCloseAcao();
        }}
      />
    </KeyboardAvoidingView>
  );
};

export default CreateEventScreen;
