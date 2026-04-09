import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StatusBar,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import EventCard from "../../../components/EventCard";
import { AppNavigationProp } from "../../../navigation/types";
import { COLORS } from "../../../styles/colors";
import { styles } from "./HomeScreen.styles";
import { authService } from "../../../services/authService";
import { eventService } from "../../../services/eventService";

const CATEGORIAS = ["Todos", "Tecnologia", "Gestão", "Geral"];

type Props = {
  navigation: AppNavigationProp;
};

const HomeScreen = ({ navigation }: Props) => {
  const [busca, setBusca] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");
  const [eventosApi, setEventosApi] = useState<any[]>([]);
  const [isLoadingEventos, setIsLoadingEventos] = useState(true);
  const [userName, setUserName] = useState("Professor(a)");
  const [userRole, setUserRole] = useState<
    "ADMIN" | "COORDENADOR" | "AUXILIAR" | null
  >(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      Alert.alert(
        "Confirmar Saída",
        "Tem a certeza de que deseja sair da conta?",
        [
          { text: "Não", style: "cancel", onPress: () => {} },
          {
            text: "Sim",
            style: "destructive",
            onPress: () => {
              navigation.dispatch(e.data.action);
            },
          },
        ],
      );
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const carregarDadosDaTela = async () => {
      try {
        const responseAuth = await authService.getMe();
        if (responseAuth.data) {
          setUserName(responseAuth.data.name || "Professor(a)");
          setUserRole(responseAuth.data.role);
        }

        const responseEvents = await eventService.getAllAdminEvents();
        const eventosFormatados = responseEvents.data.map((ev: any) => {
          const pedacoData = ev.startDate ? ev.startDate.split("T")[0] : "";
          const pedacoHora = ev.startTime
            ? ev.startTime.split("T")[1]
            : "00:00:00.000Z";
          const dataCorrigida = `${pedacoData}T${pedacoHora}`;

          return {
            id: String(ev.id),
            nome: ev.name,
            data: dataCorrigida,
            local:
              ev.locationName?.toLowerCase() === "outros"
                ? ev.customLocation
                : ev.locationName,
            palestrante: ev.speakerName,
            imagemUrl: ev.imageUrl,
            descricao: ev.description,
            eventoRestrito: ev.isRestricted,
            categoria: ev.categoryName || "Geral",
          };
        });

        setEventosApi(eventosFormatados);
      } catch (error) {
        console.warn("Erro ao buscar dados na Home:", error);
      } finally {
        setIsLoadingEventos(false);
      }
    };

    carregarDadosDaTela();
  }, []);

  const eventosFiltrados = eventosApi.filter((evento) => {
    const textoBuscado = busca.toLowerCase();
    const nomeEvento = evento.nome.toLowerCase();
    const passaNaBusca = nomeEvento.includes(textoBuscado);

    const passaNaCategoria =
      categoriaSelecionada === "Todos" ||
      evento.categoria === categoriaSelecionada;

    return passaNaBusca && passaNaCategoria;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cinzaFundo} />

      <View style={styles.header}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.saudacao}>Olá, {userName.split(" ")[0]} 👋</Text>

          {userRole && (
            <View style={styles.roleTag}>
              <Text style={styles.roleTagText}>{userRole}</Text>
            </View>
          )}
        </View>
        <Text style={styles.tituloDescubra}>Gestão de Eventos</Text>
      </View>

      <View style={styles.searchContainer}>
        <MaterialCommunityIcons
          name="magnify"
          size={24}
          color={COLORS.textoSecundario}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar evento..."
          placeholderTextColor={COLORS.textoSecundario}
          value={busca}
          onChangeText={setBusca}
        />
        {busca.length > 0 && (
          <TouchableOpacity onPress={() => setBusca("")}>
            <MaterialCommunityIcons
              name="close-circle"
              size={20}
              color={COLORS.textoSecundario}
            />
          </TouchableOpacity>
        )}
      </View>

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriasContainer}
        >
          {CATEGORIAS.map((categoria, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.chip,
                categoriaSelecionada === categoria && styles.chipAtivo,
              ]}
              onPress={() => setCategoriaSelecionada(categoria)}
            >
              <Text
                style={[
                  styles.textoChip,
                  categoriaSelecionada === categoria && styles.textoChipAtivo,
                ]}
              >
                {categoria}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isLoadingEventos ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={COLORS.vermelhoPrincipal} />
          <Text style={{ marginTop: 10, color: COLORS.textoSecundario }}>
            Buscando eventos...
          </Text>
        </View>
      ) : (
        <FlatList
          data={eventosFiltrados}
          renderItem={({ item }) => (
            <EventCard
              evento={item}
              onPress={() =>
                navigation.navigate("EventDetail", { evento: item })
              }
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <Text style={styles.listaVazia}>Nenhum evento encontrado. 😢</Text>
          )}
        />
      )}

      {(userRole === "ADMIN" || userRole === "COORDENADOR") && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("CreateEvent" as any)}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="plus" size={30} color={COLORS.branco} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default HomeScreen;
