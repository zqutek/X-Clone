import { useAuth } from "@clerk/clerk-expo";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants/theme";

export default function HomeScreen() {
  const { signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feed</Text>
      <TouchableOpacity style={styles.signOutButton} onPress={() => signOut()}>
        <Text style={styles.signOutText}>Sign out</Text>
      </TouchableOpacity>
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
    marginBottom: 20,
  },
  signOutButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  signOutText: {
    color: COLORS.text,
    fontWeight: "600",
  },
});
