import { MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { COLORS } from "../constants/theme";
import { styles } from "../styles/feed.styles";
import Comment from "./Comment";
import Loader from "./Loader";

type CommentsModalProps = {
  postId: Id<"posts">;
  visible: boolean;
  onClose: () => void;
  onCommentAdded: () => void;
};

export default function CommentsModal({
  postId,
  visible,
  onClose,
  onCommentAdded,
}: CommentsModalProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const comments = useQuery(api.comments.getComments, visible ? { postId } : "skip");
  const addComment = useMutation(api.comments.addComment);

  const handleSubmit = async () => {
    const trimmed = content.trim();
    if (!trimmed || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await addComment({ postId, content: trimmed });
      setContent("");
      onCommentAdded();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Comments</Text>
            <TouchableOpacity onPress={onClose} style={styles.iconButton}>
              <MaterialIcons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          {comments === undefined ? (
            <Loader />
          ) : (
            <FlatList
              contentContainerStyle={styles.commentsList}
              data={comments}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => <Comment comment={item} />}
            />
          )}

          <View style={styles.inputRow}>
            <TextInput
              multiline
              onChangeText={setContent}
              placeholder="Add a comment..."
              placeholderTextColor={COLORS.textMuted}
              style={styles.commentInput}
              value={content}
            />
            <TouchableOpacity
              disabled={isSubmitting || !content.trim()}
              onPress={handleSubmit}
              style={styles.sendButton}
            >
              <Text style={styles.sendText}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
