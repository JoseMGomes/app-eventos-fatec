import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../styles/colors";
import { useNavigation } from "@react-navigation/native";
import { AppNavigationProp } from "../../navigation/types";
import { styles } from "./AdminDashboardScreen.styles";

const AdminOption = ({
  icon,
  title,
  onPress,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={styles.optionCard}
    activeOpacity={0.8}
    onPress={onPress}
  >
    <View style={styles.iconContainer}>
      <MaterialCommunityIcons
        name={icon}
        size={32}
        color={COLORS.vermelhoPrincipal}
      />
    </View>
    <Text style={styles.optionText}>{title}</Text>
  </TouchableOpacity>
);

const StatCard = ({ valor, titulo }: { valor: string; titulo: string }) => (
  <View style={styles.statCard}>
    <Text style={styles.statValue}>{valor}</Text>
    <Text style={styles.statLabel}>{titulo}</Text>
  </View>
);

const AdminDashboardScreen = () => {
  const navigation = useNavigation<AppNavigationProp>();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cinzaFundo} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Painel de Gestão</Text>
          <Text style={styles.subTitle}>Visão geral do sistema</Text>
        </View>

        <View style={styles.statsContainer}>
          <StatCard valor="12" titulo="Eventos" />
          <StatCard valor="450" titulo="Inscritos" />
          <StatCard valor="320" titulo="Check-ins" />
        </View>

        <Text style={styles.sectionTitle}>Acesso Rápido</Text>

        <View style={styles.grid}>
          <AdminOption
            icon="calendar-plus"
            title="Criar Evento"
            onPress={() => navigation.navigate("CreateEvent")}
          />
          <AdminOption
            icon="qrcode-scan"
            title="Validar Presença"
            onPress={() => navigation.navigate("Eventos" as any)}
          />
          <AdminOption
            icon="account-group"
            title="Usuários"
            onPress={() => navigation.navigate("ManageUsers" as any)}
          />
          <AdminOption
            icon="file-certificate"
            title="Certificados"
            onPress={() => console.log("Certificados - Futuro")}
          />
          <AdminOption
            icon="chart-bar"
            title="Relatórios"
            onPress={() => console.log("Relatórios - Futuro")}
          />
          <AdminOption
            icon="cog"
            title="Configurações"
            onPress={() => console.log("Configurações - Futuro")}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default AdminDashboardScreen;
