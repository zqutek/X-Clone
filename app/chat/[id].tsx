import { MaterialIcons } from "@expo/vector-icons";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Loader from "../../components/Loader";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { COLORS } from "../../constants/theme";
import { styles } from "../../styles/chat.styles";

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const conversationId = id as Id<"conversations"> | undefined;
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const chatData = useQuery(
    api.chat.getMessages,
    isAuthenticated && conversationId ? { conversationId } : "skip"
  );
  const sendMessage = useMutation(api.chat.sendMessage);

  const handleSend = async () => {
    const trimmed = content.trim();
    if (!trimmed || !conversationId || isSending) return;

    try {
      setIsSending(true);
      setContent("");
      await sendMessage({ conversationId, content: trimmed });
    } catch (error) {
      setContent(trimmed);
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading || (isAuthenticated && chatData === undefined)) {
    return <Loader />;
  }

  const messages = chatData?.messages ?? [];
  const currentUser = chatData?.currentUser;
  const otherUser = chatData?.otherUser;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text numberOfLines={1} style={styles.headerTitle}>
          {otherUser ? `@${otherUser.username}` : "Chat"}
        </Text>
        <View style={styles.iconButton} />
      </View>

      <FlatList
        contentContainerStyle={styles.messagesList}
        data={messages}
        inverted
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const isOwn = item.senderId === currentUser?._id;

          return (
            <View
              style={[
                styles.messageRow,
                isOwn ? styles.ownMessageRow : styles.otherMessageRow,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  isOwn ? styles.ownBubble : styles.otherBubble,
                ]}
              >
                <Text style={styles.messageText}>{item.content}</Text>
              </View>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.inputContainer}>
        <TextInput
          multiline
          onChangeText={setContent}
          placeholder="Message..."
          placeholderTextColor={COLORS.textMuted}
          style={styles.input}
          value={content}
        />
        <TouchableOpacity
          disabled={isSending || !content.trim()}
          onPress={handleSend}
          style={[
            styles.sendButton,
            (isSending || !content.trim()) && styles.sendButtonDisabled,
          ]}
        >
          <MaterialIcons name="send" size={20} color={COLORS.text} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
