import { ActivityIndicator, StyleSheet, View } from "react-native";
import { COLORS } from "../constants/theme";

export default function SSOCallbackScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={COLORS.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
});
