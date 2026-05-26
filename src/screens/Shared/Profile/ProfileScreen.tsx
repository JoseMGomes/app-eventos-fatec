import React, { useState, useEffect } from "react";
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
import { styles } from "./ProfileScreen.styles";
import CustomAlert from "../../../components/CustomAlert";
import { authService } from "../../../services/authService";

const MenuItem = ({
  icon,
  title,
  onPress,
}: {
  icon: any;
  title: string;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.menuIconContainer}>
      <MaterialCommunityIcons
        name={icon}
        size={22}
        color={COLORS.textoSecundario}
      />
    </View>
    <Text style={styles.menuText}>{title}</Text>
    <MaterialCommunityIcons name="chevron-right" size={24} color="#D1D1D1" />
  </TouchableOpacity>
);

const ProfileScreen = () => {
  const navigation = useNavigation<AppNavigationProp>();
  const insets = useSafeAreaInsets();

  const [userName, setUserName] = useState("Carregando...");
  const [userEmail, setUserEmail] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    title: string;
    message: string;
    tipo: "sucesso" | "erro" | "aviso";
    onConfirm?: () => void;
    textoConfirmar?: string;
    textoCancelar?: string;
  }>({
    title: "",
    message: "",
    tipo: "aviso",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoadingProfile(true);
        const response = await authService.getMe();

        if (response.data) {
          const nomeCompleto = response.data.name || "Administrador";
          const primeiroNome = nomeCompleto.split(" ")[0];
          setUserName(primeiroNome);
          setUserEmail(response.data.email || "");
        }
      } catch (error) {
        console.warn("Erro ao buscar dados do usuário:", error);
        setUserName("Administrador");
        setUserEmail("Erro ao carregar e-mail");
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchUserData();
  }, []);

  const mostrarAlerta = (
    title: string,
    message: string,
    tipo: "sucesso" | "erro" | "aviso",
    onConfirm?: () => void,
    textoConfirmar = "OK",
    textoCancelar = "Cancelar",
  ) => {
    setAlertConfig({
      title,
      message,
      tipo,
      onConfirm,
      textoConfirmar,
      textoCancelar,
    });
    setAlertVisible(true);
  };

  const handleLogout = () => {
    mostrarAlerta(
      "Sair do Sistema",
      "Tem certeza que deseja encerrar sua sessão?",
      "aviso",
      async () => {
        setAlertVisible(false);
        try {
          await authService.logout();
        } catch (error) {
          console.warn("Erro ao fazer logout na API", error);
        } finally {
          navigation.reset({ index: 0, routes: [{ name: "Login" as any }] });
        }
      },
      "Sim, Sair",
      "Cancelar",
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom + 20, 40),
        }}
      >
        <View
          style={[styles.header, { paddingTop: Math.max(insets.top + 20, 50) }]}
        >
          <View style={styles.avatarContainer}>
            <MaterialCommunityIcons
              name="account-tie"
              size={60}
              color={COLORS.vermelhoPrincipal}
            />
          </View>

          {isLoadingProfile ? (
            <ActivityIndicator
              size="small"
              color={COLORS.vermelhoPrincipal}
              style={{ marginTop: 10 }}
            />
          ) : (
            <>
              <Text style={styles.name}>{userName}</Text>
              {userEmail ? <Text style={styles.email}>{userEmail}</Text> : null}
            </>
          )}
        </View>

        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Conta</Text>
          <MenuItem
            icon="account-edit-outline"
            title="Editar Perfil"
            onPress={() => navigation.navigate("EditProfile" as any)}
          />
          <MenuItem
            icon="cog-outline"
            title="Configurações"
            onPress={() => navigation.navigate("Settings" as any)}
          />

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="logout"
              size={22}
              color={COLORS.vermelhoPrincipal}
            />
            <Text style={styles.logoutText}>Sair do Sistema</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        tipo={alertConfig.tipo}
        onClose={() => setAlertVisible(false)}
        onConfirm={alertConfig.onConfirm}
        textoConfirmar={alertConfig.textoConfirmar}
        textoCancelar={alertConfig.textoCancelar}
      />
    </View>
  );
};

export default ProfileScreen;
