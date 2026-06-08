import { MaterialIcons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { Image } from "expo-image";
import { useEffect, useRef } from "react";
import { Animated, Modal, Text, TouchableOpacity, View } from "react-native";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { COLORS } from "../constants/theme";
import { styles } from "../styles/feed.styles";

export type StoryWithAuthor = {
  _id: Id<"stories">;
  imageUrl: string;
  views: number;
  author: {
    username: string;
    image: string;
  };
};

type StoryViewerModalProps = {
  story: StoryWithAuthor | null;
  visible: boolean;
  onClose: () => void;
};

const STORY_VIEW_TIME = 5000;

export default function StoryViewerModal({
  story,
  visible,
  onClose,
}: StoryViewerModalProps) {
  const progress = useRef(new Animated.Value(0)).current;
  const incrementViews = useMutation(api.stories.incrementViews);

  useEffect(() => {
    if (!visible || !story) return;

    progress.setValue(0);
    incrementViews({ storyId: story._id }).catch((error) => {
      console.error("Error incrementing story views:", error);
    });

    const animation = Animated.timing(progress, {
      duration: STORY_VIEW_TIME,
      toValue: 1,
      useNativeDriver: false,
    });

    animation.start(({ finished }) => {
      if (finished) onClose();
    });

    return () => {
      animation.stop();
    };
  }, [incrementViews, onClose, progress, story, visible]);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <Modal animationType="fade" onRequestClose={onClose} visible={visible}>
      <View style={styles.storyViewerContainer}>
        <View style={styles.storyProgressTrack}>
          <Animated.View style={[styles.storyProgressFill, { width }]} />
        </View>
        <View style={styles.storyViewerHeader}>
          {!!story && (
            <View style={styles.storyViewerAuthor}>
              <Image
                source={story.author.image}
                style={styles.storyViewerAvatar}
                contentFit="cover"
              />
              <Text style={styles.storyViewerUsername}>@{story.author.username}</Text>
            </View>
          )}
          <TouchableOpacity onPress={onClose} style={styles.iconButton}>
            <MaterialIcons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        {!!story && (
          <Image
            source={story.imageUrl}
            style={styles.storyViewerImage}
            contentFit="contain"
          />
        )}
      </View>
    </Modal>
  );
}
