import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../../styles/colors";
import { styles } from "./CheckinAlunoScreen.styles";
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from "react-native-maps";
import CustomAlert from "../../../components/CustomAlert";
import { participantService } from "../../../services/participantService";

const FATEC_COORDENADAS = {
  latitude: -23.29034,
  longitude: -47.29572,
};
const RAIO_PERMITIDO_METROS = 150;

const CheckinAlunoScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const { eventId, participantId } = (route.params as any) || {};
  const [distancia, setDistancia] = useState<number | null>(null);
  const [palavraSecreta, setPalavraSecreta] = useState("");
  const [carregandoGPS, setCarregandoGPS] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
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

  const calcularDistancia = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
    const raioDaTerraEmMetros = 6371e3;
    const latitude1EmRadianos = (lat1 * Math.PI) / 180;
    const latitude2EmRadianos = (lat2 * Math.PI) / 180;
    const diferencaLatitudeEmRadianos = ((lat2 - lat1) * Math.PI) / 180;
    const diferencaLongitudeEmRadianos = ((lon2 - lon1) * Math.PI) / 180;

    const fatorCurvatura =
      Math.sin(diferencaLatitudeEmRadianos / 2) *
        Math.sin(diferencaLatitudeEmRadianos / 2) +
      Math.cos(latitude1EmRadianos) *
        Math.cos(latitude2EmRadianos) *
        Math.sin(diferencaLongitudeEmRadianos / 2) *
        Math.sin(diferencaLongitudeEmRadianos / 2);

    const distanciaAngular =
      2 * Math.atan2(Math.sqrt(fatorCurvatura), Math.sqrt(1 - fatorCurvatura));
    return Math.round(raioDaTerraEmMetros * distanciaAngular);
  };

  const formatarDistancia = (dist: number) => {
    if (dist >= 1000) return `${(dist / 1000).toFixed(1)} km`;
    return `${dist}m`;
  };

  const abrirRotas = () => {
    const latLng = `${FATEC_COORDENADAS.latitude},${FATEC_COORDENADAS.longitude}`;
    const label = "Fatec Itu";

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

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          mostrarAlerta(
            "Permissão negada",
            "Precisamos do seu GPS para validar a presença.",
            "erro",
          );
          setCarregandoGPS(false);
          return;
        }
        let providerStatus = await Location.getProviderStatusAsync();
        if (!providerStatus.locationServicesEnabled) {
          mostrarAlerta(
            "GPS Desativado",
            "Por favor, ative o GPS e tente novamente.",
            "aviso",
          );
          setCarregandoGPS(false);
          return;
        }
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const dist = calcularDistancia(
          location.coords.latitude,
          location.coords.longitude,
          FATEC_COORDENADAS.latitude,
          FATEC_COORDENADAS.longitude,
        );
        setDistancia(dist);
      } catch (error) {
        mostrarAlerta(
          "Sinal Fraco",
          "Não foi possível buscar sua localização atual. Verifique seu sinal.",
          "erro",
        );
      } finally {
        setCarregandoGPS(false);
      }
    })();
  }, []);

  const handleValidarPresenca = async () => {
    if (!eventId || !participantId) {
      mostrarAlerta(
        "Erro de Rota",
        "Informações da inscrição perdidas. Volte e tente novamente.",
        "erro",
      );
      return;
    }

    if (!palavraSecreta.trim()) {
      mostrarAlerta(
        "Atenção",
        "Digite a palavra secreta fornecida pelo professor.",
        "aviso",
      );
      return;
    }

    if (distancia !== null && distancia > RAIO_PERMITIDO_METROS) {
      mostrarAlerta(
        "Fora do Local",
        `Você está a ${formatarDistancia(distancia)} do evento. É necessário estar a no máximo ${RAIO_PERMITIDO_METROS}m.`,
        "erro",
      );
      return;
    }

    setIsConfirming(true);
    try {
      await participantService.confirmPresenceWithSecret(
        eventId,
        participantId,
        palavraSecreta.trim(),
      );

      mostrarAlerta(
        "Sucesso!",
        "Sua presença foi validada com sucesso via GPS e Palavra Secreta.",
        "sucesso",
        () => navigation.goBack(),
      );
    } catch (error: any) {
      let msgErro = "Palavra secreta inválida ou erro no servidor.";
      if (error.response?.data?.message) {
        msgErro = Array.isArray(error.response.data.message)
          ? error.response.data.message[0]
          : String(error.response.data.message).split(",")[0];
      }
      mostrarAlerta("Falha na Validação", msgErro, "erro");
    } finally {
      setIsConfirming(false);
    }
  };

  if (carregandoGPS) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.vermelhoPrincipal} />
        <Text style={{ marginTop: 10, color: COLORS.textoSecundario }}>
          Sintonizando satélites GPS...
        </Text>
      </View>
    );
  }

  const estaNoRaio = distancia !== null && distancia <= RAIO_PERMITIDO_METROS;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: FATEC_COORDENADAS.latitude,
            longitude: FATEC_COORDENADAS.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          showsUserLocation={true}
        >
          <Marker
            coordinate={FATEC_COORDENADAS}
            title="Fatec Itu"
            description="Local do Evento"
            pinColor={COLORS.vermelhoPrincipal}
          />
          <Circle
            center={FATEC_COORDENADAS}
            radius={RAIO_PERMITIDO_METROS}
            fillColor="rgba(169, 0, 0, 0.15)"
            strokeColor={COLORS.vermelhoPrincipal}
          />
        </MapView>
      </View>

      <ScrollView
        style={styles.panel}
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom + 20, 30),
        }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Text style={styles.title}>Validar Presença</Text>
        <Text style={styles.subtitle}>
          Confirme sua localização e digite o código do painel.
        </Text>

        <View style={styles.badgesRow}>
          <View
            style={[
              styles.distanceBadge,
              { backgroundColor: estaNoRaio ? "#E8F5E9" : "#FCE8E8" },
            ]}
          >
            <MaterialCommunityIcons
              name={
                estaNoRaio
                  ? "map-marker-check-outline"
                  : "map-marker-alert-outline"
              }
              size={18}
              color={estaNoRaio ? "#27AE60" : COLORS.vermelhoPrincipal}
            />
            <Text
              style={[
                styles.distanceText,
                { color: estaNoRaio ? "#27AE60" : COLORS.vermelhoPrincipal },
              ]}
            >
              {distancia !== null
                ? estaNoRaio
                  ? `Você está no local (${formatarDistancia(distancia)})`
                  : `Você está longe (${formatarDistancia(distancia)})`
                : "Calculando..."}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.routeButton}
            activeOpacity={0.7}
            onPress={abrirRotas}
          >
            <MaterialCommunityIcons
              name="directions"
              size={18}
              color={COLORS.vermelhoPrincipal}
            />
            <Text style={styles.routeButtonText}>Como chegar</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.inputLabel}>Palavra Secreta do Professor</Text>
        <TextInput
          style={styles.input}
          value={palavraSecreta}
          onChangeText={setPalavraSecreta}
          placeholder="EX: REACT2026"
          placeholderTextColor="#CCC"
          autoCapitalize="none"
          editable={!isConfirming}
        />

        <TouchableOpacity
          style={[
            styles.confirmButton,
            (!estaNoRaio || palavraSecreta.length < 3 || isConfirming) &&
              styles.confirmButtonDisabled,
          ]}
          activeOpacity={0.8}
          onPress={handleValidarPresenca}
          disabled={!estaNoRaio || palavraSecreta.length < 3 || isConfirming}
        >
          {isConfirming ? (
            <ActivityIndicator color={COLORS.branco} />
          ) : (
            <>
              <MaterialCommunityIcons
                name="check-decagram"
                size={20}
                color={COLORS.branco}
              />
              <Text style={styles.confirmButtonText}>Confirmar Presença</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

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

export default CheckinAlunoScreen;
