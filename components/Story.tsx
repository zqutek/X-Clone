import { Image } from "expo-image";
import { Text, View } from "react-native";
import { styles } from "../styles/feed.styles";

type StoryProps = {
  story: {
    username: string;
    image: string;
    hasStory: boolean;
  };
};

export default function Story({ story }: StoryProps) {
  return (
    <View style={styles.storyContainer}>
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
    </View>
  );
}
