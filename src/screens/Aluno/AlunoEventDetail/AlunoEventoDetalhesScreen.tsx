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
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../../styles/colors";
import { styles } from "./AlunoEventDetail.styles";

import CustomAlert from "../../../components/CustomAlert";

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
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    title: string;
    message: string;
    tipo: "sucesso" | "erro" | "aviso";
    onCloseAcao?: () => void;
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
  ) => {
    setAlertConfig({ title, message, tipo, onCloseAcao });
    setAlertVisible(true);
  };

  const abrirComoChegar = () => {
    const destino = evento?.local || "Fatec Itu - Dom Amaury Castanho";

    const url = Platform.select({
      ios: `maps:0,0?q=${destino}`,
      android: `geo:0,0?q=${destino}`,
    });

    if (url) {
      Linking.openURL(url).catch(() => {
        Linking.openURL(
          `https://www.google.com/maps/search/?api=1&query=${destino}`,
        );
      });
    }
  };

  const fazerInscricao = () => {
    mostrarAlerta(
      "Oba!",
      `Vamos preparar a sua inscrição para o evento:\n${evento?.nome || ""}`,
      "sucesso",
    );
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
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Image source={{ uri: evento?.imagemUrl }} style={styles.banner} />

        <View style={styles.contentCard}>
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
              style={styles.actionButton}
              activeOpacity={0.8}
              onPress={fazerInscricao}
            >
              <MaterialCommunityIcons
                name="ticket-confirmation-outline"
                size={20}
                color={COLORS.branco}
              />
              <Text style={styles.actionButtonText}>Garantir Vaga</Text>
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
      />
    </>
  );
}
