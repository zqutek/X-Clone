import { Dimensions, StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentDisabled: {
    opacity: 0.7,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.surface,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "600",
  },
  shareButton: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  shareButtonDisabled: {
    opacity: 0.5,
  },
  shareText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  emptyImageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyImageText: {
    color: COLORS.grey,
    fontSize: 16,
  },
  imageSection: {
    width,
    height: width,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  changeImageButton: {
    position: "absolute",
    right: 16,
    bottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    padding: 8,
  },
  changeImageText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "500",
  },
  inputSection: {
    flex: 1,
    padding: 16,
  },
  captionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  captionInput: {
    flex: 1,
    minHeight: 40,
    color: COLORS.white,
    fontSize: 16,
    paddingTop: 8,
  },
});
