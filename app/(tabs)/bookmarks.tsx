import { MaterialIcons } from "@expo/vector-icons";
import { useConvexAuth, useQuery } from "convex/react";
import { Image } from "expo-image";
import { FlatList, Text, View } from "react-native";
import Loader from "../../components/Loader";
import { api } from "../../convex/_generated/api";
import { COLORS } from "../../constants/theme";
import { styles } from "../../styles/notifications.styles";

function NoBookmarksFound() {
  return (
    <View style={styles.centered}>
      <MaterialIcons name="bookmark-border" size={44} color={COLORS.textMuted} />
      <Text style={styles.emptyTitle}>No bookmarks yet</Text>
      <Text style={styles.emptyText}>
        Saved posts will appear here after you tap the bookmark icon.
      </Text>
    </View>
  );
}

export default function BookmarksScreen() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const posts = useQuery(
    api.bookmarks.getBookmarkedPosts,
    isAuthenticated ? {} : "skip"
  );

  if (isLoading || (isAuthenticated && posts === undefined)) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookmarks</Text>
      </View>

      {!isAuthenticated || !posts?.length ? (
        <NoBookmarksFound />
      ) : (
        <FlatList
          contentContainerStyle={styles.gridContent}
          data={posts}
          keyExtractor={(item) => item._id}
          numColumns={3}
          renderItem={({ item }) => (
            <View style={styles.gridItem}>
              <Image source={item.imageUrl} style={styles.gridImage} contentFit="cover" />
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
