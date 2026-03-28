import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../styles/colors";
import { styles } from "./CheckinAlunoScreen.styles";

const FATEC_COORDENADAS = {
  latitude: -23.290387,
  longitude: -47.296153,
};
const RAIO_PERMITIDO_METROS = 50;

const CheckinAlunoScreen = () => {
  const navigation = useNavigation();
  const [localizacaoAluno, setLocalizacaoAluno] =
    useState<Location.LocationObject | null>(null);
  const [distancia, setDistancia] = useState<number | null>(null);
  const [palavraSecreta, setPalavraSecreta] = useState("");
  const [carregandoGPS, setCarregandoGPS] = useState(true);

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
    if (dist >= 1000) {
      return `${(dist / 1000).toFixed(1)} km`;
    }
    return `${dist}m`;
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão negada",
          "Precisamos do seu GPS para validar a presença no evento.",
        );
        setCarregandoGPS(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      setLocalizacaoAluno(location);

      const dist = calcularDistancia(
        location.coords.latitude,
        location.coords.longitude,
        FATEC_COORDENADAS.latitude,
        FATEC_COORDENADAS.longitude,
      );
      setDistancia(dist);
      setCarregandoGPS(false);
    })();
  }, []);

  const handleValidarPresenca = () => {
    if (!palavraSecreta.trim()) {
      Alert.alert("Erro", "Digite a palavra secreta fornecida pelo professor.");
      return;
    }

    if (distancia !== null && distancia > RAIO_PERMITIDO_METROS) {
      Alert.alert(
        "Fora do Local",
        `Você está a ${formatarDistancia(distancia)} do evento. É necessário estar a no máximo ${RAIO_PERMITIDO_METROS} metros para validar a presença.`,
      );
      return;
    }

    Alert.alert(
      "Sucesso!",
      "Sua presença foi validada com sucesso via GPS e Palavra Secreta.",
    );
    navigation.goBack();
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
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        {localizacaoAluno && (
          <MapView
            style={styles.map}
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
        )}
      </View>

      <View style={styles.panel}>
        <Text style={styles.title}>Validar Presença</Text>
        <Text style={styles.subtitle}>
          Confirme sua localização e digite o código do painel.
        </Text>

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
            size={20}
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
                : `Você está muito longe (${formatarDistancia(distancia)})`
              : "Calculando distância..."}
          </Text>
        </View>

        <Text style={styles.inputLabel}>Palavra Secreta do Professor</Text>
        <TextInput
          style={styles.input}
          value={palavraSecreta}
          onChangeText={setPalavraSecreta}
          placeholder="EX: REACT2026"
          placeholderTextColor="#CCC"
          autoCapitalize="characters"
          maxLength={10}
        />

        <TouchableOpacity
          style={[
            styles.confirmButton,
            (!estaNoRaio || palavraSecreta.length < 3) &&
              styles.confirmButtonDisabled,
          ]}
          activeOpacity={0.8}
          onPress={handleValidarPresenca}
        >
          <MaterialCommunityIcons
            name="check-decagram"
            size={20}
            color={COLORS.branco}
          />
          <Text style={styles.confirmButtonText}>Confirmar Presença</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CheckinAlunoScreen;
