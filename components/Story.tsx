import { Image } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/feed.styles";

type StoryProps = {
  story: {
    username: string;
    image: string;
    hasStory: boolean;
  };
  onPress?: () => void;
};

export default function Story({ story, onPress }: StoryProps) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.storyContainer}>
      <View
        style={[
          styles.storyRing,
          story.hasStory ? styles.activeStoryRing : styles.inactiveStoryRing,
        ]}
      >
        <Image source={story.image} style={styles.storyImage} contentFit="cover" />
      </View>
      <Text numberOfLines={1} style={styles.storyUsername}>
        {story.username}
      </Text>
    </TouchableOpacity>
  );
}
