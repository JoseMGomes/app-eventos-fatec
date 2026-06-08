export default {
  expo: {
    name: "Fatec Eventos",
    slug: "app-eventos-fatec",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./src/assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./src/assets/logoFatecBranco.png",
      resizeMode: "contain",
      backgroundColor: "#B30000"
    },
    ios: {
      jsEngine: "hermes",
      supportsTablet: true,
      infoPlist: {
        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: true
        }
      },
      config: {
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
      }
    },
    android: {
      jsEngine: "hermes",
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
        }
      },
      adaptiveIcon: {
        backgroundColor: "#B30000",
        foregroundImage: "./src/assets/icon.png",
        backgroundImage: "./src/assets/icon.png",
        monochromeImage: "./src/assets/icon.png"
      },
      usesCleartextTraffic: true,
      permissions: [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION"
      ],
      package: "com.gomess.ze.appeventosfatec"
    },
    web: {
      favicon: "./src/assets/icon.png"
    },
    plugins: [
      "expo-secure-store",
      "expo-location",
      [
        "expo-build-properties",
        {
          android: {
            usesCleartextTraffic: true
          }
        }
      ],
      "expo-font"
    ],
    extra: {
      eas: {
        projectId: "bdc45771-ef35-4317-8dae-4d57f52477ca"
      }
    }
  }
};