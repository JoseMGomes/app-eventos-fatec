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
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import EventCard from "../../components/EventCard";
import { AppNavigationProp } from "../../navigation/types";
import { COLORS } from "../../styles/colors";
import { styles } from "./HomeScreen.styles";

const DADOS_EVENTOS = [
  {
    id: "1",
    nome: "Torneio de Programação",
    data: "2026-05-12T10:30:00",
    local: "Lab ensaios metalograficos",
    palestrante: "Coordenação de TI",
    imagemUrl: "https://i.imgur.com/7sHS3dG.jpeg",
    descricao:
      "Competição entre alunos para resolver desafios algorítmicos em tempo recorde.",
    eventoRestrito: false,
    curso: "Disponível para todos os cursos",
    semestre: "Disponível para todos os semestres",
    categoria: "Tecnologia",
  },
  {
    id: "2",
    nome: "Workshop de Smart Cities",
    data: "2026-05-28T07:30:00",
    local: "Lab informatica 1",
    palestrante: "Eng. Rodrigo Mendonça",
    imagemUrl: "https://i.imgur.com/Kx9dOC4.jpeg",
    descricao:
      "Aprenda sobre as tecnologias que estão transformando as cidades em ambientes mais inteligentes e sustentáveis.",
    eventoRestrito: false,
    curso: "Gestão da Produção Industrial",
    semestre: "3º ao 6º Semestre",
    categoria: "Gestão",
  },
  {
    id: "3",
    nome: "Palestra sobre IA",
    data: "2026-06-10T19:00:00",
    local: "Auditório Principal",
    palestrante: "Profª. Drª. Ada Lovelace",
    imagemUrl: "https://i.imgur.com/9iLhxKO.jpeg",
    descricao:
      "Uma introdução aos conceitos de Inteligência Artificial e Machine Learning e seu impacto no mercado de trabalho.",
    eventoRestrito: true,
    curso: "Análise e Desenv. de Sistemas",
    semestre: "Disponível para todos os semestres",
    categoria: "Tecnologia",
  },
  {
    id: "4",
    nome: "Semana Cloud AWS & Azure",
    data: "2026-08-04T09:00:00",
    local: "Auditório Principal",
    palestrante: "Especialistas do Mercado",
    imagemUrl: "https://i.imgur.com/OCNA52V.jpeg",
    descricao:
      "Uma semana de imersão nas principais plataformas de nuvem do mercado, com palestras e hands-on.",
    eventoRestrito: true,
    curso: "Análise e Desenv. de Sistemas",
    semestre: "4º ao 6º Semestre",
    categoria: "Tecnologia",
  },
  {
    id: "5",
    nome: "Recepção de Calouros 2026",
    data: "2026-02-10T19:30:00",
    local: "Pátio Central",
    palestrante: "Diretoria e Veteranos",
    imagemUrl: "https://i.imgur.com/qE4l5i8.jpeg",
    descricao:
      "Evento de boas-vindas para os novos alunos da Fatec Itu, com apresentação dos cursos e tour pelo campus.",
    eventoRestrito: false,
    curso: "Todos os cursos",
    semestre: "1º Semestre",
    categoria: "Geral",
  },
  {
    id: "6",
    nome: "Workshop de Python para Análise de Dados",
    data: "2026-09-05T14:00:00",
    local: "Laboratório de Informática 3",
    palestrante: "Profª. Joana da Silva",
    imagemUrl: "https://i.imgur.com/X0w5a2s.jpeg",
    descricao:
      "Aprenda os fundamentos de bibliotecas como Pandas e Matplotlib para manipulação e visualização de dados.",
    eventoRestrito: true,
    curso: "Análise e Desenv. de Sistemas",
    semestre: "Todos os semestres",
    categoria: "Tecnologia",
  },
];

const CATEGORIAS = ["Todos", "Tecnologia", "Gestão", "Geral"];

type Props = {
  navigation: AppNavigationProp;
};

const HomeScreen = ({ navigation }: Props) => {
  const [busca, setBusca] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");

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

  const eventosFiltrados = DADOS_EVENTOS.filter((evento) => {
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
        <Text style={styles.saudacao}>Olá, Professor(a) 👋</Text>
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
      <FlatList
        data={eventosFiltrados}
        renderItem={({ item }) => (
          <EventCard
            evento={item}
            onPress={() => navigation.navigate("EventDetail", { evento: item })}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <Text style={styles.listaVazia}>Nenhum evento encontrado. 😢</Text>
        )}
      />
    </View>
  );
};

export default HomeScreen;
