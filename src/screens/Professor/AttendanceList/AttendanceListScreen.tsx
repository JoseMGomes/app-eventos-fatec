import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../../styles/colors";
import { styles } from "./AttendanceListScreen.styles";

const AttendanceListScreen = () => {
  const [pesquisa, setPesquisa] = useState("");
  const [alunos, setAlunos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const inscritosNoBancoDeDados = [
        { id: "1", nome: "José Lucas Gomes", ra: "111222333", presente: false },
        {
          id: "2",
          nome: "Guilherme Francisco",
          ra: "444555666",
          presente: true,
        },
        { id: "3", nome: "Ana Silva Costa", ra: "777888999", presente: false },
        {
          id: "4",
          nome: "Carlos Eduardo Oliveira",
          ra: "123123123",
          presente: false,
        },
        {
          id: "5",
          nome: "Beatriz Souza Mendes",
          ra: "456456456",
          presente: true,
        },
      ];
      setAlunos(inscritosNoBancoDeDados);
      setCarregando(false);
    }, 800);
  }, []);

  const alternarPresenca = (id: string) => {
    setAlunos((estadoAnterior) =>
      estadoAnterior.map((aluno) =>
        aluno.id === id ? { ...aluno, presente: !aluno.presente } : aluno,
      ),
    );
  };

  const alunosFiltrados = alunos.filter(
    (aluno) =>
      aluno.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
      aluno.ra.includes(pesquisa),
  );

  const totalInscritos = alunos.length;
  const totalPresentes = alunos.filter((a) => a.presente).length;
  const percentagem =
    totalInscritos > 0
      ? Math.round((totalPresentes / totalInscritos) * 100)
      : 0;

  const renderItem = ({ item }: any) => (
    <View style={styles.studentCard}>
      <View
        style={[
          styles.avatarContainer,
          { backgroundColor: item.presente ? "#E8F5E9" : "#F5F5F5" },
        ]}
      >
        <MaterialCommunityIcons
          name={item.presente ? "account-check" : "account"}
          size={24}
          color={item.presente ? "#27AE60" : COLORS.textoSecundario}
        />
      </View>

      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item.nome}</Text>
        <Text style={styles.studentRa}>RA: {item.ra}</Text>
      </View>

      <TouchableOpacity
        style={{ alignItems: "center", padding: 5 }}
        onPress={() => alternarPresenca(item.id)}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name={item.presente ? "checkbox-marked" : "checkbox-blank-outline"}
          size={32}
          color={item.presente ? "#27AE60" : COLORS.textoSecundario}
        />
        <Text
          style={[
            styles.statusText,
            { color: item.presente ? "#27AE60" : COLORS.textoSecundario },
          ]}
        >
          {item.presente ? "PRESENTE" : "FALTOU"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Presença Manual</Text>

        <View style={styles.progressSection}>
          <View style={styles.statsContainer}>
            <Text style={styles.statText}>Inscritos: {totalInscritos}</Text>
            <Text
              style={[
                styles.statText,
                { color: "#27AE60", fontWeight: "bold" },
              ]}
            >
              Presentes: {totalPresentes}
            </Text>
          </View>

          <View style={styles.progressBarContainer}>
            <View
              style={[styles.progressBarFill, { width: `${percentagem}%` }]}
            />
          </View>
          <Text style={styles.progressText}>{percentagem}% de Presença</Text>
        </View>

        <View style={styles.searchContainer}>
          <MaterialCommunityIcons
            name="magnify"
            size={22}
            color={COLORS.textoSecundario}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Procurar por Nome ou RA..."
            value={pesquisa}
            onChangeText={setPesquisa}
            placeholderTextColor="#999"
          />
          {pesquisa.length > 0 && (
            <TouchableOpacity onPress={() => setPesquisa("")}>
              <MaterialCommunityIcons
                name="close-circle"
                size={20}
                color={COLORS.textoSecundario}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {carregando ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={COLORS.vermelhoPrincipal} />
          <Text style={{ marginTop: 10, color: COLORS.textoSecundario }}>
            Buscando alunos inscritos...
          </Text>
        </View>
      ) : (
        <FlatList
          data={alunosFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text
              style={{
                textAlign: "center",
                color: COLORS.textoSecundario,
                marginTop: 20,
              }}
            >
              Nenhum aluno encontrado com esse nome ou RA.
            </Text>
          }
        />
      )}
    </View>
  );
};

export default AttendanceListScreen;
