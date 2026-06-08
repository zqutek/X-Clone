import { MaterialIcons } from "@expo/vector-icons";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { fetch } from "expo/fetch";
import { File } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { api } from "../convex/_generated/api";
import { COLORS } from "../constants/theme";
import { styles } from "../styles/feed.styles";
import Story from "./Story";
import StoryViewerModal, { StoryWithAuthor } from "./StoryViewerModal";

export default function StoriesSection() {
  const { isAuthenticated } = useConvexAuth();
  const [selectedStory, setSelectedStory] = useState<StoryWithAuthor | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const stories = useQuery(
    api.stories.getActiveStories,
    isAuthenticated ? {} : "skip"
  );
  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  const createStory = useMutation(api.stories.createStory);

  const handleAddStory = async () => {
    if (isUploading) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [9, 16],
      quality: 0.8,
    });

    if (result.canceled) return;

    try {
      setIsUploading(true);
      const uploadUrl = await generateUploadUrl();
      const file = new File(result.assets[0].uri);

      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": file.type || "image/jpeg",
        },
        body: file,
      });

      if (!uploadResponse.ok) throw new Error("Story upload failed");

      const { storageId } = await uploadResponse.json();
      await createStory({ storageId });
    } catch (error) {
      console.error("Error creating story:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.storiesContainer}>
      <FlatList
        contentContainerStyle={styles.storiesContent}
        data={(stories ?? []) as StoryWithAuthor[]}
        horizontal
        keyExtractor={(item) => item._id}
        ListHeaderComponent={
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleAddStory}
            style={styles.storyContainer}
          >
            <View style={styles.addStoryRing}>
              <MaterialIcons
                name={isUploading ? "hourglass-empty" : "add"}
                size={28}
                color={COLORS.primary}
              />
            </View>
            <Text numberOfLines={1} style={styles.storyUsername}>
              Add Story
            </Text>
          </TouchableOpacity>
        }
        renderItem={({ item }) => (
          <Story
            onPress={() => setSelectedStory(item)}
            story={{
              username: item.author.username,
              image: item.author.image,
              hasStory: true,
            }}
          />
        )}
        showsHorizontalScrollIndicator={false}
      />
      <StoryViewerModal
        onClose={() => setSelectedStory(null)}
        story={selectedStory}
        visible={!!selectedStory}
      />
    </View>
  );
}
