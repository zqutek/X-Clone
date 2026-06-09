import { StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
    padding: 24,
  },
  title: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonText: {
    color: COLORS.text,
    fontWeight: "600",
  },
  captcha: {
    marginTop: 12,
  },
});
