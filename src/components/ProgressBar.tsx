import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { COLORS } from "../styles/colors";

type ProgressBarProps = {
  presentes: number;
  total: number;
  progress: number;
};

const ProgressBar = ({ presentes, total, progress }: ProgressBarProps) => {
  const animatedProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 800,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const widthInterpolated = animatedProgress.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width: widthInterpolated }]} />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.summaryText}>
          <Text style={styles.summaryNumber}>{presentes}</Text> / {total}
          <Text> Participantes Presentes</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: 45,
    justifyContent: "center",
    marginTop: 5,
    overflow: "hidden",
    borderRadius: 8,
  },
  track: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
    position: "absolute",
  },
  fill: {
    height: "100%",
    backgroundColor: "#28a745",
    borderRadius: 8,
  },
  textContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryText: {
    fontSize: 16,
    color: COLORS.textoPrincipal,
    fontWeight: "500",
  },
  summaryNumber: {
    fontWeight: "bold",
    fontSize: 20,
    color: COLORS.textoPrincipal,
  },
});

export default ProgressBar;
