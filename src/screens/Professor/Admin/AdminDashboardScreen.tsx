import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context"; 
import { AppNavigationProp } from "../../../navigation/types";
import { COLORS } from "../../../styles/colors";
import { styles } from "./AdminDashboardScreen.styles";
import { authService } from "../../../services/authService";
import CustomAlert from "../../../components/CustomAlert";

const AdminOption = ({
  icon,
  title,
  onPress,
  color = COLORS.vermelhoPrincipal,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  onPress: () => void;
  color?: string;
}) => (
  <TouchableOpacity
    style={styles.optionCard}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={styles.iconContainer}>
      <MaterialCommunityIcons name={icon} size={38} color={color} />
    </View>
    <Text style={styles.optionTitle}>{title}</Text>
  </TouchableOpacity>
);

const AdminDashboardScreen = () => {
  const navigation = useNavigation<AppNavigationProp>();
  const insets = useSafeAreaInsets(); 

  const [userName, setUserName] = useState("Carregando...");
  const [userRole, setUserRole] = useState<
    "ADMIN" | "COORDENADOR" | "AUXILIAR" | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
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
    const carregarPerfil = async () => {
      try {
        const response = await authService.getMe();
        if (response.data) {
          setUserName(response.data.name || "Professor");
          setUserRole(response.data.role);
        }
      } catch (error: any) {
        console.warn("Erro ao carregar dados no Dashboard", error);
        setUserName("Professor");

        if (
          !error.response &&
          (error.request || error.message === "Network Error")
        ) {
          mostrarAlerta(
            "Modo Offline",
            "Não foi possível sincronizar seus dados. Verifique a internet.",
            "aviso",
          );
        } else {
          mostrarAlerta(
            "Aviso",
            "Não foi possível carregar algumas informações do seu perfil.",
            "aviso",
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    carregarPerfil();
  }, []);

  const isSuperAdmin = userRole === "ADMIN";
  const isCoordenador = userRole === "ADMIN" || userRole === "COORDENADOR";

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top + 20, 20),
            paddingBottom: Math.max(insets.bottom + 20, 40),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          {isLoading ? (
            <ActivityIndicator
              size="small"
              color={COLORS.vermelhoPrincipal}
              style={{ alignSelf: "flex-start" }}
            />
          ) : (
            <Text style={styles.welcomeText}>
              Olá, {userName.split(" ")[0]}
            </Text>
          )}
          <Text style={styles.subtitleText}>Painel de Controle Fatec</Text>
        </View>

        <Text style={styles.sectionTitle}>Gestão do Sistema</Text>
        <View style={styles.gridContainer}>
          <AdminOption
            icon="calendar-multiple"
            title="Meus Eventos"
            onPress={() =>
              navigation.navigate("MainTabs", { screen: "Eventos" } as any)
            }
          />
          <AdminOption
            icon="account-edit"
            title="Editar Perfil"
            onPress={() => navigation.navigate("EditProfile" as any)}
          />

          {isCoordenador && (
            <>
              <AdminOption
                icon="calendar-plus"
                title="Criar Evento"
                onPress={() => navigation.navigate("CreateEvent" as any)}
              />
              <AdminOption
                icon="tag-multiple"
                title="Categorias"
                onPress={() => navigation.navigate("ManageCategories" as any)}
              />
            </>
          )}

          {isSuperAdmin && (
            <>
              <AdminOption
                icon="account-multiple"
                title="Usuários"
                onPress={() => navigation.navigate("ManageUsers" as any)}
              />
              <AdminOption
                icon="school"
                title="Cursos"
                onPress={() => navigation.navigate("ManageCourses" as any)}
              />
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

export default AdminDashboardScreen;