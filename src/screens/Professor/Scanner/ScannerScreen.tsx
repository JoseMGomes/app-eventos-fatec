import { useRoute } from "@react-navigation/native";
import React, { useEffect } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./Scanner.style";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../../styles/colors";
import CustomAlert from "../../../components/CustomAlert";

const ScannerScreen = () => {
  const route = useRoute<any>();
  const eventName = route.params?.eventName || "Palestra de Tecnologia";

  const [isCheckedActive, setIsCheckedActive] = React.useState(false);
  const [secretWord, setSecretWord] = React.useState("");
  const [timeLeft, setTimeLeft] = React.useState(900);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    title: string;
    message: string;
    tipo: "sucesso" | "erro" | "aviso";
  }>({
    title: "",
    message: "",
    tipo: "aviso",
  });

  const mostrarAlerta = (
    title: string,
    message: string,
    tipo: "sucesso" | "erro" | "aviso",
  ) => {
    setAlertConfig({ title, message, tipo });
    setAlertVisible(true);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCheckedActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isCheckedActive) {
      handleEncerrarCheckIn();
      mostrarAlerta(
        "Tempo Esgotado",
        "Os 15 minutos para o check-in se passaram. A palavra secreta foi desativada.",
        "aviso",
      );
    }
    return () => clearInterval(timer);
  }, [isCheckedActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleIniciarCheckIn = () => {
    const palavraLimpa = secretWord.trim();
    if (palavraLimpa.length > 0 && palavraLimpa.length < 3) {
      mostrarAlerta(
        "Palavra muito curta",
        "A palavra secreta deve ter no mínimo 3 caracteres, ou deixe em branco para sortear uma.",
        "aviso",
      );
      return;
    }

    if (!palavraLimpa) {
      const randomWord = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();
      setSecretWord(randomWord);
    } else {
      setSecretWord(palavraLimpa.toUpperCase());
    }

    setIsCheckedActive(true);
    setTimeLeft(900);
  };

  const handleEncerrarCheckIn = () => {
    setIsCheckedActive(false);
    setSecretWord("");
    setTimeLeft(900);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.eventName}>{eventName}</Text>
          <Text style={styles.subtitle}>Painel de check-in do Professor</Text>
        </View>
        <View style={styles.card}>
          {isCheckedActive ? (
            <>
              <View style={styles.qrPlaceholder}>
                <MaterialCommunityIcons
                  name="qrcode-scan"
                  size={180}
                  color={COLORS.textoPrincipal}
                />
              </View>

              <View style={styles.wordContainer}>
                <Text style={styles.wordLabel}>Palavra Secreta:</Text>
                <Text style={styles.wordText}>{secretWord}</Text>
              </View>

              <View style={styles.timerContainer}>
                <MaterialCommunityIcons
                  name="timer-outline"
                  size={24}
                  color="#e67e22"
                />
                <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: COLORS.textoPrincipal },
                ]}
                onPress={handleEncerrarCheckIn}
              >
                <MaterialCommunityIcons
                  name="stop-circle-outline"
                  size={20}
                  color={COLORS.branco}
                />
                <Text style={styles.buttonText}>Encerrar Check-in</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <MaterialCommunityIcons
                name="shield-key-outline"
                size={120}
                color={COLORS.vermelhoPrincipal}
                style={{ marginBottom: 20 }}
              />
              <Text style={styles.helperText}>
                Defina uma palavra secreta para os alunos digitarem no
                aplicativo, ou deixe em branco para gerar uma palavra aleatória.
                O código ficará válido por 15 minutos.
              </Text>

              <TextInput
                style={styles.input}
                placeholder="EX: FATEC2026"
                placeholderTextColor="#CCC"
                value={secretWord}
                onChangeText={setSecretWord}
                autoCapitalize="characters"
                maxLength={15}
              />

              <TouchableOpacity
                style={styles.button}
                onPress={handleIniciarCheckIn}
              >
                <MaterialCommunityIcons
                  name="play-circle-outline"
                  size={20}
                  color={COLORS.branco}
                />
                <Text style={styles.buttonText}>Iniciar Check-in (15 min)</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        tipo={alertConfig.tipo}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
};

export default ScannerScreen;
