import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
  Image,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { COLORS } from "../../../styles/colors";
import { styles } from "./AlunoEventDetail.styles";
import CustomAlert from "../../../components/CustomAlert";
import { participantService } from "../../../services/participantService";
import { courseService } from "../../../services/courseService";

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

export default function AlunoEventoDetalhesScreen({ route, navigation }: any) {
  const { evento } = route.params || {};
  const insets = useSafeAreaInsets();

  const [isSubscribing, setIsSubscribing] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    title: string;
    message: string;
    tipo: "sucesso" | "erro" | "aviso";
    onCloseAcao?: () => void;
    textoConfirmar?: string;
  }>({
    title: "",
    message: "",
    tipo: "aviso",
  });

  const mostrarAlerta = (
    title: string,
    message: string,
    tipo: "sucesso" | "erro" | "aviso",
    onCloseAcao?: () => void,
    textoConfirmar = "OK",
  ) => {
    setAlertConfig({ title, message, tipo, onCloseAcao, textoConfirmar });
    setAlertVisible(true);
  };

  const abrirComoChegar = () => {
    const latLng = "-23.29034,-47.29572";
    const label = evento?.local ? `Fatec Itu - ${evento.local}` : "Fatec Itu";

    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${latLng}`,
      android: `geo:0,0?q=${latLng}(${label})`,
    });

    if (url) {
      Linking.openURL(url).catch(() => {
        Linking.openURL(
          `https://www.google.com/maps/search/?api=1&query=${latLng}`,
        );
      });
    }
  };

  const formatarSemestreParaBackend = (semestreStr: string) => {
    if (!semestreStr) return null;
    if (semestreStr === "Especial") return "ESPECIAL";
    return `SEMESTER${semestreStr.replace("º", "")}`;
  };

  const buscarIdDoCurso = async (nomeDoCurso: string) => {
    if (!nomeDoCurso) return undefined;
    try {
      const response = await courseService.getAllPublic();
      const cursoEncontrado = response.data.find(
        (c: any) => c.name === nomeDoCurso,
      );
      return cursoEncontrado ? Number(cursoEncontrado.id) : undefined;
    } catch (e) {
      return undefined;
    }
  };

  const fazerInscricao = async () => {
    setIsSubscribing(true);

    try {
      const perfilStr = await SecureStore.getItemAsync("perfil_aluno");

      if (!perfilStr) {
        mostrarAlerta(
          "Perfil Incompleto",
          "Você precisa preencher seu perfil antes de se inscrever.",
          "aviso",
          () => {
            navigation.navigate("Profile");
          },
          "Ir para o Perfil",
        );
        setIsSubscribing(false);
        return;
      }

      const perfil = JSON.parse(perfilStr);

      const camposObrigatorios =
        perfil.tipo === "VISITANTE"
          ? [perfil.nome, perfil.email, perfil.telefone]
          : [
              perfil.nome,
              perfil.ra,
              perfil.curso,
              perfil.semestre,
              perfil.telefone,
            ];

      const camposPreenchidos = camposObrigatorios.filter(
        (campo) => campo && String(campo).trim().length > 0,
      ).length;

      const porcentagem =
        camposObrigatorios.length > 0
          ? Math.round((camposPreenchidos / camposObrigatorios.length) * 100)
          : 0;

      if (porcentagem < 100) {
        mostrarAlerta(
          "Perfil Incompleto",
          `Seu perfil está apenas ${porcentagem}% completo. Vá até a aba "Meu Perfil" e preencha todos os dados para liberar a inscrição.`,
          "aviso",
          () => navigation.navigate("Profile"),
          "Completar Perfil",
        );
        setIsSubscribing(false);
        return;
      }

      let courseIdBackend;
      if (perfil.tipo === "ALUNO" && perfil.curso) {
        courseIdBackend = await buscarIdDoCurso(perfil.curso);
      }

      const payload: any = {
        eventId: evento.id,
        name: perfil.nome,
        email: perfil.email,
        ra: perfil.tipo === "ALUNO" ? perfil.ra : null,
        semester:
          perfil.tipo === "ALUNO"
            ? formatarSemestreParaBackend(perfil.semestre)
            : null,
      };

      if (courseIdBackend) {
        payload.courseId = courseIdBackend;
      }

      await participantService.createParticipant(payload);

      mostrarAlerta(
        "Inscrição Confirmada!",
        `Você garantiu sua vaga no evento:\n${evento?.nome || ""}\n\nEnviamos um comprovante para o seu e-mail.`,
        "sucesso",
        () => navigation.goBack(),
      );
    } catch (error: any) {
      let msgErro = "Não foi possível realizar sua inscrição. Tente novamente.";
      if (error.response?.data?.message) {
        msgErro = Array.isArray(error.response.data.message)
          ? error.response.data.message[0]
          : String(error.response.data.message).split(",")[0];
      }
      mostrarAlerta("Falha na Inscrição", msgErro, "erro");
    } finally {
      setIsSubscribing(false);
    }
  };

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

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <Image source={{ uri: evento?.imagemUrl }} style={styles.banner} />

        <View
          style={[
            styles.contentCard,
            { paddingBottom: Math.max(insets.bottom + 40, 40) },
          ]}
        >
          <Text style={styles.title}>{evento?.nome || "Nome do Evento"}</Text>

          <InfoRow
            icon="calendar-month-outline"
            label="Data do Evento"
            value={formatarData(evento?.data)}
          />
          <InfoRow
            icon="map-marker-outline"
            label="Localização"
            value={evento?.local || "A definir"}
          />
          <InfoRow
            icon="shape-outline"
            label="Categoria"
            value={evento?.categoria || "Geral"}
          />
          <InfoRow
            icon="account-tie"
            label="Palestrante"
            value={evento?.palestrante || "Não informado"}
          />
          <InfoRow
            icon="book-open-variant"
            label="Curso Destinado"
            value={evento?.curso || "Todos os cursos"}
          />
          <InfoRow
            icon="school-outline"
            label="Semestre"
            value={evento?.semestre || "Todos"}
          />
          <InfoRow
            icon={evento?.eventoRestrito ? "lock" : "lock-open-variant"}
            label="Acesso ao Evento"
            value={
              evento?.eventoRestrito
                ? "Restrito a alunos e colaboradores"
                : "Aberto ao público"
            }
          />
          <InfoRow
            icon="text-box-outline"
            label="Descrição"
            value={evento?.descricao || "Sem descrição disponível."}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.actionButton, isSubscribing && { opacity: 0.7 }]}
              activeOpacity={0.8}
              onPress={fazerInscricao}
              disabled={isSubscribing}
            >
              {isSubscribing ? (
                <ActivityIndicator color={COLORS.branco} size="small" />
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="ticket-confirmation-outline"
                    size={20}
                    color={COLORS.branco}
                  />
                  <Text style={styles.actionButtonText}>Garantir Vaga</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              activeOpacity={0.8}
              onPress={abrirComoChegar}
            >
              <MaterialCommunityIcons
                name="map-marker-path"
                size={20}
                color={COLORS.vermelhoPrincipal}
              />
              <Text
                style={[styles.actionButtonText, styles.secondaryButtonText]}
              >
                Como Chegar no Local
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
        onClose={() => {
          setAlertVisible(false);
          if (alertConfig.onCloseAcao) {
            alertConfig.onCloseAcao();
          }
        }}
        textoConfirmar={alertConfig.textoConfirmar}
      />
    </View>
  );
}
