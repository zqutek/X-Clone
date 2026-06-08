import { StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "800",
    fontFamily: "JetBrainsMono",
  },
  listContent: {
    paddingBottom: 64,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
  },
  avatarWrap: {
    width: 52,
    height: 52,
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
  },
  iconBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    borderColor: COLORS.background,
    borderWidth: 2,
  },
  itemBody: {
    flex: 1,
    paddingRight: 10,
  },
  itemText: {
    color: COLORS.text,
    lineHeight: 20,
  },
  username: {
    fontWeight: "800",
  },
  commentText: {
    color: COLORS.textMuted,
    marginTop: 4,
  },
  timeText: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 6,
  },
  postThumb: {
    width: 46,
    height: 46,
    borderRadius: 6,
    backgroundColor: COLORS.surface,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "700",
    marginTop: 14,
    marginBottom: 8,
  },
  emptyText: {
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
  gridContent: {
    paddingBottom: 64,
  },
  gridItem: {
    width: "33.33%",
    aspectRatio: 1,
    padding: 1,
  },
  gridImage: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.surface,
  },
});
