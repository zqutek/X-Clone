import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants/theme";

export default function CreateScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Post</Text>
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
  title: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "700",
  },
});
