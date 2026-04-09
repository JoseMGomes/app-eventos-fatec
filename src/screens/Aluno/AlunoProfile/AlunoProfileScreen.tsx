import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../../styles/colors";
import { styles } from "./AlunoProfileScreen.styles";

const ProfileScreen = () => {
  const [nome, setNome] = useState("José Lucas");
  const [ra, setRa] = useState("");
  const [curso, setCurso] = useState("");
  const [semestre, setSemestre] = useState("");
  const [telefone, setTelefone] = useState("");

  const [porcentagem, setPorcentagem] = useState(0);
  const widthAnim = React.useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const campos = [nome, ra, curso, semestre, telefone];
    const camposPreenchidos = campos.filter(
      (campo) => campo.trim().length > 0,
    ).length;
    const calculo = Math.round((camposPreenchidos / campos.length) * 100);

    setPorcentagem(calculo);
    Animated.timing(widthAnim, {
      toValue: calculo,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [nome, ra, curso, semestre, telefone]);

  const handleSalvarPerfil = () => {
    if (porcentagem < 100) {
      Alert.alert(
        "Perfil Incompleto",
        "Preencha todos os campos para chegar a 100%. Isso facilita a sua inscrição nos eventos!",
      );
      return;
    }

    Alert.alert(
      "Sucesso!",
      "Seu perfil está 100% completo. Agora você pode se inscrever em qualquer evento com 1 clique.",
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meu Perfil</Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressTextRow}>
            <Text style={styles.progressTitle}>
              {porcentagem === 100 ? "Perfil Completo!" : "Complete seu perfil"}
            </Text>
            <Text style={styles.progressPercent}>{porcentagem}%</Text>
          </View>

          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: widthAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["0%", "100%"],
                  }),
                  backgroundColor: porcentagem === 100 ? "#2ECC71" : "#F39C12",
                },
              ]}
            />
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Dados Acadêmicos</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome Completo</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="account-outline"
              size={20}
              color={COLORS.textoSecundario}
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Ex: José Lucas"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>RA (Registro do Aluno)</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="card-account-details-outline"
              size={20}
              color={COLORS.textoSecundario}
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              value={ra}
              onChangeText={setRa}
              placeholder="Ex: 111222333"
              keyboardType="number-pad"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Curso</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="school-outline"
              size={20}
              color={COLORS.textoSecundario}
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              value={curso}
              onChangeText={setCurso}
              placeholder="Ex: Análise e Desenvolvimento de Sistemas"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Semestre</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="calendar-clock-outline"
              size={20}
              color={COLORS.textoSecundario}
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              value={semestre}
              onChangeText={setSemestre}
              placeholder="Ex: 5º Semestre"
              keyboardType="number-pad"
              maxLength={1}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Telefone / WhatsApp</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="phone-outline"
              size={20}
              color={COLORS.textoSecundario}
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              value={telefone}
              onChangeText={setTelefone}
              placeholder="Ex: (11) 99999-9999"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.8}
          onPress={handleSalvarPerfil}
        >
          <MaterialCommunityIcons
            name="content-save-outline"
            size={20}
            color={COLORS.branco}
          />
          <Text style={styles.saveButtonText}>Salvar Dados</Text>
        </TouchableOpacity>

        <Text style={styles.helperText}>
          Os seus dados serão utilizados automaticamente para gerar a lista de
          presença e certificados dos eventos que participar.
        </Text>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
