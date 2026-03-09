import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AppNavigationProp } from "../../navigation/types";
import { COLORS } from "../../styles/colors";
import { styles } from "./ProfileScreen.styles";

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

  const handleLogout = () => {
    Alert.alert(
      "Sair do Sistema",
      "Tem certeza que deseja encerrar sua sessão?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: () =>
            navigation.reset({ index: 0, routes: [{ name: "Login" as any }] }),
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
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
            onPress={() => console.log("Editar")}
          />
          <MenuItem
            icon="shield-lock-outline"
            title="Segurança e Senha"
            onPress={() => console.log("Segurança")}
          />
          <MenuItem
            icon="bell-outline"
            title="Notificações"
            onPress={() => console.log("Notificações")}
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
    </View>
  );
};

export default ProfileScreen;
