import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Button,
  Animated,
  Easing,
  StatusBar,
  StyleSheet,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRoute, RouteProp } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RootStackParamList } from "../../navigation/types";
import { styles } from "./Scanner.style";
import FeedbackModal from "../../components/FeedbackModal";
import { COLORS } from "../../styles/colors";

const MOCK_ALUNOS_INSCRITOS: { [key: string]: string } = {
  RA0123: "Ana Carolina Pereira",
  RA4567: "Bruno Vasconcelos",
  RA8910: "Carlos Eduardo Lima",
};

type ScannerScreenRouteProp = RouteProp<RootStackParamList, "Scanner">;

const ScannerScreen = () => {
  const route = useRoute<ScannerScreenRouteProp>();
  const { eventName, eventId } = route.params;

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    type: "success" as "success" | "error",
    title: "",
    message: "",
  });

  const laserAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    requestPermission();
    Animated.loop(
      Animated.sequence([
        Animated.timing(laserAnimation, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(laserAnimation, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);

    const nomeAluno = MOCK_ALUNOS_INSCRITOS[data];

    if (nomeAluno) {
      setModalInfo({
        type: "success",
        title: "Presença Confirmada!",
        message: `Check-in de ${nomeAluno}\n(${data})\nregistrado com sucesso.`,
      });
    } else {
      setModalInfo({
        type: "error",
        title: "Aluno não Encontrado",
        message: `O QR Code não corresponde a um aluno inscrito neste evento.`,
      });
    }

    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setTimeout(() => setScanned(false), 1500);
  };

  const laserStyle = {
    transform: [
      {
        translateY: laserAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 275],
        }),
      },
    ],
  };

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Precisamos da sua permissão para usar a câmera.
        </Text>
        <Button
          title={"Conceder Permissão"}
          onPress={requestPermission}
          color={COLORS.vermelhoPrincipal}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" translucent />

      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      />

      <View style={styles.overlay}>
        <View style={styles.maskRow} />
        <View style={styles.maskCenter}>
          <View style={styles.maskRow} />
          <View style={styles.scannerHole}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            <Animated.View style={[styles.laser, laserStyle]} />
          </View>
          <View style={styles.maskRow} />
        </View>
        <View style={styles.maskRow} />
      </View>

      <View style={styles.uiContainer}>
        <View style={styles.headerRow}>
          <View style={styles.eventPill}>
            <Text style={styles.headerText} numberOfLines={1}>
              {eventName}
            </Text>
          </View>
        </View>

        <View style={styles.infoPill}>
          <MaterialCommunityIcons
            name="qrcode-scan"
            size={20}
            color={COLORS.branco}
          />
          <Text style={styles.infoText}>Aponte para o QR Code</Text>
        </View>
      </View>

      <FeedbackModal
        visible={modalVisible}
        type={modalInfo.type}
        title={modalInfo.title}
        message={modalInfo.message}
        onClose={handleCloseModal}
      />
    </View>
  );
};

export default ScannerScreen;
