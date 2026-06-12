import { MaterialIcons } from "@expo/vector-icons";
import { useConvexAuth, useQuery } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import Loader from "../../components/Loader";
import Post, { FeedPost } from "../../components/Post";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { COLORS } from "../../constants/theme";
import { styles } from "../../styles/feed.styles";

export default function PostScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const postId = id as Id<"posts"> | undefined;
  const post = useQuery(
    api.posts.getPostById,
    isAuthenticated && postId ? { postId } : "skip"
  );

  if (isLoading || (isAuthenticated && post === undefined)) {
    return <Loader />;
  }

  if (!post) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post</Text>
          <View style={styles.iconButton} />
        </View>
        <View style={styles.emptyFeed}>
          <Text style={styles.emptyTitle}>Post not found</Text>
          <Text style={styles.emptyText}>This post is no longer available.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post</Text>
        <View style={styles.iconButton} />
      </View>
      <Post post={post as FeedPost} />
    </View>
  );
}
