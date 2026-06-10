import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  RootStackParamList,
  AppNavigationProp,
} from "../../../navigation/types";
import { styles } from "./EventDetail.style";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../../styles/colors";
import CustomAlert from "../../../components/CustomAlert";
import { api } from "../../../factory/api";

type EventDetailRouteProp = RouteProp<RootStackParamList, "EventDetail">;

type Props = {
  navigation: AppNavigationProp;
};

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
}) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIconContainer}>
      <MaterialCommunityIcons name={icon} size={22} style={styles.infoIcon} />
    </View>
    <View style={styles.infoTextContainer}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const EventDetailScreen = ({ navigation }: Props) => {
  const route = useRoute<EventDetailRouteProp>();
  const { evento } = route.params;
  const insets = useSafeAreaInsets();

  const [palavraSecreta, setPalavraSecreta] = useState<string | null>(
    evento.presenceSecret || null,
  );
  const [buscandoPalavra, setBuscandoPalavra] = useState(false);

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
    textoCancelar?: string,
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
    const buscarPalavraSecretaAtualizada = async () => {
      if (!palavraSecreta && evento.id) {
        try {
          const resposta = await api.get("/events");
          const eventoAtualizado = resposta.data.find(
            (ev: any) => String(ev.id) === String(evento.id),
          );

          if (eventoAtualizado && eventoAtualizado.presenceSecret) {
            setPalavraSecreta(eventoAtualizado.presenceSecret);
          }
        } catch (error) {
          console.log("Erro ao buscar palavra secreta atualizada", error);
        }
      }
    };

    buscarPalavraSecretaAtualizada();
  }, [evento.id]);

  const formatarData = (dataISO: string) => {
    if (!dataISO) return "Data não informada";
    const dataObj = new Date(dataISO);
    const dia = dataObj.toLocaleDateString("pt-BR", { timeZone: "UTC" });
    const hora = dataObj.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
    return `${dia} às ${hora}`;
  };

  const handleExibirPalavraSecreta = async () => {
    if (!palavraSecreta) {
      setBuscandoPalavra(true);
      try {
        const resposta = await api.get("/events");
        const eventoAtualizado = resposta.data.find(
          (ev: any) => String(ev.id) === String(evento.id),
        );

        if (eventoAtualizado && eventoAtualizado.presenceSecret) {
          setPalavraSecreta(eventoAtualizado.presenceSecret);
          mostrarAlerta(
            "Palavra Secreta do Evento",
            `\nProjete ou informe esta palavra aos alunos para confirmação de presença:\n\n${eventoAtualizado.presenceSecret}`,
            "sucesso",
            undefined,
            "Fechar",
          );
        } else {
          mostrarAlerta(
            "Sem Palavra Secreta",
            "Este evento não tem nenhuma palavra definida no servidor.",
            "aviso",
          );
        }
      } catch (error) {
        mostrarAlerta(
          "Erro",
          "Não foi possível buscar a palavra no servidor",
          "erro",
        );
      } finally {
        setBuscandoPalavra(false);
      }
    } else {
      mostrarAlerta(
        "Palavra Secreta do Evento",
        `\nProjete ou informe esta palavra aos alunos para confirmação de presença:\n\n${palavraSecreta}`,
        "sucesso",
        undefined,
        "Fechar",
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <Image source={{ uri: evento.imagemUrl }} style={styles.banner} />

        <View
          style={[
            styles.contentCard,
            { paddingBottom: Math.max(insets.bottom + 40, 40) },
          ]}
        >
          <Text style={styles.title}>{evento.nome}</Text>

          <InfoRow
            icon="calendar-month-outline"
            label="Data do Evento"
            value={formatarData(evento.data)}
          />
          <InfoRow
            icon="map-marker-outline"
            label="Localização"
            value={evento.local || "A definir"}
          />
          <InfoRow
            icon="account-tie"
            label="Palestrante"
            value={evento.palestrante || "Não informado"}
          />
          <InfoRow
            icon="book-open-variant"
            label="Curso Destinado"
            value={evento.curso || "Todos os cursos"}
          />
          <InfoRow
            icon="school-outline"
            label="Semestre"
            value={evento.semestre || "Todos"}
          />

          <InfoRow
            icon={evento.eventoRestrito ? "lock" : "lock-open-variant"}
            label="Acesso ao Evento"
            value={
              evento.eventoRestrito
                ? "Restrito a alunos e colaboradores"
                : "Aberto ao público"
            }
          />

          <InfoRow
            icon="text-box-outline"
            label="Descrição"
            value={evento.descricao || "Sem descrição disponível."}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.8}
              onPress={handleExibirPalavraSecreta}
              disabled={buscandoPalavra}
            >
              {buscandoPalavra ? (
                <ActivityIndicator color={COLORS.branco} />
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="shield-key-outline"
                    size={20}
                    color={COLORS.branco}
                  />
                  <Text style={styles.actionButtonText}>
                    Exibir Palavra Secreta
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate("AttendanceList" as any, {
                  eventId: evento.id,
                })
              }
            >
              <MaterialCommunityIcons
                name="clipboard-check-outline"
                size={20}
                color={COLORS.vermelhoPrincipal}
              />
              <Text
                style={[styles.actionButtonText, styles.secondaryButtonText]}
              >
                Marcar Presença Manual
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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

export default EventDetailScreen;
