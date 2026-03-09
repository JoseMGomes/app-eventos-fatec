import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../styles/colors";
import { styles } from "./CreateEventScreen.styles";

const CreateEventScreen = () => {
  const navigation = useNavigation();

  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [curso, setCurso] = useState("");
  const [semestre, setSemestre] = useState("");
  const [limiteInscricoes, setLimiteInscricoes] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [palestrante, setPalestrante] = useState("");
  const [data, setData] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");
  const [eventoRestrito, setEventoRestrito] = useState(false);
  const [descricao, setDescricao] = useState("");

  const isSemestreLiberado = curso.trim().length > 0;
  const isDataLiberada = localizacao.trim().length > 0;
  const isHoraInicioLiberada = data.trim().length > 0;
  const isHoraFimLiberada = horaInicio.trim().length > 0;

  const handleSalvarEvento = () => {
    if (!nome || !localizacao || !data || !horaInicio || !horaFim) {
      Alert.alert("Atenção", "Por favor, preencha os campos obrigatórios.");
      return;
    }

    Alert.alert("Sucesso!", "Evento criado com sucesso.", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.imageUploadArea} activeOpacity={0.7}>
          <MaterialCommunityIcons
            name="image-plus"
            size={40}
            color={COLORS.textoSecundario}
          />
          <Text style={styles.imageUploadText}>Adicionar imagem de capa</Text>
        </TouchableOpacity>

        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do Evento *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Semana da Tecnologia"
              value={nome}
              onChangeText={setNome}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Categoria (Opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Workshop, Palestra"
              value={categoria}
              onChangeText={setCategoria}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Curso Destinado</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Análise e Desenv. de Sistemas"
              value={curso}
              onChangeText={setCurso}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Semestre</Text>
            <TextInput
              style={[
                styles.input,
                !isSemestreLiberado && styles.inputDisabled,
              ]}
              placeholder={
                isSemestreLiberado
                  ? "Ex: 1º ao 6º Semestre"
                  : "Preencha o curso primeiro"
              }
              value={semestre}
              onChangeText={setSemestre}
              editable={isSemestreLiberado}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Limite de Inscrições</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 50"
              value={limiteInscricoes}
              onChangeText={setLimiteInscricoes}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Localização *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Auditório Principal"
              value={localizacao}
              onChangeText={setLocalizacao}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data do Evento *</Text>
            <TextInput
              style={[styles.input, !isDataLiberada && styles.inputDisabled]}
              placeholder={
                isDataLiberada
                  ? "DD/MM/AAAA"
                  : "Preencha a localização primeiro"
              }
              value={data}
              onChangeText={setData}
              editable={isDataLiberada}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Horário de Início *</Text>
            <TextInput
              style={[
                styles.input,
                !isHoraInicioLiberada && styles.inputDisabled,
              ]}
              placeholder={
                isHoraInicioLiberada ? "HH:MM" : "Preencha a data primeiro"
              }
              value={horaInicio}
              onChangeText={setHoraInicio}
              editable={isHoraInicioLiberada}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Horário de Término *</Text>
            <TextInput
              style={[styles.input, !isHoraFimLiberada && styles.inputDisabled]}
              placeholder={
                isHoraFimLiberada
                  ? "HH:MM"
                  : "Preencha o horário de início primeiro"
              }
              value={horaFim}
              onChangeText={setHoraFim}
              editable={isHoraFimLiberada}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Palestrante / Responsável</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Prof. João da Silva"
              value={palestrante}
              onChangeText={setPalestrante}
            />
          </View>

          <View style={styles.switchGroup}>
            <Text style={styles.switchLabel}>Evento Exclusivo (Fatec)?</Text>
            <Switch
              trackColor={{ false: "#E0E0E0", true: "rgba(169, 0, 0, 0.5)" }}
              thumbColor={eventoRestrito ? COLORS.vermelhoPrincipal : "#f4f3f4"}
              onValueChange={setEventoRestrito}
              value={eventoRestrito}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição do Evento</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Escreva os detalhes do evento aqui..."
              value={descricao}
              onChangeText={setDescricao}
              multiline
              numberOfLines={5}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          activeOpacity={0.8}
          onPress={handleSalvarEvento}
        >
          <Text style={styles.submitButtonText}>Criar Evento</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default CreateEventScreen;
