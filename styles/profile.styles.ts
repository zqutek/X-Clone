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
  profileInfo: {
    padding: 16,
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: COLORS.surface,
  },
  statsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    marginLeft: 24,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "800",
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  fullname: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },
  bio: {
    color: COLORS.text,
    lineHeight: 20,
  },
  mutedText: {
    color: COLORS.textMuted,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  editButton: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    borderColor: COLORS.border,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  editButtonText: {
    color: COLORS.text,
    fontWeight: "700",
  },
  shareButton: {
    width: 46,
    height: 38,
    borderRadius: 8,
    borderColor: COLORS.border,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  messageButton: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    marginTop: 10,
  },
  messageButtonText: {
    color: COLORS.text,
    fontWeight: "800",
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
  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 48,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.86)",
  },
  postModalContent: {
    flex: 1,
    justifyContent: "center",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "800",
  },
  modalImage: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: COLORS.surface,
  },
  modalCaption: {
    color: COLORS.text,
    lineHeight: 20,
    padding: 16,
  },
  editModalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  editModalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderColor: COLORS.border,
    borderWidth: 1,
    paddingBottom: 18,
  },
  form: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 12,
  },
  label: {
    color: COLORS.text,
    fontWeight: "700",
    marginBottom: 6,
  },
  input: {
    minHeight: 44,
    borderRadius: 8,
    borderColor: COLORS.border,
    borderWidth: 1,
    color: COLORS.text,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.surface,
  },
  bioInput: {
    minHeight: 92,
    textAlignVertical: "top",
  },
  saveButton: {
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    marginTop: 4,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: COLORS.text,
    fontWeight: "800",
  },
  followButton: {
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.text,
    marginTop: 16,
  },
  followingButton: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.border,
    borderWidth: 1,
  },
  followButtonText: {
    color: COLORS.background,
    fontWeight: "800",
  },
  followingButtonText: {
    color: COLORS.text,
  },
});
