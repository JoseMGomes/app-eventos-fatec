import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../styles/colors";
import { styles } from "./EditProfileScreen.styles";

const EditProfileScreen = () => {
  const navigation = useNavigation();

  const [nome, setNome] = useState("Vinicius Leal");
  const [email, setEmail] = useState("vinicius.leal@fatec.sp.gov.br");

  const handleSalvarPerfil = () => {
    if (!nome.trim() || !email.trim()) {
      Alert.alert("Atenção", "Os campos Nome e E-mail não podem ficar vazios.");
      return;
    }

    Alert.alert("Sucesso", "Perfil atualizado com sucesso!", [
      { text: "OK", onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.imageUploadContainer}>
          <TouchableOpacity style={styles.imageUploadMain} activeOpacity={0.7}>
            <View style={styles.imageUploadIcons}>
              <MaterialCommunityIcons name="camera-outline" size={28} color={COLORS.textoPrincipal} />
              <View style={styles.iconDivider} />
              <MaterialCommunityIcons name="image-outline" size={28} color={COLORS.textoPrincipal} />
            </View>
            <Text style={styles.imageUploadText}>
              Clique, cole ou arraste e solte para{"\n"}selecionar uma imagem!
            </Text>
          </TouchableOpacity>
          
          <View style={styles.imageUploadFooter}>
            <TouchableOpacity>
              <MaterialCommunityIcons name="upload-outline" size={24} color={COLORS.vermelhoPrincipal} />
            </TouchableOpacity>
            <TouchableOpacity>
              <MaterialCommunityIcons name="trash-can-outline" size={24} color="#A0A0A0" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSalvarPerfil} activeOpacity={0.8}>
          <Text style={styles.submitButtonText}>Salvar</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

export default EditProfileScreen;