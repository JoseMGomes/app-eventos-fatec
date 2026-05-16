import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppNavigationProp } from "../../../navigation/types";
import { COLORS } from "../../../styles/colors";
import { styles } from "./ProfileScreen.styles";
import CustomAlert from "../../../components/CustomAlert";

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
      () => {
        setAlertVisible(false);
        navigation.reset({ index: 0, routes: [{ name: "Login" as any }] });
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
          <Text style={styles.name}>Administrador</Text>
          <Text style={styles.email}>admin@fatec.sp.gov.br</Text>
        </View>

        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Conta</Text>
          <MenuItem
            icon="account-edit-outline"
            title="Editar Perfil"
            onPress={() => navigation.navigate("EditProfile" as any)}
          />
          <MenuItem
            icon="shield-lock-outline"
            title="Segurança e Senha"
            onPress={() => console.log("Segurança")}
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
