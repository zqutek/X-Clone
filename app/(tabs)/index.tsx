import { useAuth } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import Loader from "../../components/Loader";
import Post, { FeedPost } from "../../components/Post";
import StoriesSection from "../../components/StoriesSection";
import { COLORS } from "../../constants/theme";
import { api } from "../../convex/_generated/api";
import { styles } from "../../styles/feed.styles";

export default function HomeScreen() {
  const { signOut } = useAuth();
  const posts = useQuery(api.posts.getPosts);

  if (posts === undefined) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>X Clone</Text>
        <TouchableOpacity onPress={() => signOut()} style={styles.iconButton}>
          <MaterialIcons name="logout" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        ListEmptyComponent={
          <View style={styles.emptyFeed}>
            <Text style={styles.emptyTitle}>No posts yet</Text>
            <Text style={styles.emptyText}>Create the first post from the Create tab.</Text>
          </View>
        }
        ListHeaderComponent={<StoriesSection />}
        contentContainerStyle={{ paddingBottom: 60 }}
        data={posts as FeedPost[]}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <Post post={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
