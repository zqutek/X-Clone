import { MaterialIcons } from "@expo/vector-icons";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Loader from "../../components/Loader";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { COLORS } from "../../constants/theme";

const screenWidth = Dimensions.get("window").width;
const gridItemSize = Math.floor((screenWidth - 4) / 3);

type UserResult = {
  _id: Id<"users">;
  username: string;
  fullname: string;
  image: string;
  followers: number;
  isFollowing: boolean;
};

type PostResult = {
  _id: Id<"posts">;
  imageUrl: string;
  likes: number;
  author: {
    username: string;
  };
};

function UserResultItem({
  onFollowToggle,
  user,
}: {
  onFollowToggle: (userId: Id<"users">) => void;
  user: UserResult;
}) {
  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => router.push(`/user/${user._id}` as any)}
      style={styles.userItem}
    >
      <Image source={user.image} style={styles.userAvatar} contentFit="cover" />
      <View style={styles.userInfo}>
        <Text numberOfLines={1} style={styles.userUsername}>
          @{user.username}
        </Text>
        <Text numberOfLines={1} style={styles.userFullname}>
          {user.fullname}
        </Text>
        <Text style={styles.userFollowers}>
          {user.followers} {user.followers === 1 ? "follower" : "followers"}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => onFollowToggle(user._id)}
        style={[styles.followButton, user.isFollowing && styles.followingButton]}
      >
        <Text
          style={[
            styles.followButtonText,
            user.isFollowing && styles.followingButtonText,
          ]}
        >
          {user.isFollowing ? "Following" : "Follow"}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

function PostGridItem({ post }: { post: PostResult }) {
  return (
    <Link href={`/post/${post._id}` as any} asChild>
      <TouchableOpacity activeOpacity={0.85} style={styles.gridItem}>
        <Image source={post.imageUrl} style={styles.gridImage} contentFit="cover" />
        <View style={styles.gridOverlay}>
          <MaterialIcons name="favorite" size={13} color={COLORS.white} />
          <Text style={styles.gridLikes}>{post.likes}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

export default function ExploreScreen() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const toggleFollow = useMutation(api.users.toggleFollow);
  const trimmedQuery = searchQuery.trim();
  const hasQuery = trimmedQuery.length > 0;

  const explorePosts = useQuery(
    api.search.getExplorePosts,
    isAuthenticated && !hasQuery ? {} : "skip"
  );
  const userResults = useQuery(
    api.search.searchUsers,
    isAuthenticated && hasQuery ? { searchQuery: trimmedQuery } : "skip"
  );
  const postResults = useQuery(
    api.search.searchPosts,
    isAuthenticated && hasQuery ? { searchQuery: trimmedQuery } : "skip"
  );

  const isSearchLoading = hasQuery && (userResults === undefined || postResults === undefined);
  const isExploreLoading = !hasQuery && explorePosts === undefined;

  const handleFollowToggle = useCallback(
    async (userId: Id<"users">) => {
      try {
        await toggleFollow({ followingId: userId });
      } catch (error) {
        console.error("Error toggling follow:", error);
      }
    },
    [toggleFollow]
  );

  const searchSections = useMemo(
    () => [
      { key: "people", title: "People", data: userResults ?? [] },
      { key: "posts", title: "Posts", data: postResults ?? [] },
    ],
    [postResults, userResults]
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
      </View>

      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={22} color={COLORS.textMuted} />
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={setSearchQuery}
          placeholder="Search users or #hashtags"
          placeholderTextColor={COLORS.textMuted}
          returnKeyType="search"
          style={styles.searchInput}
          value={searchQuery}
        />
        {hasQuery && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <MaterialIcons name="cancel" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {!hasQuery ? (
        <>
          <Text style={styles.sectionTitle}>Popular Posts</Text>
          {isExploreLoading ? (
            <ActivityIndicator color={COLORS.primary} style={styles.loader} />
          ) : (
            <FlatList
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <MaterialIcons
                    name="photo-library"
                    size={44}
                    color={COLORS.textMuted}
                  />
                  <Text style={styles.emptyText}>No posts yet</Text>
                </View>
              }
              contentContainerStyle={styles.gridContent}
              data={(explorePosts ?? []) as PostResult[]}
              keyExtractor={(item) => item._id}
              numColumns={3}
              renderItem={({ item }) => <PostGridItem post={item} />}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      ) : (
        <FlatList
          ListHeaderComponent={
            <>
              {isSearchLoading ? (
                <ActivityIndicator color={COLORS.primary} style={styles.loader} />
              ) : (
                <>
                  {searchSections[0].data.length > 0 && (
                    <>
                      <Text style={styles.sectionTitle}>People</Text>
                      {(searchSections[0].data as UserResult[]).map((user) => (
                        <UserResultItem
                          key={user._id}
                          onFollowToggle={handleFollowToggle}
                          user={user}
                        />
                      ))}
                    </>
                  )}

                  {searchSections[1].data.length > 0 && (
                    <>
                      <Text style={styles.sectionTitle}>Posts</Text>
                      <View style={styles.postsGrid}>
                        {(searchSections[1].data as PostResult[]).map((post) => (
                          <PostGridItem key={post._id} post={post} />
                        ))}
                      </View>
                    </>
                  )}

                  {userResults?.length === 0 && postResults?.length === 0 && (
                    <View style={styles.emptyContainer}>
                      <MaterialIcons name="search-off" size={44} color={COLORS.textMuted} />
                      <Text style={styles.emptyText}>No results for "{trimmedQuery}"</Text>
                      <Text style={styles.emptySubtext}>
                        Try a username, name, caption, or hashtag.
                      </Text>
                    </View>
                  )}
                </>
              )}
            </>
          }
          contentContainerStyle={styles.searchContent}
          data={[]}
          keyExtractor={() => "search-results"}
          renderItem={() => null}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 12,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: "700",
  },
  searchContainer: {
    minHeight: 46,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 8,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  gridContent: {
    paddingBottom: 70,
  },
  postsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  gridItem: {
    width: gridItemSize,
    height: gridItemSize,
    margin: 0.5,
    backgroundColor: COLORS.card,
  },
  gridImage: {
    width: "100%",
    height: "100%",
  },
  gridOverlay: {
    position: "absolute",
    left: 6,
    bottom: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  gridLikes: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "700",
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: COLORS.card,
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
  },
  userUsername: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "700",
  },
  userFullname: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginTop: 2,
  },
  userFollowers: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 3,
  },
  followButton: {
    minWidth: 94,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  followingButton: {
    backgroundColor: COLORS.primary,
  },
  followButtonText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  followingButtonText: {
    color: COLORS.text,
  },
  searchContent: {
    paddingBottom: 80,
  },
  loader: {
    marginTop: 40,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 64,
    paddingHorizontal: 24,
    gap: 8,
  },
  emptyText: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },
  emptySubtext: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: "center",
  },
});
