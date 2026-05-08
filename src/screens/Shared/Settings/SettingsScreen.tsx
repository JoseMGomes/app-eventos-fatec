import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  Linking,
  AppState,
  Modal,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import * as Notifications from "expo-notifications";
import { COLORS } from "../../../styles/colors";
import { styles } from "./SettingsScreen.styles";
import * as FileSystem from "expo-file-system";
import CustomAlert from "../../../components/CustomAlert";

const SettingItem = ({
  icon,
  iconBg,
  title,
  subtitle,
  isSwitch,
  switchValue,
  onSwitchChange,
  onPress,
  hasBorder = true,
}: any) => (
  <TouchableOpacity
    style={[styles.settingItem, hasBorder && styles.settingItemBorder]}
    onPress={onPress}
    activeOpacity={isSwitch ? 1 : 0.7}
  >
    <View style={styles.settingLeft}>
      <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
        <MaterialCommunityIcons name={icon} size={20} color={COLORS.branco} />
      </View>
      <View>
        <Text style={styles.settingText}>{title}</Text>
        {subtitle && <Text style={styles.settingSubText}>{subtitle}</Text>}
      </View>
    </View>

    {isSwitch ? (
      <Switch
        trackColor={{ false: "#E0E0E0", true: "rgba(169, 0, 0, 0.5)" }}
        thumbColor={switchValue ? COLORS.vermelhoPrincipal : "#f4f3f4"}
        onValueChange={onSwitchChange}
        value={switchValue}
      />
    ) : (
      <MaterialCommunityIcons name="chevron-right" size={24} color="#D1D1D1" />
    )}
  </TouchableOpacity>
);

const SettingsScreen = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [notificationsPermission, setNotificationsPermission] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    visible: boolean;
    tipo: "sobre" | "politica";
  }>({
    visible: false,
    tipo: "sobre",
  });

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    title: string;
    message: string;
    tipo: "sucesso" | "erro" | "aviso";
    onConfirm?: () => void;
    textoConfirmar?: string;
    textoCancelar?: string;
    onCloseAcao?: () => void;
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
    onCloseAcao?: () => void,
  ) => {
    setAlertConfig({
      title,
      message,
      tipo,
      onConfirm,
      textoConfirmar,
      textoCancelar,
      onCloseAcao,
    });
    setAlertVisible(true);
  };

  const checkAllPermissions = async () => {
    const cameraStatus = await Camera.getCameraPermissionsAsync();
    setCameraPermission(cameraStatus.status === "granted");
    const notifStatus = await Notifications.getPermissionsAsync();
    setNotificationsPermission(notifStatus.status === "granted");
  };

  useEffect(() => {
    checkAllPermissions();
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        checkAllPermissions();
      }
    });
    return () => subscription.remove();
  }, []);

  const handleCameraToggle = async () => {
    const { status, canAskAgain } = await Camera.getCameraPermissionsAsync();
    if (status === "granted") {
      mostrarAlerta(
        "Permissão do Sistema",
        "Por segurança, para revogar o acesso à câmera você precisa alterar nas configurações do aparelho.",
        "aviso",
        () => {
          setAlertVisible(false);
          Linking.openSettings();
        },
        "Abrir Configurações",
      );
    } else {
      if (canAskAgain) {
        const request = await Camera.requestCameraPermissionsAsync();
        setCameraPermission(request.status === "granted");
      } else {
        mostrarAlerta(
          "Câmera Bloqueada",
          "O acesso à câmera foi negado permanentemente. Acesse as configurações do aparelho para liberar.",
          "erro",
          () => {
            setAlertVisible(false);
            Linking.openSettings();
          },
          "Abrir Configurações",
        );
      }
    }
  };

  const handleNotificationsToggle = async () => {
    const { status, canAskAgain } = await Notifications.getPermissionsAsync();
    if (status === "granted") {
      mostrarAlerta(
        "Permissão do Sistema",
        "Para parar de receber avisos, desative as notificações nas configurações do aparelho.",
        "aviso",
        () => {
          setAlertVisible(false);
          Linking.openSettings();
        },
        "Abrir Configurações",
      );
    } else {
      if (canAskAgain) {
        const { status: newStatus } =
          await Notifications.requestPermissionsAsync();
        setNotificationsPermission(newStatus === "granted");
      } else {
        mostrarAlerta(
          "Notificações Bloqueadas",
          "As notificações estão desativadas permanentemente. Acesse as configurações do aparelho para liberar os avisos.",
          "erro",
          () => {
            setAlertVisible(false);
            Linking.openSettings();
          },
          "Abrir Configurações",
        );
      }
    }
  };

  const handleDarkModeToggle = (value: boolean) => {
    mostrarAlerta(
      "Alterar Tema",
      value
        ? "Deseja ativar o Modo Escuro?"
        : "Deseja voltar para o Modo Claro?",
      "aviso",
      () => {
        setAlertVisible(false);
        setIsDarkMode(value);
        if (value) {
          setTimeout(() => {
            mostrarAlerta(
              "Em breve",
              "O modo escuro está em desenvolvimento e será lançado na próxima versão.",
              "aviso",
            );
            setIsDarkMode(false);
          }, 600);
        }
      },
      "Confirmar",
    );
  };

  const handleClearCache = () => {
    mostrarAlerta(
      "Limpar Cache do Sistema",
      "Isto irá apagar imagens temporárias e liberar espaço. Confirmar limpeza?",
      "aviso",
      async () => {
        setAlertVisible(false);
        try {
          const cacheDir = (FileSystem as any).cacheDirectory;
          if (cacheDir) {
            const files = await (FileSystem as any).readDirectoryAsync(
              cacheDir,
            );
            for (const file of files) {
              await (FileSystem as any).deleteAsync(`${cacheDir}${file}`, {
                idempotent: true,
              });
            }
            setTimeout(() => {
              mostrarAlerta(
                "Sucesso",
                "Cache do sistema liberado com sucesso!",
                "sucesso",
              );
            }, 300);
          }
        } catch (error) {
          console.error("Erro ao limpar cache:", error);
          setTimeout(() => {
            mostrarAlerta(
              "Erro",
              "Não foi possível limpar os arquivos temporários.",
              "erro",
            );
          }, 300);
        }
      },
      "Limpar Cache",
    );
  };

  const abrirModal = (tipo: "sobre" | "politica") => {
    setModalConfig({ visible: true, tipo });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aparência</Text>
          <View style={styles.card}>
            <SettingItem
              icon="moon-waning-crescent"
              iconBg="#34495E"
              title="Modo Escuro"
              subtitle="Tema escuro para o aplicativo"
              isSwitch
              switchValue={isDarkMode}
              onSwitchChange={handleDarkModeToggle}
              hasBorder={false}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Permissões</Text>
          <View style={styles.card}>
            <SettingItem
              icon="camera-outline"
              iconBg="#27AE60"
              title="Acesso à Câmera"
              subtitle="Necessário para o Leitor QR"
              isSwitch
              switchValue={cameraPermission}
              onSwitchChange={handleCameraToggle}
            />
            <SettingItem
              icon="bell-outline"
              iconBg="#F39C12"
              title="Notificações"
              subtitle="Avisos sobre novos eventos"
              isSwitch
              switchValue={notificationsPermission}
              onSwitchChange={handleNotificationsToggle}
              hasBorder={false}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sistema</Text>
          <View style={styles.card}>
            <SettingItem
              icon="database-refresh-outline"
              iconBg="#8E44AD"
              title="Limpar Cache"
              onPress={handleClearCache}
            />
            <SettingItem
              icon="shield-check-outline"
              iconBg="#2980B9"
              title="Política de Privacidade"
              onPress={() => abrirModal("politica")}
            />
            <SettingItem
              icon="information-outline"
              iconBg="#7F8C8D"
              title="Sobre o App"
              onPress={() => abrirModal("sobre")}
              hasBorder={false}
            />
          </View>
        </View>

        <Text style={styles.versionText}>Versão 1.0.0 (Build 01)</Text>
      </ScrollView>

      <Modal visible={modalConfig.visible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: COLORS.branco,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 25,
              maxHeight: "80%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: COLORS.textoPrincipal,
                }}
              >
                {modalConfig.tipo === "sobre"
                  ? "Sobre o App"
                  : "Política de Privacidade"}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setModalConfig({ ...modalConfig, visible: false })
                }
              >
                <MaterialCommunityIcons
                  name="close-circle-outline"
                  size={28}
                  color={COLORS.vermelhoPrincipal}
                />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {modalConfig.tipo === "sobre" ? (
                <View style={{ alignItems: "center", paddingBottom: 20 }}>
                  <MaterialCommunityIcons
                    name="calendar-check"
                    size={80}
                    color={COLORS.vermelhoPrincipal}
                    style={{ marginBottom: 15 }}
                  />
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      color: COLORS.textoPrincipal,
                      textAlign: "center",
                    }}
                  >
                    Sistema de Gestão de Eventos
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: COLORS.textoSecundario,
                      marginTop: 5,
                      marginBottom: 25,
                    }}
                  >
                    Fatec Itu - Dom Amaury Castanho
                  </Text>

                  <View
                    style={{
                      width: "100%",
                      backgroundColor: "#F9F9F9",
                      padding: 15,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: "#E0E0E0",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: COLORS.textoSecundario,
                        marginBottom: 15,
                        textTransform: "uppercase",
                        fontWeight: "bold",
                      }}
                    >
                      Desenvolvedores
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 15,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          color: COLORS.textoPrincipal,
                        }}
                      >
                        José Lucas
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          Linking.openURL(
                            "https://www.linkedin.com/in/josemgomess/",
                          )
                        }
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: "#0A66C2",
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                          borderRadius: 6,
                        }}
                      >
                        <MaterialCommunityIcons
                          name="linkedin"
                          size={16}
                          color="#FFF"
                        />
                        <Text
                          style={{
                            color: "#FFF",
                            fontSize: 12,
                            fontWeight: "bold",
                            marginLeft: 4,
                          }}
                        >
                          Conectar
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          color: COLORS.textoPrincipal,
                        }}
                      >
                        Guilherme Francisco
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          Linking.openURL(
                            "https://www.linkedin.com/in/guilherme-francisco-pereira-4a3867283/",
                          )
                        }
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: "#0A66C2",
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                          borderRadius: 6,
                        }}
                      >
                        <MaterialCommunityIcons
                          name="linkedin"
                          size={16}
                          color="#FFF"
                        />
                        <Text
                          style={{
                            color: "#FFF",
                            fontSize: 12,
                            fontWeight: "bold",
                            marginLeft: 4,
                          }}
                        >
                          Conectar
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text
                    style={{
                      fontSize: 14,
                      color: COLORS.textoSecundario,
                      marginTop: 20,
                      textAlign: "center",
                      lineHeight: 22,
                    }}
                  >
                    Este aplicativo foi desenvolvido como Trabalho de Conclusão
                    de Curso (TCC) do curso de Análise e Desenvolvimento de
                    Sistemas.
                  </Text>
                </View>
              ) : (
                <View style={{ paddingBottom: 20 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: COLORS.textoPrincipal,
                      lineHeight: 24,
                      marginBottom: 15,
                    }}
                  >
                    <Text style={{ fontWeight: "bold" }}>
                      1. Coleta de Dados:{" "}
                    </Text>
                    O aplicativo coleta apenas as informações essenciais para a
                    gestão de eventos acadêmicos, incluindo nome, e-mail
                    institucional e registro de presenças dos alunos da Fatec
                    Itu.
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: COLORS.textoPrincipal,
                      lineHeight: 24,
                      marginBottom: 15,
                    }}
                  >
                    <Text style={{ fontWeight: "bold" }}>
                      2. Uso da Câmera:{" "}
                    </Text>
                    A permissão de câmera é utilizada estritamente para a
                    leitura de QR Codes durante o check-in dos eventos. Nenhuma
                    imagem é gravada ou enviada para nossos servidores.
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: COLORS.textoPrincipal,
                      lineHeight: 24,
                      marginBottom: 15,
                    }}
                  >
                    <Text style={{ fontWeight: "bold" }}>
                      3. Proteção e LGPD:{" "}
                    </Text>
                    Todos os dados trafegados são criptografados e armazenados
                    de forma segura, em total conformidade com a Lei Geral de
                    Proteção de Dados (Lei nº 13.709/2018).
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        tipo={alertConfig.tipo}
        onClose={() => {
          setAlertVisible(false);
          if (alertConfig.onCloseAcao) {
            alertConfig.onCloseAcao();
          }
        }}
        onConfirm={alertConfig.onConfirm}
        textoConfirmar={alertConfig.textoConfirmar}
        textoCancelar={alertConfig.textoCancelar}
      />
    </View>
  );
};

export default SettingsScreen;
