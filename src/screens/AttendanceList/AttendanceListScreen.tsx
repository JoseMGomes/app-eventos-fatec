import React, { useMemo } from "react";
import { View, Text, FlatList, StatusBar } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import { COLORS } from "../../styles/colors";
import ParticipantRow from "../../components/ParticipantRow";
import ProgressBar from "../../components/ProgressBar";
import { styles } from "./AttendanceListScreen.styles"; 

const DADOS_PARTICIPANTES = [
  { id: "101", nome: "Ana Carolina Pereira", curso: "ADS", presente: true },
  { id: "102", nome: "Bruno Vasconcelos", curso: "GPI", presente: true },
  { id: "103", nome: "Carlos Eduardo Lima", curso: "ADS", presente: true },
  { id: "104", nome: "Daniela Souza", curso: "Mecatrônica", presente: true },
  { id: "105", nome: "Eduardo Martins", curso: "ADS", presente: false },
  { id: "106", nome: "Fernanda Oliveira", curso: "GPI", presente: false },
  { id: "107", nome: "Gustavo Henrique Borges", curso: "ADS", presente: false },
  { id: "108", nome: "Heloisa Schmidt", curso: "Mecatrônica", presente: false },
  { id: "109", nome: "Igor Nascimento", curso: "ADS", presente: true },
  { id: "110", nome: "Juliana Costa", curso: "GPI", presente: false },
];

type AttendanceListRouteProp = RouteProp<RootStackParamList, "AttendanceList">;

const AttendanceListScreen = () => {
  const route = useRoute<AttendanceListRouteProp>();
  const { evento } = route.params;

  const totalParticipantes = DADOS_PARTICIPANTES.length;

  const totalPresentes = useMemo(() => {
    return DADOS_PARTICIPANTES.filter((p) => p.presente).length;
  }, []);

  const percentualPresentes =
    totalParticipantes > 0 ? (totalPresentes / totalParticipantes) * 100 : 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Resumo de Presença</Text>
        <Text style={styles.headerSubtitle}>{evento.nome}</Text>

        <ProgressBar
          presentes={totalPresentes}
          total={totalParticipantes}
          progress={percentualPresentes}
        />
      </View>

      <FlatList
        data={DADOS_PARTICIPANTES}
        renderItem={({ item }) => (
          <ParticipantRow
            nome={item.nome}
            curso={item.curso}
            presente={item.presente}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default AttendanceListScreen;