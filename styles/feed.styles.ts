import { StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "800",
    fontFamily: "JetBrainsMono",
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  storiesContainer: {
    paddingVertical: 12,
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
  },
  storiesContent: {
    paddingHorizontal: 12,
    gap: 14,
  },
  storyContainer: {
    width: 72,
    alignItems: "center",
  },
  addStoryRing: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    marginBottom: 6,
  },
  storyRing: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    marginBottom: 6,
  },
  activeStoryRing: {
    borderColor: COLORS.primary,
  },
  inactiveStoryRing: {
    borderColor: COLORS.border,
  },
  storyImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  storyUsername: {
    color: COLORS.text,
    fontSize: 12,
  },
  emptyFeed: {
    alignItems: "center",
    paddingTop: 56,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptyText: {
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
  postContainer: {
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
    paddingBottom: 14,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.surface,
  },
  postAuthor: {
    flex: 1,
    marginLeft: 10,
  },
  fullname: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "700",
  },
  username: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  postImage: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: COLORS.surface,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingTop: 10,
  },
  leftActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    width: 42,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  postInfo: {
    paddingHorizontal: 14,
  },
  likesText: {
    color: COLORS.text,
    fontWeight: "700",
    marginBottom: 6,
  },
  captionText: {
    color: COLORS.text,
    lineHeight: 20,
  },
  captionUsername: {
    fontWeight: "700",
  },
  commentsText: {
    color: COLORS.textMuted,
    marginTop: 6,
  },
  timeText: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    justifyContent: "flex-end",
  },
  modalContent: {
    height: "75%",
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderColor: COLORS.border,
    borderWidth: 1,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "700",
  },
  commentsList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  commentContainer: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 10,
  },
  commentBody: {
    flex: 1,
  },
  commentText: {
    color: COLORS.text,
    lineHeight: 20,
    marginTop: 2,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
  },
  commentInput: {
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
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sendText: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  storyViewerContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  storyProgressTrack: {
    height: 3,
    backgroundColor: COLORS.border,
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: 2,
    overflow: "hidden",
  },
  storyProgressFill: {
    height: "100%",
    backgroundColor: COLORS.text,
  },
  storyViewerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  storyViewerAuthor: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 10,
  },
  storyViewerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
  },
  storyViewerUsername: {
    color: COLORS.text,
    fontWeight: "800",
  },
  storyViewerImage: {
    flex: 1,
    width: "100%",
    backgroundColor: COLORS.background,
  },
});
