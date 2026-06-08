import { StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "800",
    fontFamily: "JetBrainsMono",
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingBottom: 20,
  },
  conversationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.surface,
    marginRight: 12,
  },
  conversationBody: {
    flex: 1,
  },
  username: {
    color: COLORS.text,
    fontWeight: "800",
    marginBottom: 4,
  },
  preview: {
    color: COLORS.textMuted,
  },
  timeText: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "800",
    marginTop: 14,
    marginBottom: 8,
  },
  emptyText: {
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
  messagesList: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  messageRow: {
    marginVertical: 4,
    flexDirection: "row",
  },
  ownMessageRow: {
    justifyContent: "flex-end",
  },
  otherMessageRow: {
    justifyContent: "flex-start",
  },
  messageBubble: {
    maxWidth: "78%",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  ownBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: COLORS.text,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    minHeight: 42,
    maxHeight: 96,
    borderRadius: 21,
    backgroundColor: COLORS.surface,
    color: COLORS.text,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
  },
  sendButtonDisabled: {
    opacity: 0.55,
  },
});
