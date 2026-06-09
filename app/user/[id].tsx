import { useUser } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import Loader from "../../components/Loader";
import { FeedPost } from "../../components/Post";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { COLORS } from "../../constants/theme";
import { styles } from "../../styles/profile.styles";

function NoPostsFound() {
  return (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="grid-off" size={44} color={COLORS.textMuted} />
      <Text style={styles.emptyTitle}>No posts yet</Text>
      <Text style={styles.emptyText}>This user has not shared any posts.</Text>
    </View>
  );
}

export default function UserProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useUser();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const userId = id as Id<"users"> | undefined;
  const [isToggling, setIsToggling] = useState(false);
  const [localFollowing, setLocalFollowing] = useState(false);
  const [localFollowers, setLocalFollowers] = useState<number | null>(null);
  const [isOpeningChat, setIsOpeningChat] = useState(false);

  const profile = useQuery(
    api.users.getUserProfile,
    isAuthenticated && userId ? { userId } : "skip"
  );
  const posts = useQuery(
    api.posts.getPostsByUser,
    isAuthenticated && userId ? { userId } : "skip"
  );
  const following = useQuery(
    api.users.isFollowing,
    isAuthenticated && userId ? { followingId: userId } : "skip"
  );
  const toggleFollow = useMutation(api.users.toggleFollow);
  const getOrCreateConversation = useMutation(api.chat.getOrCreateConversation);

  useEffect(() => {
    console.log("[profile-debug] user/[id] getUserProfile args", {
      routeId: id,
      userId,
      isAuthenticated,
    });
  }, [id, isAuthenticated, userId]);

  useEffect(() => {
    console.log("[profile-debug] user/[id] getUserProfile result", {
      userId,
      state:
        profile === undefined ? "loading" : profile === null ? "null" : "found",
      convexUserId: profile?._id,
      clerkId: profile?.clerkId,
      email: profile?.email,
    });
  }, [profile, userId]);

  useEffect(() => {
    if (profile?.clerkId && profile.clerkId === user?.id) {
      router.replace("/(tabs)/profile");
    }
  }, [profile?.clerkId, router, user?.id]);

  useEffect(() => {
    if (following !== undefined) {
      setLocalFollowing(following);
    }
  }, [following]);

  useEffect(() => {
    if (profile) {
      setLocalFollowers(profile.followers);
    }
  }, [profile]);

  const handleToggleFollow = async () => {
    if (!userId || isToggling) return;

    const nextFollowing = !localFollowing;
    setLocalFollowing(nextFollowing);
    setLocalFollowers((count) =>
      count === null ? count : Math.max(0, count + (nextFollowing ? 1 : -1))
    );

    try {
      setIsToggling(true);
      await toggleFollow({ followingId: userId });
    } catch (error) {
      setLocalFollowing(!nextFollowing);
      setLocalFollowers((count) =>
        count === null ? count : Math.max(0, count + (nextFollowing ? -1 : 1))
      );
      console.error("Error toggling follow:", error);
    } finally {
      setIsToggling(false);
    }
  };

  const handleMessage = async () => {
    if (!userId || isOpeningChat) return;

    try {
      setIsOpeningChat(true);
      const conversationId = await getOrCreateConversation({ userId });
      router.push(`/chat/${conversationId}` as any);
    } catch (error) {
      console.error("Error opening chat:", error);
    } finally {
      setIsOpeningChat(false);
    }
  };

  if (
    isLoading ||
    (isAuthenticated &&
      (profile === undefined || posts === undefined || following === undefined))
  ) {
    return <Loader />;
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.iconButton} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>User not found</Text>
          <Text style={styles.emptyText}>This profile is no longer available.</Text>
        </View>
      </View>
    );
  }

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text numberOfLines={1} style={styles.headerTitle}>
          @{profile.username}
        </Text>
        <View style={styles.iconButton} />
      </View>

      <View style={styles.profileInfo}>
        <View style={styles.topRow}>
          <Image source={profile.image} style={styles.avatar} contentFit="cover" />
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profile.posts}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {localFollowers ?? profile.followers}
              </Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profile.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>

        <Text style={styles.fullname}>{profile.fullname}</Text>
        <Text style={profile.bio ? styles.bio : styles.mutedText}>
          {profile.bio || "No bio yet."}
        </Text>

        <TouchableOpacity
          disabled={isToggling}
          onPress={handleToggleFollow}
          style={[
            styles.followButton,
            localFollowing && styles.followingButton,
            isToggling && styles.saveButtonDisabled,
          ]}
        >
          <Text
            style={[
              styles.followButtonText,
              localFollowing && styles.followingButtonText,
            ]}
          >
            {localFollowing ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={isOpeningChat}
          onPress={handleMessage}
          style={[styles.messageButton, isOpeningChat && styles.saveButtonDisabled]}
        >
          <Text style={styles.messageButtonText}>
            {isOpeningChat ? "Opening..." : "Message"}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ListEmptyComponent={<NoPostsFound />}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.gridContent}
        data={(posts ?? []) as FeedPost[]}
        keyExtractor={(item) => item._id}
        numColumns={3}
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <Image source={item.imageUrl} style={styles.gridImage} contentFit="cover" />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
