import { MaterialIcons } from "@expo/vector-icons";
import { useConvexAuth, useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import Loader from "../components/Loader";
import { api } from "../convex/_generated/api";
import { COLORS } from "../constants/theme";
import { styles } from "../styles/chat.styles";

function EmptyChats() {
  return (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="chat-bubble-outline" size={44} color={COLORS.textMuted} />
      <Text style={styles.emptyTitle}>No chats yet</Text>
      <Text style={styles.emptyText}>
        Open another user's profile and press Message to start a conversation.
      </Text>
    </View>
  );
}

export default function ChatsScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const conversations = useQuery(
    api.chat.getConversations,
    isAuthenticated ? {} : "skip"
  );

  if (isLoading || (isAuthenticated && conversations === undefined)) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chats</Text>
        <View style={styles.iconButton} />
      </View>

      {!conversations?.length ? (
        <EmptyChats />
      ) : (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={conversations}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push(`/chat/${item._id}` as any)}
              style={styles.conversationItem}
            >
              <Image
                source={item.otherUser.image}
                style={styles.avatar}
                contentFit="cover"
              />
              <View style={styles.conversationBody}>
                <Text numberOfLines={1} style={styles.username}>
                  @{item.otherUser.username}
                </Text>
                <Text numberOfLines={1} style={styles.preview}>
                  {item.lastMessage || "No messages yet"}
                </Text>
              </View>
              {!!item.lastMessageAt && (
                <Text style={styles.timeText}>
                  {formatDistanceToNow(new Date(item.lastMessageAt), {
                    addSuffix: true,
                  })}
                </Text>
              )}
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
