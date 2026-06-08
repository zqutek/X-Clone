import { useUser } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { COLORS } from "../constants/theme";
import { styles } from "../styles/feed.styles";
import CommentsModal from "./CommentsModal";

export type FeedPost = {
  _id: Id<"posts">;
  _creationTime: number;
  imageUrl: string;
  caption?: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
  author: {
    _id: Id<"users">;
    clerkId: string;
    username: string;
    fullname: string;
    image: string;
  };
};

type PostProps = {
  post: FeedPost;
};

export default function Post({ post }: PostProps) {
  const router = useRouter();
  const { user } = useUser();
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [commentsCount, setCommentsCount] = useState(post.comments);
  const [commentsVisible, setCommentsVisible] = useState(false);

  const toggleLike = useMutation(api.posts.toggleLike);
  const toggleBookmark = useMutation(api.bookmarks.toggleBookmark);
  const deletePost = useMutation(api.posts.deletePost);

  const isOwnPost = user?.id === post.author.clerkId;

  const openAuthorProfile = () => {
    if (isOwnPost) {
      router.push("/(tabs)/profile");
      return;
    }

    router.push(`/user/${post.author._id}` as any);
  };

  useEffect(() => {
    setIsLiked(post.isLiked);
    setIsBookmarked(post.isBookmarked);
    setLikesCount(post.likes);
    setCommentsCount(post.comments);
  }, [post]);

  const handleLike = async () => {
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikesCount((count) => count + (nextLiked ? 1 : -1));

    try {
      await toggleLike({ postId: post._id });
    } catch (error) {
      setIsLiked(!nextLiked);
      setLikesCount((count) => count + (nextLiked ? -1 : 1));
      console.error("Error toggling like:", error);
    }
  };

  const handleBookmark = async () => {
    const nextBookmarked = !isBookmarked;
    setIsBookmarked(nextBookmarked);

    try {
      await toggleBookmark({ postId: post._id });
    } catch (error) {
      setIsBookmarked(!nextBookmarked);
      console.error("Error toggling bookmark:", error);
    }
  };

  const confirmDelete = () => {
    Alert.alert("Delete post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deletePost({ postId: post._id });
          } catch (error) {
            console.error("Error deleting post:", error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <TouchableOpacity onPress={openAuthorProfile}>
          <Image source={post.author.image} style={styles.avatar} contentFit="cover" />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={openAuthorProfile}
          style={styles.postAuthor}
        >
          <Text numberOfLines={1} style={styles.fullname}>
            {post.author.fullname}
          </Text>
          <Text numberOfLines={1} style={styles.username}>
            @{post.author.username}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={isOwnPost ? confirmDelete : undefined}
          style={styles.iconButton}
        >
          <MaterialIcons
            name={isOwnPost ? "delete-outline" : "more-horiz"}
            size={24}
            color={isOwnPost ? "#F4212E" : COLORS.textMuted}
          />
        </TouchableOpacity>
      </View>

      <Image source={post.imageUrl} style={styles.postImage} contentFit="cover" />

      <View style={styles.actionsRow}>
        <View style={styles.leftActions}>
          <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
            <MaterialIcons
              name={isLiked ? "favorite" : "favorite-border"}
              size={27}
              color={isLiked ? "#F4212E" : COLORS.text}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setCommentsVisible(true)}
            style={styles.actionButton}
          >
            <MaterialIcons name="chat-bubble-outline" size={25} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleBookmark} style={styles.actionButton}>
          <MaterialIcons
            name={isBookmarked ? "bookmark" : "bookmark-border"}
            size={27}
            color={isBookmarked ? COLORS.primary : COLORS.text}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.postInfo}>
        <Text style={styles.likesText}>
          {likesCount} {likesCount === 1 ? "like" : "likes"}
        </Text>
        {!!post.caption && (
          <Text style={styles.captionText}>
            <Text style={styles.captionUsername}>@{post.author.username} </Text>
            {post.caption}
          </Text>
        )}
        <TouchableOpacity onPress={() => setCommentsVisible(true)}>
          <Text style={styles.commentsText}>
            View all {commentsCount} {commentsCount === 1 ? "comment" : "comments"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.timeText}>
          {formatDistanceToNow(new Date(post._creationTime), { addSuffix: true })}
        </Text>
      </View>

      <CommentsModal
        onClose={() => setCommentsVisible(false)}
        onCommentAdded={() => setCommentsCount((count) => count + 1)}
        postId={post._id}
        visible={commentsVisible}
      />
    </View>
  );
}
