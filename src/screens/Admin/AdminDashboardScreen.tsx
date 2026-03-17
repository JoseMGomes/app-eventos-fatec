import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AppNavigationProp } from "../../navigation/types";
import { COLORS } from "../../styles/colors";
import { styles } from "./AdminDashboardScreen.styles";


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
  <TouchableOpacity style={styles.optionCard} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.iconContainer}>
      <MaterialCommunityIcons name={icon} size={38} color={color} />
    </View>
    <Text style={styles.optionTitle}>{title}</Text>
  </TouchableOpacity>
);

const StatCard = ({
  icon,
  value,
  label,
  color,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  value: string;
  label: string;
  color: string;
}) => (
  <View style={styles.statCard}>
    <MaterialCommunityIcons name={icon} size={28} color={color} style={{ marginBottom: 5 }} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const AdminDashboardScreen = () => {

  const navigation = useNavigation<AppNavigationProp>();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cinzaFundo} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Olá, Professor</Text>
          <Text style={styles.subtitleText}>Painel de Controle Fatec</Text>
        </View>

        <View style={styles.statsContainer}>
          <StatCard icon="calendar-check" value="3" label="Eventos Hoje" color={COLORS.vermelhoPrincipal} />
          <StatCard icon="account-group" value="142" label="Alunos Ativos" color="#2980B9" />
          <StatCard icon="check-decagram" value="89%" label="Presença Média" color="#27AE60" />
        </View>

        <Text style={styles.sectionTitle}>Gestão do Sistema</Text>

        <View style={styles.gridContainer}>
          <AdminOption 
            icon="calendar-plus" 
            title="Criar Evento" 
            onPress={() => navigation.navigate("CreateEvent" as any)} 
          />
          <AdminOption 
            icon="calendar-multiple" 
            title="Meus Eventos" 
            onPress={() => navigation.navigate("MainTabs", { screen: "Eventos" } as any)} 
          />
          <AdminOption 
            icon="account-multiple" 
            title="Usuários" 
            onPress={() => navigation.navigate("ManageUsers" as any)} 
          />
          <AdminOption 
            icon="tag-multiple" 
            title="Categorias" 
            onPress={() => navigation.navigate("ManageCategories" as any)} 
          />
          <AdminOption 
            icon="school" 
            title="Cursos" 
            onPress={() => navigation.navigate("ManageCourses" as any)} 
          />
          <AdminOption 
            icon="account-edit" 
            title="Editar Perfil" 
            onPress={() => navigation.navigate("EditProfile" as any)} 
          />
        </View>

      </ScrollView>
    </View>
  );
};

export default AdminDashboardScreen;